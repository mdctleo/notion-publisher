"""
Adapted from notion-py by @jamalex
"""
import json
import uuid
import requests
from requests import Session, HTTPError
from requests.cookies import cookiejar_from_dict
from urllib.parse import urljoin
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
from collections import deque
import asyncio

from Block import Block
from exceptions import InvalidNotionIdentifier, NotionAPIException

BASE_URL = "https://www.notion.so/"
API_BASE_URL = BASE_URL + "api/v3/"

class NotionClient:

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
            return str(uuid.UUID(url_or_id))
        except ValueError:
            raise InvalidNotionIdentifier(input_value)

    def get_page(self):
        """ Entry point to get a user's directory
        calls notion's loadUserContent endpoint with token_v2 as a cookie
        to get an initial layer of block ids

        :return dummy_root: dummy root of a Block tree
        :rtype dummy_root: Block
        :exception NotionAPIException: raised when notion's API call does not return 200
        """
        url = urljoin(API_BASE_URL, "loadUserContent")
        response = self.session.post(url)

        if response.status_code == 200:
            dummy_root = self.get_directory(response.json())

            return dummy_root
        else:
            raise NotionAPIException("Failed to get initial page data")

    def get_directory(self, response):
        """ Use a BFS approach to get the notion's directory tree

        :param response: json response from initial loadUserContent call
        :type response: dict
        :var queue: A FIFO queue data structure for performing BFS
        :type queue: deque
        :var duplicate: A set to prevent duplicated blocks
        :type duplicate: set
        :return dummy_root: dummy root of a Block tree
        :rtype dummy_root: Block
        """
        dummy_root = Block()
        queue = deque()
        duplicate = set()

        for block_id, block_json in response['recordMap']['block'].items():
            queue.append((block_id, block_json, dummy_root))

        for block_id, block_json in response['recordMap']['collection'].items():
            queue.append((block_id, block_json, dummy_root))

        while len(queue) > 0:
            block_id, block_json, parent = queue.popleft()
            # a block needs to have a value field
            # if it has a type field, the type needs to be a page
            # if it is under collection, it needs a schema
            # otherwise, we return none, since it must be a "base" block and not part of the directory on the nav

            if 'value' not in block_json or block_id in duplicate or (
                    ('type' in block_json['value'] and block_json['value']['type'] != 'page') and 'schema' not in
                    block_json['value']):
                continue

            block = Block()
            if 'schema' in block_json['value']:
                block.set_block_id(block_json['value']['parent_id'])
            else:
                block.set_block_id(block_id)

            duplicate.add(block.get_block_id())

            if 'properties' in block_json['value'] and 'title' in block_json['value']['properties']:
                block.set_title(block_json['value']['properties']['title'][0][0])
            elif 'schema' in block_json['value'] and 'name' in block_json['value']:
                block.set_title(block_json['value']['name'][0][0])

            if 'format' in block_json['value'] and 'page_icon' in block_json['value']['format']:
                block.set_icon(block_json['value']['format']['page_icon'])
            elif 'schema' in block_json['value'] and 'icon' in block_json['value']:
                block.set_icon(block_json['value']['icon'])

            parent.add_child(block)

            if 'content' in block_json['value']:
                for block_id, block_json in self.get_block(block_json['value']['content'])['recordMap'][
                    'block'].items():
                    queue.append((block_id, block_json, block))

        return dummy_root

    def get_block(self, block_ids):
        """ Get a block's sub-block using notion API call syncRecordValues

        :param block_ids: notion block ids
        :type block_ids: list
        :return response: json returned from the api call
        :rtype response: dict
        :exception NotionAPIException raised when notion API call does not return 200
        """
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
            raise NotionAPIException("Failed to get block")


    # TODO: look into using asyncio with flask??
    def enqueue_tasks(self, selection):
        """ Starts downloading tasks for selected pages/blocks by user

        :param selection: notion block ids
        :type selection: list
        :return taskIds: a list of taskIds for the downloads
        :rtype taskIds: list
        """
        taskIds = []
        url = urljoin(API_BASE_URL, "enqueueTask")

        for block in selection:
            data = {"task": {
                "eventName": "exportBlock",
                "request": {
                    "blockId": block,
                    "exportOptions": {
                        "exportType": "html",
                        "locale": "en",
                        "timeZone": "America/Los_Angeles"
                    },
                    "recursive": False
                }

            }}
            response = self.session.post(url, json=data)
            if response.status_code == 200:
                taskIds.append(response.json()['taskId'])
                return taskIds
            else:
                raise NotionAPIException("Failed to enqueTasks")


    def get_tasks(self, taskIds):
        """ Get the actual download links of the given taskIds
        :param taskIds: notion taskIds
        :type taskIds: list
        :return: json returned from getTasks API call
        :rtype: dict
        """
        url = urljoin(API_BASE_URL, "getTasks")
        data = {
            "taskIds": taskIds
        }

        response = self.session.post(url, json=data)
        return response.json()['results']

    # TODO: look into using asyncio with flask
    def download_files(self, result):
        """ Download from exportUrl for each task in result

        :param result: A list of task response object from notion
        :type result: list
        :return: array of binary stream of each downloaded tasks
        :rtype: list
        """
        file_streams = []
        for task in result:
            response = self.session.get(task['status']['exportURL'])
            file_streams.append(response.content)

        return file_streams
