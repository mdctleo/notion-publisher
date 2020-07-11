from flask import Flask, request, session
import logging
from logging import Formatter, FileHandler
from flask_cors import CORS

from Client import NotionClient
from Block import BlockSchema
from Website import WebsiteSchema
from exceptions import DeploymentException, NotionAPIException, DownloadTimeoutException, BaseExceptionSchema, \
    InvalidRequestException
from WebsiteMaker import WebsiteMaker

app = Flask(__name__)
app.config.from_object('config')
# redis_client = redis.Redis(host='localhost')
# TODO: remove cors
CORS(app, origins="http://localhost:3000", supports_credentials=True)

@app.route('/getDirectory', methods=['POST'])
def get_directory():
    """ Gets requesting party's directory structure on notion and store token_v2 as a cookie
    honestly I should change the way this is done hmmm instead of cookie

    :param token_v2: requesting party's notion token
    :type token_v2: str

    :return: A json representation of a Block object tree
    :rtype: Block
    """
    if request.method == 'POST':
        try:
            token_V2 = request.get_json()['token_V2']

            client = NotionClient(token_V2)
            session['token_v2'] = token_V2

            directory = client.get_page()
            blockSchema = BlockSchema()

            result = blockSchema.dump(directory)
            return result
        except NotionAPIException as e:
            return BaseExceptionSchema().dump(e), 500
        except DownloadTimeoutException as e:
            return BaseExceptionSchema().dump(e), 500


@app.route('/makeWebsite', methods=['POST'])
def make_website():
    """ Makes website based on selected pages and index page

    :param index: selected index page block id with - delimiter
    :type index: str
    :param selection: selected pages' block ids with - delimiter
    :type selection: list
    :param token_v2: requesting party's notion token
    :type token_v2: str

    :return: A json representation of Website object
    :rtype: Website
    """
    if request.method == 'POST':
        try:
            index = request.get_json()['index']
            selection = request.get_json()['selection']
            if index is None or len(index) == 0:
                return BaseExceptionSchema().dump(InvalidRequestException('Missing Index')), 400

            if selection is None or len(selection) == 0:
                return BaseExceptionSchema().dump(InvalidRequestException('Missing Selection')), 400

            # TODO: maybe use redis to persist the client???
            website_maker = WebsiteMaker(session['token_v2'], index, selection)
            website_schema = WebsiteSchema()
            return website_schema.dump(website_maker.make_website())
        except DeploymentException as e:
            return BaseExceptionSchema().dump(e), 500




if not app.debug:
    file_handler = FileHandler('error.log')
    file_handler.setFormatter(
        Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]')
    )
    app.logger.setLevel(logging.INFO)
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.info('errors')

# ----------------------------------------------------------------------------#
# Launch.
# ----------------------------------------------------------------------------#

# Default port:
if __name__ == '__main__':
    app.run()

# Or specify port manually:
'''
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
'''
