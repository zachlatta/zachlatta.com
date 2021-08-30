Design goals:

- Feeling of being self-hosted and handmade, like Cliff Stoll's website
- Self-hosted, from my basement, on the NAS
- Can serve as public homepage for myself professionally
- Can upload and serve files of arbitary size and type, not tracked by git (NAS?)
- Dynamic elements on site, with a DB stored locally on the filesystem (Zephyr style)
- Support for a backend in multiple lanaguges (maybe something kind of like CGI scripts?)

Ideas:

```
public/<files in repo alongside files on NAS>
db/
/<app folders>
ROUTES<mapping and runtimes specified>
```

To-dos:

- [X] Get Docker container running on `slowking`
- [X] Expose running instance on `slowking` on the public web
- [X] Get `public` app to fallback to files in `db/public/`
- [X] Get GitHub Actions to build and push Docker image on push.
- [X] Build dynamic page counter service
- [ ] Show location of last visitor on homepage

Build a blog:

_Idea: Use Tailscale for authentication, instead of a user account. Network-level authentication._

Improve development experience:

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
