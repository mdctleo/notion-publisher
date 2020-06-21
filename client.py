"""
Adapted from notion-py by @jamalex
"""

import uuid
import requests
from requests import Session, HTTPError
from requests.cookies import cookiejar_from_dict
from urllib.parse import urljoin
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

from block import Block

BASE_URL = "https://www.notion.so/"
API_BASE_URL = BASE_URL + "api/v3/"

def create_session():
    """
    retry on 502
    """
    session = Session()
    retry = Retry(
        status=5,
        backoff_factor=0.3,
        status_forcelist=(502,),
        # CAUTION: adding 'POST' to this list which is not technically idempotent
        method_whitelist=("POST", "HEAD", "TRACE", "GET", "PUT", "OPTIONS", "DELETE"),
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    return session


# TODO: hmmm
class InvalidNotionIdentifier(Exception):
    pass


class NotionClient:
    """
    This is the entry point to using the API. Create an instance of this class, passing it the value of the
    "token_v2" cookie from a logged-in browser session on Notion.so. Most of the methods on here are primarily
    for internal use -- the main one you'll likely want to use is `get_block`.
    """

    def __init__(self, token_v2):
        # self.session = create_session()
        # self.session.cookies = cookiejar_from_dict({"token_v2": token_v2})
        self.token_v2 = token_v2
        self.session = self.create_session()

    def create_session(self):
        """
        retry on 502
        """
        session = Session()
        retry = Retry(
            status=5,
            backoff_factor=0.3,
            status_forcelist=(502,),
            # CAUTION: adding 'POST' to this list which is not technically idempotent
            method_whitelist=("POST", "HEAD", "TRACE", "GET", "PUT", "OPTIONS", "DELETE"),
        )
        adapter = HTTPAdapter(max_retries=retry)
        session.mount("https://", adapter)
        session.cookies = cookiejar_from_dict({"token_v2": self.token_v2})
        return session


    def get_token(self):
        return self.token_v2

    def extract_id(self, url_or_id):
        """
        Extract the block/page ID from a Notion.so URL -- if it's a bare page URL, it will be the
        ID of the page. If there's a hash with a block ID in it (from clicking "Copy Link") on a
        block in a page), it will instead be the ID of that block. If it's already in ID format,
        it will be passed right through.
        """
        input_value = url_or_id
        if url_or_id.startswith(BASE_URL):
            url_or_id = (
                url_or_id
                .split("#")[0]
                .split("/")[-1]
                .split("-")[-1]
            )
        try:
            # return url_or_id
            return str(uuid.UUID(url_or_id))
        except ValueError:
            raise InvalidNotionIdentifier(input_value)

    def get_page(self, url):
        test = self.extract_id(url)
        data = {
            "pageId": test,
            "limit": 100000,
            "cursor": {"stack": []},
            "chunkNumber": 0,
            "verticalColumns": False,
        }
        url = urljoin(API_BASE_URL, "loadUserContent")
        response = self.session.post(url, json=data)

        if response.status_code == 200:
            dummy_root = self.get_directory(response.json())
            # dummy_root.print_tree(dummy_root)
            # dummy_root.print_tree(dummy_root, "")

            return dummy_root
        else:
            response.raise_for_status()
            raise BaseException("Failed to get initial page data")

    def get_directory(self, response):
        dummy_root = Block("dummy", "dummy", "dummy")

        for block_id, block_json in response['recordMap']['block'].items():
            block = self.get_sub_directory(block_id, block_json)
            if block is not None:
                dummy_root.add_child(block)

        return dummy_root

    def get_sub_directory(self, block_id, block_json):
        if block_json['value']['type'] != 'page':
            return None

        parentBlock = Block()
        parentBlock.set_block_id(block_id)

        if 'properties' in block_json['value'] and 'title' in block_json['value']['properties']:
            parentBlock.set_title(block_json['value']['properties']['title'][0][0])

        if 'format' in block_json['value'] and 'page_icon' in block_json['value']['format']:
            parentBlock.set_icon(block_json['value']['format']['page_icon'])

        if 'content' in block_json['value']:
            for block_id, block_json in self.get_block(block_json['value']['content'])['recordMap']['block'].items():
                childBlock = self.get_sub_directory(block_id, block_json)
                if childBlock is not None:
                    parentBlock.add_child(childBlock)

        return parentBlock

    def get_block(self, block_ids):
        block_ids_formatted = {}
        for block_id in block_ids:
            block_ids_formatted[block_id] = block_ids_formatted.get(block_id, -1)

        data = {
            "recordVersionMap": {
                "block": block_ids_formatted
            }
        }

        url = urljoin(API_BASE_URL, "syncRecordValues")
        response = self.session.post(url, json=data)

        if response.status_code == 200:
            return response.json()
        else:
            response.raise_for_status()
            raise BaseException("Failed to get block")


