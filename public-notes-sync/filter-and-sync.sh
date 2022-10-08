#!/usr/bin/env bash

# Copy files from MD_SRC to MD_DEST, filtering only for files with KEYWORD in
# them

MD_SRC="${MD_SRC:-$HOME/pokedex-synced/txt/obsidian}"
MD_DEST="${MD_DEST:-$HOME/dev/zachlatta.com/tmp/public-notes}"
GIT_REMOTE="${GIT_REMOTE:-git@github.com:zachlatta/public-notes-test}"
GIT_SSH_KEY_PATH="${GIT_SSH_KEY_PATH:-SET ME TO A SSH KEY PATH FOR GIT_REMOTE}"
KEYWORD="#public"

## FIRE UP THE ENGINES ##

echo "##############################"
echo "# WELCOME TO FILTER AND SYNC #"
echo "#                            #"
echo "# the ~premiere~ markdown    #"
echo "# filtering and syncing      #"
echo "# solution                   #"
echo "##############################"
echo
echo "Date: `TZ=America/New_York date`"
echo

## set up folder and git repo in destination if needed ##

if [ ! -d "$MD_DEST" ]; then
    echo "no folder at $MD_DEST - creating one!"
    mkdir -p "$MD_DEST"
fi

if [ ! -d "$MD_DEST/.git" ]; then
    echo "git repo not initialized in $MD_DEST, initializing!"
    pushd "$MD_DEST" > /dev/null
    git init
    popd > /dev/null
fi

## copy all files and folders that match KEYWORD into dest ##

MATCHING_FILES=$(grep "$KEYWORD" "$MD_SRC" --exclude-dir='.*' -lR)

pushd "$MD_DEST" > /dev/null
rm -rf *
rm -rf .obsidian*
popd > /dev/null

if [ ! -z "$MATCHING_FILES" ]
then
    while IFS= read -r FILE
    do
        RELATIVE_PATH=$(realpath --relative-to="$MD_SRC" "$FILE")
        RELATIVE_DIR=$(dirname "$RELATIVE_PATH")

        mkdir -p "$MD_DEST/$RELATIVE_DIR"

        cat "$FILE" |
            sed "s/$KEYWORD//g" \
            > "$MD_DEST/$RELATIVE_PATH"
        
        echo "Copied $RELATIVE_PATH into dest"
    done <<< "$MATCHING_FILES"
else
    echo "No matching files!"
fi

## convert filenames and directories to kebab-case, add titles to frontmatter ##
# modified from https://stackoverflow.com/a/72184470

pushd "$MD_DEST" > /dev/null

tmp="$(mktemp --directory)"

# iterate though all files in $MD_DEST that aren't hidden, and ignore current folder (".")
while IFS= read -r file
do
    title=$(basename "$file" | sed 's/\.md$//')
    newfile=$(echo "$file" |
        sed -e 's/\.md$//' \
            -e 's/.*/\L&/g' \
            -e '/[[:punct:]]*/{ s/[^[:alnum:][:space:]\/]//g}' \
            -e 's/ \+/-/g'
    )
    ext=""

    # if it's not a directory, then get the file extension
    if [ ! -d "$file" ]; then
        ext=".${file##*.}"
    fi

    newfile="$tmp/${newfile}${ext}"

    # if directory, create directory. if file, copy file
    if [ -d "$file" ]; then
        mkdir -v "$newfile"
    else
        cp -v -- "$file" "$newfile"
    fi

    # if file doesn't start with ---, then add empty frontmatter!
    if [ ! -d "$newfile" ]; then
        if [[ ! $(sed -n '1{/^---/p};q' "$newfile") ]]; then
            sed -i '1s/^/---\n---\n/' "$newfile"
        fi

        yq --front-matter="process" ".title = \"$title\"" -i "$newfile"
    fi
done <<< "$(find . -mindepth 1 -not -path '*/.*')"

# clear old $MD_DEST, copy formatted and renamed files from tmp over, remove tmp
rm -rf *
cp -R $tmp/* .
rm -rf $tmp

popd > /dev/null

## commit! ##

pushd "$MD_DEST" > /dev/null
git add .
git commit -m "(automated) update with latest changes"

if [ -f "$GIT_SSH_KEY_PATH" ]; then
    eval "$(ssh-agent -s)"
    ssh-add "$GIT_SSH_KEY_PATH"
fi

# push to the current git branch to GIT_REMOTE. we have to disable strict host
# checking because on a docker image, it won't previously have seen whatever
# host the GIT_REMOTE is at
GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no" git push "$GIT_REMOTE" "`git rev-parse --abbrev-ref HEAD`"

popd > /dev/null