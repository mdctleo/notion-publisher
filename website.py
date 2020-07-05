from client import NotionClient
import sched, time
import zipfile
import io
import threading
import subprocess
import os

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

    '''
    acquire lock, make a folder with a temp unique name by executing a bash script, release lock
    @:return str folder_name
    '''
    def make_website_folder(self):
        lock.acquire()
        next_available_dir_name = self.find_available_dir_name()
        status = subprocess.run(["./scripts/make-directory.sh", next_available_dir_name], capture_output=True)
        if status.returncode == 1:
            lock.release()
            raise Exception()
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

    def save_downloaded_files(self, file_streams, temp_dir_name):
        for i in range(len(file_streams)):
            file_stream = zipfile.ZipFile(io.BytesIO(file_streams[i]))
            blockId = self.results[i]['request']['blockId']
            file_stream.extractall("websites/in-progress/" + temp_dir_name + "/"  + blockId)

    '''
    read html files and change necessary href tags
    '''
    def prepare_deployment(self):
        return None


    '''
    deploy the website in the given folder using surge
    @:param str folder
    @:return void
    '''
    def deploy_website(self, folder):
        return None

