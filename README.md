Every application reads a `$BASEDIR` variable that it bases all of its relative links on.

Example (and default) value: `BASEDIR=/zachlatta.com` (there is no trailing slash)

You should not need to set this explicitly, unless you are doing some sort of fancy configuration setup.

---

- [X] Get Docker container running on `slowking`
- [ ] Expose running instance on `slowking` on the public web
- [ ] Get GitHub Actions to build and push Docker image on push.

---

Design goals:

- Feeling of being self-hosted and handmade, like Cliff Stoll's website
- Self-hosted, from my basement, on the NAS
- Can serve as public homepage for myself
- Can upload and serve files of arbitary size and type, not tracked by git (NAS?)
- Dynamic elements on site, with a DB stored locally on the filesystem (Zephyr style)
- Support for a backend in multiple lanaguges (maybe something kind of like CGI scripts?)

Ideas:

public/<files in repo alongside files on NAS>
db/
/<app folders>
ROUTES<mapping and runtimes specified>

---

**Deployment architecture:**

```
public internet -> cloudflare -> relay running tailscale (on vultr) -> slowking
```