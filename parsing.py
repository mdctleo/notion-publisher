
class Block(object):
    def __init__(self, title: str = "", icon: str = "", block_id: str = ""):
        self.title = title
        self.icon = icon
        self.block_id = block_id
        self.children = []

    def add_child(self, block) -> None:
        self.children.append(block)

    def set_title(self, title: str) -> None:
        self.title = title

    def set_icon(self, icon: str) -> None:
        self.icon = icon

    def set_block_id(self, block_id: str) -> None:
        self.block_id = block_id


    def print_tree(self, node):
        if node is None:
            return

        print(node.title)
        print(node.icon)

        for child in node.children:
            self.print_tree(child)





# class Parser(object):

    # def parse_block(self, block_id):
    #
    #     block =





    # def parse_block(self, response):
    #     # dummy_root = Block("dummy", "dummy", "dummy")
    #     if response is None:
    #         return
    #
    #     for block_id, block_json in response.recordMap.block.items():
    #         block = Block()
    #         block.set_block_id(block_id)
    #
    #         if block_json.properties is not None and block_json.properties.title is not None:
    #             block.set_title(block_json.properties.title[0][0])
    #
    #         if block_json.format is not None and block_json.format.page_icon is not None:
    #             block.set_icon(block_json.format.page_icon)
    #
    #     return None
