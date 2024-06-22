#!/bin/bash

# Root directory containing PNG files and subdirectories
ROOT_DIR=$(pwd)

# Find all PNG files in the directory and subdirectories
find "$ROOT_DIR" -type f -name "*.png" | while read file; do
  # Define the output file name (change extension to .webp)
  output="${file%.png}.webp"

  # Convert the file to WebP format using cwebp
  cwebp -q 80 "$file" -o "$output"

  rm $file

  echo "Converted $file to $output"
done

echo "Conversion completed."
