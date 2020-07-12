#!/usr/bin/env bash

echo "Starting front end deployment process..."
if cd "frontend" ; then
    echo "Front end folder found"
else
    echo "Failed to fine front end folder"
    exit 1
fi
echo "Installing dependencies...."
if yarn install ; then
    echo "Install success!"
else
    echo "Failed to install dependencies with yarn"
    exit 1
fi
echo "Building production front end files..."
if yarn build ; then
    echo "Production front end built!"
else
    echo "Failed to build front end production files"
    exit 1
fi

echo "Serving files to nginx..."
if sudo scp -r "build/." "/usr/share/nginx/html" ; then
    echo "Serving files to nginx success!"
else
    echo "Failed to serve files to nginx"
    exit 1
fi

echo "Cleaning up..."
if cd "/home/ec2-user/notion-publisher" && rm -rf "frontend" ; then
        echo "clean up success!"
else
    echo "Failed to clean up"
    exit 1
fi

echo "Front end deployed!"