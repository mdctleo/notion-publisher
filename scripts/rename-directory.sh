#!/usr/bin/env bash

old_dir_name=$1
new_dir_name=$2

# gets absolute path of this script, cd to it, display current working directory
# then store the current working directory in the parent_path variable
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

echo "$parent_path"

cd "$parent_path"
cd "../websites"

if mv "in-progress/$old_dir_name" "done/$new_dir_name" ; then
    exit 0
else
    exit 1
fi