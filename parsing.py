
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


    def print_tree(self, node, indent):
        if node is None:
            return

        print(indent + node.title)
        print(indent + node.icon)

        for child in node.children:
            self.print_tree(child, indent + "   ")