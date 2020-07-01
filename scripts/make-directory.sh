#!/usr/bin/env bash

dir_name=$1

# gets absolute path of this script, cd to it, display current working directory
# then store the current working directory in the parent_path variable
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

cd "$parent_path"
cd "../websites"
if mkdir "$dir_name" ; then
    echo 0
else
    echo 1
fi