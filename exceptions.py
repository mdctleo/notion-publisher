from marshmallow import Schema, fields


class BaseExceptionSchema(Schema):
    msg = fields.Str()

class DeploymentException(Exception):
    def __init__(self, msg):
        super().__init__(msg)
        self.msg = msg


# TODO: hmmm
class InvalidNotionIdentifier(Exception):
    pass

class NotionAPIException(Exception):
    def __init__(self, msg):
        super().__init__(msg)
        self.msg = msg

class DownloadTimeoutException(Exception):
    def __init__(self, msg):
        super().__init__(msg)
        self.msg = msg

class InvalidRequestException(Exception):
    def __init__(self, msg):
        super().__init__(msg)
        self.msg = msg