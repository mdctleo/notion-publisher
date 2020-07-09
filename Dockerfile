# build environment
FROM node:12.2.0-alpine as react-build
WORKDIR ./frontend
COPY . .
RUN yarn install
RUN yarn build

# server environment
FROM nginx:1.16.0-alpine
COPY nginx.conf /etc/nginx/conf.d/configfile.template
ENV PORT 3000
ENV HOST 0.0.0.0
RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"
COPY --from=react-build /frontend/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]