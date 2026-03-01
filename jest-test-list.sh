#!/bin/bash
echo "Looking for untested files..."

files=$(find src -name "*.controller.ts" -o -name "*.service.ts")
for file in $files; do
  spec_file="${file%.ts}.spec.ts"
  if [ ! -f "$spec_file" ]; then
    echo "$file needs a test"
  fi
done
