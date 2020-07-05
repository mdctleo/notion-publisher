#!/usr/bin/env bash

dir_name=$1

# gets absolute path of this script, cd to it, display current working directory
# then store the current working directory in the parent_path variable
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

cd "$parent_path"
cd "../websites/in-progress"
if mkdir "$dir_name" ; then
    exit 0
else
    exit 1
fi