MD_SRC=$HOME/pokedex-synced/txt/obsidian
MD_DEST=$HOME/dev/zachlatta.com/markdown-idea/dest
KEYWORD="#public"

if [ ! -d "$MD_DEST/.git" ]; then
    echo "git repo not initialized in $MD_DEST, initializing!"
    pushd "$MD_DEST" > /dev/null
    git init
    popd > /dev/null
fi

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
    done <<< "$MATCHING_FILES"
else
    echo "No matching files!"
fi

pushd "$MD_DEST" > /dev/null
git add .
git commit -m "update with latest changes"
popd > /dev/null