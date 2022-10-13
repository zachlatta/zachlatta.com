#!/usr/bin/env bash

# Copy files from MD_SRC to MD_DEST, filtering only for files with KEYWORD in
# them

MD_SRC="${MD_SRC:-$HOME/pokedex-synced/txt/obsidian}"
MD_DEST="${MD_DEST:-$HOME/dev/zachlatta.com/tmp/public-notes}"
NOPUSH="${NOPUSH}" # set this to "yes" if you don't want the script to push
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

# temporarily copy $MD_DEST into a temp folder so we can run git operations on
# it while the new version of the git repo is contructed during the script (used
# for things like getting last file modified time)
gitCopyTmp="$(mktemp --directory --dry-run)"
cp -R "$MD_DEST" "$gitCopyTmp"

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
    relNewFile=$(echo "$file" |
        sed -e 's/\.md$//' \
            -e 's/.*/\L&/g' \
            -e '/[[:punct:]]*/{ s/[^[:alnum:][:space:]\/]//g}' \
            -e 's/ \+/-/g' \
            -e 's/^\///'
    )
    ext=""

    # if it's not a directory, then get the file extension
    if [ ! -d "$file" ]; then
        ext=".${file##*.}"
    fi

    newfile="$tmp/${relNewFile}${ext}"

    # if directory, create directory. if file, copy file
    if [ -d "$file" ]; then
        mkdir -v "$newfile"
    else
        cp -v -- "$file" "$newfile"
    fi

    # get the created date from git. %aI returns the author date in iso8601
    createdDate=$(cd "$gitCopyTmp"; git log --diff-filter=A --follow --format=%aI -1 -- "${relNewFile}${ext}")

    # get the last modified date from file metadata in iso8601
    modifiedDate=$(date -r "$MD_SRC/$file" +"%Y-%m-%dT%H:%M:%S%:z")

    if [ -z "$createdDate" ]; then
        createdDate=$(date +"%Y-%m-%dT%H:%M:%S%:z") # iso8601!
    fi

    # if file doesn't start with ---, then add empty frontmatter!
    if [ ! -d "$newfile" ]; then
        if [[ ! $(sed -n '1{/^---/p};q' "$newfile") ]]; then
            sed -i '1s/^/---\n---\n/' "$newfile"
        fi

        yq --front-matter="process" ".title = \"$title\"" -i "$newfile"
        yq --front-matter="process" ".created = \"$createdDate\"" -i "$newfile"
        yq --front-matter="process" ".modified = \"$modifiedDate\"" -i "$newfile"
    fi
done <<< "$(find . -mindepth 1 -not -path '*/.*')"

# clear old $MD_DEST, copy formatted and renamed files from tmp over, remove tmp
rm -rf *
cp -R $tmp/* .
rm -rf $tmp

popd > /dev/null

# remove copy of git repo used for git operations
rm -rf "$gitCopyTmp"

## commit! ##

pushd "$MD_DEST" > /dev/null
git add .
git commit -m "(automated) update with latest changes"

# if NOPUSH is not set, then push
if [ "$NOPUSH" = "yes" ]; then
    echo "NOPUSH is set, skipping git push"
else
    if [ -f "$GIT_SSH_KEY_PATH" ]; then
        eval "$(ssh-agent -s)"
        ssh-add "$GIT_SSH_KEY_PATH"
    fi

    # push to the current git branch to GIT_REMOTE. we have to disable strict host
    # checking because on a docker image, it won't previously have seen whatever
    # host the GIT_REMOTE is at
    GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no" git push "$GIT_REMOTE" "`git rev-parse --abbrev-ref HEAD`"
fi

popd > /dev/null