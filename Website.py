from marshmallow import Schema, fields

class WebsiteSchema(Schema):
    url = fields.String()

class Website():
    def __init__(self, url):
        self.url = url

