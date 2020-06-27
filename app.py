from flask import Flask, render_template, request
import logging
from logging import Formatter, FileHandler
from flask_cors import CORS

from client import NotionClient
from block import BlockSchema

app = Flask(__name__)
app.config.from_object('config')
# TODO: remove cors
CORS(app, origins="http://localhost:3000", supports_credentials=True)

@app.route('/')
def hello_world():
    client = NotionClient("f445e3235235fa03a783ead8101612360e05230d561dda4af5c074627731306cfd8fc3c8678d681a37844863535e567fb80a849476367eb7663c9f2c79a4be9bce0c52dd96188498408b757e4d4a")
    client.get_page("https://www.notion.so/VP-Communications-e502b27c0cda4f14b5c1947e84aaa5f2")
    # https://www.notion.so/VP-Communications-e502b27c0cda4f14b5c1947e84aaa5f2#2ea60a28f0494607a6a1cc66450abc0f
    return 'Hello, World!'

@app.route('/getDirectory', methods=['POST'])
def get_directory():
    if request.method == 'POST':
        token_V2 = request.get_json()['token_V2']
        # workspace = request.get_json()['workspace']

        client = NotionClient(token_V2)
        directory = client.get_page()
        blockSchema = BlockSchema()
        result = blockSchema.dump(directory)
        return result

@app.route('/makeWebsite', methods=['POST'])
def make_website():
    if request.method == 'POST':
        print(request.get_json())
        index = request.get_json()['index']
        selection = request.get_json()['selection']

        print(index)
        print(selection)



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
