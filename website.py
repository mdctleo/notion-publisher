from client import NotionClient
import sched, time
import zipfile
import io
import threading
import subprocess
import os
from os.path import join
from os import listdir, rmdir, scandir
from shutil import move
from bs4 import BeautifulSoup

lock = threading.RLock()


class WebsiteMaker:
    def __init__(self, token_v2, index, selection):
        self.token_v2 = token_v2
        self.index = index
        self.selection = selection
        self.client = NotionClient(token_v2)
        self.scheduler = sched.scheduler(time.time, time.sleep)
        self.results = []

    def make_website(self):
        """
        Entry method to - download files, prepare files for deployment and finally deploy the files
        """
        taskIds = self.client.enqueue_tasks(self.selection)
        wait_time = 2.0
        for i in range(len(taskIds)):
            if i % 10 == 0 and i != 0:
                wait_time += 0.5

        temp_dir_name = self.make_website_folder()
        self.is_download_complete(taskIds, wait_time)
        file_streams = self.client.download_files(self.results)
        self.save_downloaded_files(file_streams, temp_dir_name)
        self.prepare_deployment(temp_dir_name)

    def make_website_folder(self):
        """
        Makes a temp folder for downloaded html file and deployment preparations
        """
        try:
            lock.acquire()
            next_available_dir_name = self.find_available_dir_name()
            os.mkdir("./websites/in-progress/" + next_available_dir_name)
        except FileExistsError as e:
            raise e
        finally:
            lock.release()

        return next_available_dir_name

    def find_available_dir_name(self):
        """ Find available temp directory name, all directory in in-progress is incremented numbers

        :return: an available temp directory name
        :rtype: str
        """
        website_dirs = os.scandir("./websites/in-progress")
        return str(int(max([website_dir.name for website_dir in website_dirs if website_dir.name != '.DS_Store'], default=-1, key=int)) + 1)

    # TODO: look into more how notion does downloading, a continous check does not seem like the best option
    def is_download_complete(self, taskIds, wait_time):
        """ Check at set interval to see if files are ready for export from notion

        :param taskIds: A list of taskIds returned by notion when downloads are enqueued
        :type taskIds: str
        :param wait_time: wait interval
        :type wait_time: float
        """
        results = self.client.get_tasks(taskIds)
        finished_all_tasks = True
        for task in results:
            if task['state'] != 'success':
                finished_all_tasks = False
                break

        if finished_all_tasks == True:
            self.results = results
        else:
            self.scheduler.enter(wait_time, 1, self.is_download_complete, (taskIds, wait_time))
            self.scheduler.run(blocking=True)

    # TODO: see if it is better to do link replacing in memory
    def save_downloaded_files(self, file_streams, temp_dir_name):
        """ Unzip and save downloaded files from notion in temp folder

        :param file_streams: A list of file streams returned by notion export
        :type file_streams: Bytes
        :param temp_dir_name: The Temp's directory name we are saving the streams to
        :type temp_dir_name: str
        """
        for i in range(len(file_streams)):
            file_stream = zipfile.ZipFile(io.BytesIO(file_streams[i]))
            blockId = self.results[i]['request']['blockId']
            file_stream.extractall("websites/in-progress/" + temp_dir_name + "/" + blockId)


    # every https://www.notion.so starting href should be replaced with a local relative link
    # or an empty link if a local file does not exist
    # replace - with %20?
    def prepare_deployment(self, temp_dir_name):
        self.bring_to_root(temp_dir_name)
        file_name_map = self.create_filename_map(temp_dir_name)
        self.rename_index_page(temp_dir_name, file_name_map)
        self.rename_links(temp_dir_name, file_name_map)

    def create_filename_map(self, temp_dir_name):
        """ Create a mapping between block_id and actual filenames

        :param temp_dir_name: The temp directory's name
        :type temp_dir_name: str
        :return file_name_map: A dictionary that contains block_id and actual filename
        :rtype file_name_map: dict
        """
        file_name_map = {}
        for file in os.scandir(join("./websites/in-progress", temp_dir_name)):
            block_id = file.name.split(" ")[-1].split(".")[0]
            file_name_map[block_id] = file.name

        return file_name_map


    def bring_to_root(self, temp_dir_name):
        """ Bring the separate pages from their individual directory to the same level
        as the temp directory

        :param temp_dir_name: The temp directory's name
        :type temp_dir_name: str
        """
        root = join("websites/in-progress", temp_dir_name)
        website_dir = scandir(root)

        for page_dir in website_dir:
            for item in listdir(join(root, page_dir.name)):
                move(join(root, page_dir.name, item), root)
            rmdir(join(root, page_dir.name))

    def rename_index_page(self, temp_dir_name, file_name_map):
        """ Rename index page to index.html, returns original name

        :param temp_dir_name: The temp directory's name
        :type temp_dir_name: str
        :param file_name_map: A dictionary that contains block_id and actual filename
        :type file_name_map: dict
        """
        index_block_id = self.index.replace("-", "")
        if index_block_id in file_name_map:
            os.rename(join("./websites/in-progress", temp_dir_name, file_name_map[index_block_id]),
                      join("./websites/in-progress", temp_dir_name, "index.html"))
            file_name_map[index_block_id] = "index.html"

    def rename_links(self, temp_dir_name, file_name_map):
        """ Rename absolute links to relative links in every page using beautiful soup

        :param temp_dir_name: The temp directory's name
        :type temp_dir_name: str
        :param file_name_map: A dictionary that contains block_id and actual filename
        :type file_name_map: dict
        """

        for file in os.scandir(join("websites/in-progress", temp_dir_name)):
            if not file.is_dir():
                with open(file, "r+") as fp:
                    soup = BeautifulSoup(fp, "html.parser")
                    for link in soup.body.find_all("a"):
                        href = link.get('href')
                        if self.is_link_notion(href):
                            href_block_id = self.extract_block_id(href)
                            link['href'] = file_name_map[href_block_id] if href_block_id in file_name_map else ""


                    fp.seek(0)
                    fp.write(str(soup))
                    fp.truncate()
                    fp.close()


    def is_link_notion(self, link):
        """ test if the given link starts with https://www.notion.so

        :param link: href of an anchor tag
        :return: if the link is a notion link
        :rtype: bool
        """
        return link.split("/")[2] == "www.notion.so" if len(link.split("/")) > 2 else False

    def extract_block_id(self, link):
        """ Extract the block id portion of a notion link

        :param link:
        :type link: str
        :return: The block id portion of a notion link
        :rtype: str
        """
        return link.split("/")[-1].split("-")[-1]

    def deploy_website(self, folder):
        return None
