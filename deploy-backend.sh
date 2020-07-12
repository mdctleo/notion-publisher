#!/usr/bin/env bash
echo "End previous Flask server process..."
if pm2 kill ; then
   echo "Previous Flask server process terminated successfully!"
else
   echo "Failed to terminate previous Flask server process"
   exit 1
fi

mkdir "/home/ec2-user/notion-publisher/backend/src/websites"
mkdir "/home/ec2-user/notion-publisher/backend/src/websites/in-progress"
mkdir "/home/ec2-user/notion-publisher/backend/src/websites/done"
chmod ugo+rwx "/home/ec2-user/notion-publisher/backend/src/websites"
chmod ugo+rwx "/home/ec2-user/notion-publisher/backend/src/websites/in-progress"
chmod ugo+rwx "/home/ec2-user/notion-publisher/backend/src/websites/done"

echo "Starting Flask sever..."
cd "/home/ec2-user/notion-publisher/backend/src"
if  pm2 start "gunicorn -b 127.0.0.1:5000 app:app" ; then
    echo "Starting Flask server success!"
else
    echo "Failed to start Flask server"
    exit 1
fi

