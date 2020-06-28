from client import NotionClient


class WebsiteMaker:
    def __init__(self, token_v2, index, selection):
        self.token_v2 = token_v2
        self.index = index
        self.selection = selection
        self.client = NotionClient(token_v2)

    def make_website(self):
        self.client.enque_tasks(self.selection)