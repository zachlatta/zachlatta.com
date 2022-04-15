# Obsidian Idea

What if I built an Obsidian plugin that would sync a subset of "public" notes from my Obsidian notebook to pages on my website?

It would also be nice if it could have some sort of accountability mechanism - like a GitHub commit streak that is shown on zachlatta.com.

Components of this:

- Obsidian -> website publishing workflow
- Updating frequency graph

Design goal: fast updates and publishing, no extra "commit" step

## Obsidian -> Website Publishing Workflow

Website would ideally be atomic and reproducible, but I don't want every word of every post committed publicly as I'm writing them. Idea: treat this as part of the DB

### Design

Tag a post as #public

Post is immediately published and live on zachlatta.com

### Engineering

Obsidian is synced using Syncthing, so a git sync step is not needed

Options:

- Have a file watcher running on the notes directory with a backup polling mechanism, as soon as a file changes run a static site generation step that filters posts for `#public`, converts them to HTML pages, and does appropriate templating on non-blog pages
    1. Filter all posts for `#public` from the Obsidian notebook location
    2. Sync all those posts to a folder `/db/posts/` and commit the Markdown files to git history
    3. Run the static site generation step to convert those posts to HTML files which can be served
- Build an Obsidian plugin that user can call "generate site" from, which does all the appropriate stuff

## Updating frequency graph (GitHub streak graph)

### Design

There is a chart of update frequency and current streak on zachlatta.com of public post edits. Potential idea: sub-streaks, like a streak for a specific type of learning - ex. a substreak for posts tagged #cooking for learning about cooking, and it says Zach currently has an X day cooking streak

Under the chart, the 3 most recent updates are highlighted with links to the appropriate files.

If you click one of the squares on the chart, it will show you what changes were made that day with links to those files.

Changes represented in word count. Ex: 384 words added to (linked) Questions from Reading Termination Shock

### Engineering

Filtered posts are commited to a git repo in `/db/` during the publishing workflow.

Build a service that queries that git store to generate an HTML GitHub chart with the above design
