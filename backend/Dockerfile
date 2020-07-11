# build backend environment
#from waitress import serve
#import app1
#serve(app1.app, host='0.0.0.0', port=8080)
FROM tiangolo/uwsgi-nginx-flask:python:3.8-alpine
WORKDIR /usr/src/notion-publisher
COPY /backend /backend
RUN pip install -r /backend/requirements.txt
RUN yarn global add surge@0.21.3
CMD ["gunicorn", "-b", ":5000", "app.app"]
