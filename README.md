How to run:

    $ make run

Then go to localhost:1337

---

Design goals:

- Feeling of being self-hosted and handmade, like Cliff Stoll's website
- Self-hosted, from my basement, on the NAS
- Can serve as public homepage for myself professionally
- Can upload and serve files of arbitary size and type, not tracked by git (NAS?)
- Dynamic elements on site, with a DB stored locally on the filesystem (Zephyr style)
- Support for a backend in multiple lanaguges (maybe something kind of like CGI scripts?)

Ideas:

- [ ] Show location of last visitor on homepage
- [ ] Speed up time-to-shell (current time for `make shell`: 26 seconds)
- [ ] Automatic deployment of new Docker images
- [ ] Figure out good way to manage nginx in background for reverse proxying

## Notes / For Future Reference

The following secrets must be set in the environment for the website to function:

```
IPINFO_TOKEN=<secret for ipinfo.io>
```

---

Every application reads a `$BASEDIR` variable that it bases all of its relative links on.

Example (and default) value: `BASEDIR=/zachlatta.com` (there is no trailing slash)

You should not need to set this explicitly, unless you are doing some sort of fancy configuration setup.

---

**Deployment architecture:**

```
public internet -> cloudflare -> relay running tailscale (on vultr) -> slowking
```
