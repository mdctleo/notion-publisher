#!/usr/bin/env bash
cd "frontend"
yarn install
yarn build
sudo scp -r "build/." "/usr/share/nginx/html"