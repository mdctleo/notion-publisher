from flask import Flask, render_template, request
import logging
from logging import Formatter, FileHandler
from flask_cors import CORS

from client import NotionClient

app = Flask(__name__)
app.config.from_object('config')
# TODO: remove cors
CORS(app, origins="http://localhost:8080", supports_credentials=True)

@app.route('/')
def hello_world():
    client = NotionClient("f445e3235235fa03a783ead8101612360e05230d561dda4af5c074627731306cfd8fc3c8678d681a37844863535e567fb80a849476367eb7663c9f2c79a4be9bce0c52dd96188498408b757e4d4a")
    client.get_page("https://www.notion.so/VP-Communications-e502b27c0cda4f14b5c1947e84aaa5f2#22440c43c6ac411cb3984afc62428f3f")
    client.get_page("https://www.notion.so/VP-External-77b5daa384cd439e8fa16aab21da516e#7507be624c6e40c0ae6735a3187d93f4")
    client.get_page("https://www.notion.so/0767229c55fc4ccea25e021d5bff5b9e?v=b4d7a24016bf4c05ac75453e16cad8a8")
    return 'Hello, World!'

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
