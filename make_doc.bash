#!/bin/bash

set -euo pipefail
shopt -s globstar

cd "$(dirname "$0")"

rst2html=$(
    which rst2html 2> /dev/null ||
    which rst2html.py 2> /dev/null)

if [[ -z $rst2html ]]; then
    echo 'You must have the command rst2html'
    exit 1
fi

function generate_toc() {
    local current_file=$1
    local relative_path=$2
    printf "<h1>"
    generate_toc_entry "$current_file" "$relative_path" "doc/index.rst" "00 sans-sel"
    printf "</h1>"
    printf "<nav class='toc'>"
    generate_toc_rec doc "${@}"
    printf "</nav>"
}

function generate_toc_rec() {
    local root=$1
    local current_file=$2
    local relative_path=$3

    printf "<ul>"
    for file in "$root"/*; do
        local name=${file##*/}
        local name=${name%.*}

        if [[ -d "$file" ]]; then
            if [[ -e "$file/index.rst" ]]; then
                printf "<li>"
                generate_toc_entry "$current_file" "$relative_path" "$file/index.rst" "$name"
            else
                printf "<li>${name:3}"
            fi
            generate_toc_rec "$file" "$current_file" "$relative_path"
            printf "</li>"
        elif [[ $file =~ .*\.rst ]] && ! [[ $file =~ .*/index.rst ]]; then
            printf "<li>"
            generate_toc_entry "$current_file" "$relative_path" "$file" "$name"
            printf "</li>"
        fi
    done
    printf "</ul>"
}

function generate_toc_entry() {
    local current_file=$1
    local file=$3
    local url=$relative_path/${file#*/}
    local url=${url%.*}.html
    local name=$4

    local current=$([[ $file == $current_file ]] && echo ' class="current"')

    printf "<a $current href='$url'>${name:3}</a>"
}

generate_file() {
    local file="$1"
    local directory="$(dirname "$file")"
    local relative_path=$(dirname "$directory" | sed 's~[^/.][^/]*~..~g')
    local stylesheet=$relative_path/style.css

    echo "$file"

    mkdir -p "dist/$directory"

    $rst2html \
        --stylesheet="$stylesheet" \
        --link-stylesheet \
        --syntax-highlight=short \
        --template="doc/template.html" \
        --initial-header-level=2 \
        --smart-quotes=yes \
        --no-section-subtitles \
        --tab-width=4 \
        "$file" \
    | sed "/#TOC#/ c\\$(generate_toc "$file" "$relative_path")" \
    > "dist/${file%.rst}.html"
}

if [[ $# -gt 0 ]]; then
    generate_file "$1"
else
    mkdir -p dist/doc
    cp doc/style.css dist/doc/style.css
    pygmentize -S friendly -f html -a .code >> dist/doc/style.css

    find doc -iname '*.rst' -print0 | xargs -0 -n1 -P10 bash $0
fi
