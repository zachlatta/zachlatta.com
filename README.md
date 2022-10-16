# Personal Website

This is the codebase for https://zachlatta.com. If you check the branches, you can see checkpoints of previous versions of the site (TODO: add the 8/21 version).

The content for this site is pulled from [`zachlatta/public-notes`](https://github.com/zachlatta/public-notes) using the script in [`public-notes-sync/`](public-notes-sync/).

---

Design goals:

- Feeling of being handmade, like Cliff Stoll's website
- Can serve as public homepage for myself professionally
- Easily publish notes w/ accountability system (Scrapbook / GitHub streak style)

To do:

- [ ] Image support in notes
- [ ] Tree view of files
- [ ] Actually start using the site and see how it feels!

- [x] Sort list of posts by edit time
- [x] Show publish time of post
- [x] Show most recent edit time of post
- [x] Make sure it works for posts in subfolders, and sub-sub(and sub-sub-sub...) folders

## Caching

Note: You need to delete `tmp/notes.json` to clear the cache. It will only fetch the notes DB once in many cases.
