from client import NotionClient
import sched, time
import zipfile
import io
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

        self.is_download_complete(taskIds, wait_time)
        file_streams = self.client.download_files(self.results)
        self.save_downloaded_files(file_streams)



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

    def save_downloaded_files(self, file_streams):
        for i in range(len(file_streams)):
            file_stream = zipfile.ZipFile(io.BytesIO(file_streams[i]))
            blockId = self.results[i]['request']['blockId']
            file_stream.extractall("websites/" + blockId)

