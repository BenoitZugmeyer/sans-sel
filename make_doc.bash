#!/bin/bash

set -euo pipefail

ROOT=$(cd "$(dirname "$0")"; pwd)

function relative_path () {
    local file=$1
    local dest=$2

    echo $file $dest
}

mkdir -p "$ROOT/doc"
cp "$ROOT/doc/style.css" "$ROOT/dist/doc/style.css"
pygmentize -S friendly -f html -a .code >> "$ROOT/dist/doc/style.css"

while IFS= read -r -d $'\0' file; do
    echo "$file"
    mkdir -p "dist/doc/$(dirname "$file")"
    stylesheet=$(dirname "$file" | sed 's/[^\/.][^\/]*/../g')/style.css
    #echo $(relative_path $file doc/foo.css)
    rst2html \
        --stylesheet="$stylesheet" \
        --link-stylesheet \
        --syntax-highlight=short \
        "doc/$file" > "dist/doc/${file%.rst}.html"
done < <(find ./doc -name '*.rst' -printf '%P\0')
