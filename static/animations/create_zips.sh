#!/bin/bash

# Loop through each item in the current directory
for dir in */
do
    # Remove the trailing slash to get the directory name
    dir=${dir%/}

    # Create a zip file for each directory
    zip -r "${dir}_webp.zip" "$dir"
done
