# Dark Watch Companion

A spoiler-safe companion for watching the Netflix series *Dark*. Mark the latest episode you've watched and everything unlocks up to that point, and nothing beyond it:

- **Story** – the plot narrated chapter by chapter, in airing order
- **Timeline** – events by in-world year, across all three worlds
- **Relationship tree** – generations, couples and family lines, plus the time-loop and identity links, with hover help and full screen
- **People, Mysteries, Time travel, Recaps, Glossary**
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
