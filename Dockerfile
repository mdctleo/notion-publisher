# build backend environment
#from waitress import serve
#import app1
#serve(app1.app, host='0.0.0.0', port=8080)
FROM tiangolo/uwsgi-nginx-flask:python:3.8-alpine
WORKDIR /usr/src/notion-publisher
COPY /backend /backend
RUN pip install -r /backend/requirements.txt
RUN yarn global add surge@0.21.3
RUN pip install waitress
CMD ["waitress-serve", "--host==0.0.0.0", "--port=5000", "app.app"]

# build frontend environment
FROM node:12.2.0-alpine
WORKDIR /usr/src/notion-publisher
COPY /frontend /frontend
RUN yarn install
RUN yarn build

# nginx environment
FROM nginx:1.16.0-alpine
COPY nginx/nginx.conf /etc/nginx/conf.d/configfile.template
ENV PORT 80
ENV HOST 0.0.0.0
RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"
COPY --from=react-build /frontend/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]