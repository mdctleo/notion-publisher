from flask import Flask, render_template, request
import logging
from logging import Formatter, FileHandler
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object('config')
# TODO: remove cors
CORS(app, origins="http://localhost:8080", supports_credentials=True)

@app.route('/')
def hello_world():
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
