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
        taskIds = self.client.enqueue_tasks(self.selection)
        wait_time = 2.0
        for i in range(len(taskIds)):
            if i % 10 == 0 and i != 0:
                wait_time += 0.5

        temp_dir_name = self.make_website_folder()
        self.is_download_complete(taskIds, wait_time)
        file_streams = self.client.download_files(self.results)
        self.save_downloaded_files(file_streams, temp_dir_name)
        # self.prepare_deployment(temp_dir_name)

    '''
    acquire lock, make a folder with a temp unique name by executing a bash script, release lock
    @:return str folder_name
    '''
    def make_website_folder(self):
        try:
            lock.acquire()
            next_available_dir_name = self.find_available_dir_name()
            os.mkdir("./websites/in-progress/" + next_available_dir_name)
        # status = subprocess.run(["./scripts/make-directory.sh", next_available_dir_name], capture_output=True)
        # if status.returncode == 1:
        #     lock.release()
        #     raise Exception()
        except FileExistsError as e:
            raise e
        finally:
            lock.release()

        return next_available_dir_name

    '''
    find available temp directory name, all directory in in-progress is incremented numbers
    '''
    def find_available_dir_name(self):
        website_dirs = os.scandir("./websites/in-progress")
        return str(int(max([website_dir.name for website_dir in website_dirs], default=-1, key=int)) + 1)


    # TODO: look into more how notion does downloading, a continous check does not seem like the best option
    def is_download_complete(self, taskIds, wait_time):
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
        for i in range(len(file_streams)):
            file_stream = zipfile.ZipFile(io.BytesIO(file_streams[i]))
            blockId = self.results[i]['request']['blockId']
            file_stream.extractall("websites/in-progress/" + temp_dir_name + "/"  + blockId)

    '''
    read html files and change necessary href tags
    '''
    # every https://www.notion.so starting href should be replaced with a local relative link
    # or an empty link if a local file does not exist
    # replace - with %20?
    def prepare_deployment(self, temp_dir_name):
        self.bring_to_root(temp_dir_name)
        index_original_name = self.rename_index_page(temp_dir_name)


        return None

    def rename_index_page(self, temp_dir_name):
        """ Rename index page to index.html, returns original name

        :returns original_name: original index page's name
        :rtype original_name: str
        """
        for file in os.scandir(join("./websites/in-progress", temp_dir_name)):
            if not file.is_dir():
                id = self.get_page_id(file.name)
                if id == self.index:
                    original_name = file.name
                    os.rename(join("./websites/in-progress", temp_dir_name, file.name), join("./websites/in-progress", temp_dir_name, "index.html"))

                    return original_name

    def get_page_id(self, page_name):
        """ Extract the id portion from the html page file name

        :param page_name: html page file name
        :type page_name: str
        :return: the id portion of the html page file
        :rtype: str
        """

        split_file_name = page_name.split(" ")
        return split_file_name[len(split_file_name) - 1].split(".")[0]

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

    def rename_links(self, temp_dir_name, index_original_name):
        # every https://www.notion.so starting href should be replaced with a local relative link
        # or an empty link if a local file does not exist
        # replace - with %20?
        """ Rename absolute links to relative links in every page using beautiful soup

        :param temp_dir_name: The temp directory's name
        :type temp_dir_name: str
        :param index_original_name: index page's original name
        :type index_original_name: str
        """

        for file in os.scandir(join("websites/in-progress", temp_dir_name)):
            if not file.is_dir():
                with open(file) as fp:
                    soup = BeautifulSoup(fp)
                    print(soup.find_all("a"))

        return None


    '''
    deploy the website in the given folder using surge
    @:param str folder
    @:return void
    '''
    def deploy_website(self, folder):
        return None

def rename_links(temp_dir_name, index_original_name):
    # every https://www.notion.so starting href should be replaced with a local relative link
    # or an empty link if a local file does not exist
    # replace - with %20?
    """ Rename absolute links to relative links in every page using beautiful soup

    :param temp_dir_name: The temp directory's name
    :type temp_dir_name: str
    :param index_original_name: index page's original name
    :type index_original_name: str
    """

    for file in os.scandir(join("websites/in-progress", temp_dir_name)):
        if not file.is_dir():
            with open(file) as fp:
                soup = BeautifulSoup(fp, "html.parser")
                for link in soup.find_all("a"):
                    href = link.get('href')
                    if is_link_notion(href):
                        get_link_id(href)




def is_link_notion(link):
    """ test if the given link starts with https://www.notion.so

    :param link: href of an anchor tag
    :return: if the link is a notion link
    :rtype: bool
    """
    return link.split("/")[2] == "www.notion.so" if len(link.split("/")) > 2 else False

def get_link_id(link):
    """ extract the id portion of a notion link

    :param link: a notion link
    :return: id of the link
    """
    return link.split("/")[-1].split("-")[-1]
rename_links("1", "")