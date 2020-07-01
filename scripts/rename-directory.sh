#!/usr/bin/env bash

old_dir_name=$1
new_dir_name=$2

# gets absolute path of this script, cd to it, display current working directory
# then store the current working directory in the parent_path variable
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

echo "$parent_path"

cd "$parent_path"
cd "../websites"

if mv "$old_dir_name" "$new_dir_name" ; then
    echo 0
else
    echo 1
fi