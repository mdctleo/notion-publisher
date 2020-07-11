# build frontend environment
FROM node:12.2.0-alpine
WORKDIR /usr/src/notion-publisher
COPY . /frontend
RUN yarn install
RUN yarn build