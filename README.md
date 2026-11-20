# Dark Watch Companion

A spoiler-safe companion for watching the Netflix series *Dark*. Mark the latest episode you've watched and everything unlocks up to that point, and nothing beyond it:

- **Story** – the plot narrated chapter by chapter, in airing order
- **Timeline** – events by in-world year, across all three worlds
- **Relationship tree** – generations, couples and family lines, plus the time-loop and identity links, with hover help and full screen
- **People, Mysteries, Time travel, Glossary**
- A replay slider to see the story as it stood after any earlier episode

Misdirections are shown the way the show presents them until the episode that overturns them. Viewing progress is stored in each visitor's browser.

## Shared photos

On the Cloudflare site, character photos the site owner adds are stored in an R2 bucket (`dark-watch-photos`) and shown to every visitor. Only someone with the owner key can add, replace or remove them: open the **People** tab → **Owner sign-in**, enter the key, then use **Add photo for everyone** in a character's file or **Import photos for everyone…** to upload a folder at once (files are matched by name, e.g. `C01_jonas-kahnwald.webp` or `jonas.jpg`). Visitors can still add their own photos, which stay in their browser only.

The photo list the site serves is keyed by hashed character ids, and a photo is only requested once that character is unlocked, so the photos don't spoil who appears later.

Built from episode synopses on the Dark Wiki, observations from r/DarK, and the episode-by-episode family tree in Netflix's official guide (facts only, no copied text or images).

## Project layout

| Path | What it is |
| --- | --- |
| `src/data.js` | All story data. Every item has an `ep` (the episode that unlocks it) and optional `until` / `later` for misdirections. |
| `src/template.html` | The page: markup, styles and script. |
| `build.js` | Checks the data and writes `public/index.html` (data is encoded so a glance at the page source doesn't spoil anything). |
| `public/` | The static site that Cloudflare serves. |
| `src/worker.js` | The Worker: serves the site and the shared-photo API (`/api/photos`, `/photos/:id`) backed by R2. |
| `wrangler.jsonc` | Cloudflare Workers config: static assets, the R2 bucket binding. |

## Run locally

```sh
npm install
echo 'ADMIN_KEY="pick-a-local-key"' > .dev.vars   # optional: lets you test owner uploads locally
npm run dev        # builds, then serves at http://localhost:8787 (with a local R2 simulator)
```

## Deploy

Manually:

```sh
npx wrangler login
npm run deploy
```

Automatically on every push to `main`: add two repository secrets under **Settings → Secrets and variables → Actions**:

- `CLOUDFLARE_API_TOKEN` – a token with the *Edit Cloudflare Workers* permission
- `CLOUDFLARE_ACCOUNT_ID` – your Cloudflare account ID
- `PHOTO_ADMIN_KEY` – optional; a long random owner key for uploading shared photos. The workflow sets it on the Worker as the `ADMIN_KEY` secret.

Until both secrets exist, the workflow builds the site and skips the deploy step.

## Editing the story

Change `src/data.js`, run `npm run build`, and commit. Keep the spoiler rule: an item's `ep` must be the first episode that shows it, and if in doubt, unlock it later.

## Visitor counter

The footer shows total visitors and today's visitors. Counts live in one SQLite-backed Durable Object
(`VisitCounter`), so there's no separate database to create. Each browser is counted once per UTC day,
using a salted hash of IP + browser + day (no IP addresses are stored). Floods are stopped before they reach
storage: cross-site requests are refused, per-IP rate limits apply to both endpoints, the read endpoint is
cached at the edge for 60 seconds, and the counter stops recording after 20,000 visitors in a day.

## Security

- **Page**: strict Content-Security-Policy (only the page's own script, identified by its hash, can run;
  no external scripts, no framing), plus `nosniff`, `no-referrer` and `X-Frame-Options: DENY`.
  `build.js` writes these to `public/_headers` on every build.
- **Owner key**: compared in constant time; key checks and photo changes are rate-limited per IP
  (60 a minute) and must come from the site itself. Use a long random key (20+ characters).
- **Uploads**: owner only, JPEG/PNG/WebP up to 300 KB, and the file's bytes must match its type.
  Photos are served with `nosniff` and a sandboxing CSP.
- **Storage**: the R2 bucket and the visitor-counter Durable Object have no public access; the only way in
  is through the Worker's endpoints above.

## Search engines and AI assistants

`build.js` also writes `robots.txt` (all crawlers welcome, AI crawlers named explicitly; `/api/` excluded),
`sitemap.xml`, `llms.txt` (a plain summary for AI assistants), a real `404.html`, and the IndexNow key file.
The page has a description, canonical URL, Open Graph/Twitter preview (`static/og-image.png`), JSON-LD
(WebSite, and WebApplication about the TV series).
Each deploy pings IndexNow so Bing and other engines re-crawl quickly.
