// Copies the owner's shared photos from the live site into .photos/ so the build can serve them as
// static files (free and unlimited on Cloudflare, no Worker requests, no storage reads per visitor).
//
//   node scripts/fetch-photos.mjs [siteUrl]
//
// Writes .photos/<hash>-<version>.<ext> and .photos/manifest.json ([{h, v, f}]).
import fs from "node:fs";
import crypto from "node:crypto";
import { createRequire } from "node:module";

const SITE = (process.argv[2] || process.env.SITE || "https://dark-watch-companion.workdesk.workers.dev").replace(/\/$/, "");
const require = createRequire(import.meta.url);
const D = require("../src/data.js");
const hash = id => crypto.createHash("sha256").update("dark-photo:" + id).digest().subarray(0, 12).toString("hex");
const byHash = Object.fromEntries(D.CHARACTERS.map(c => [hash(c.id), c.id]));
const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function get(url, tries = 5) {
  for (let i = 0; ; i++) {
    const r = await fetch(url, { headers: { "user-agent": "dark-watch-companion-build" } });
    if (r.status !== 429 || i >= tries) return r;
    await sleep(15000);                     // the site rate-limits photo reads; wait and retry
  }
}

const list = await get(SITE + "/api/photos");
if (!list.ok) { console.error(`Couldn't read the photo list from ${SITE} (HTTP ${list.status}). Stopping so the deploy doesn't drop every photo.`); process.exit(1); }
const photos = (await list.json()).photos.filter(p => byHash[p.h] && /^[0-9a-f]{6,16}$/.test(p.v));

console.log(`${photos.length} shared photo(s) on ${SITE}.`);

fs.rmSync(".photos", { recursive: true, force: true });
fs.mkdirSync(".photos", { recursive: true });
const manifest = [];
for (const p of photos) {
  const r = await get(`${SITE}/photos/${encodeURIComponent(byHash[p.h])}?v=${p.v}`);
  const type = (r.headers.get("content-type") || "").split(";")[0];
  if (!r.ok || !EXT[type]) { console.error(`Skipping one photo (HTTP ${r.status}, ${type || "no type"}).`); continue; }
  const f = `${p.h}-${p.v}.${EXT[type]}`;
  fs.writeFileSync(".photos/" + f, Buffer.from(await r.arrayBuffer()));
  manifest.push({ h: p.h, v: p.v, f });
}
fs.writeFileSync(".photos/manifest.json", JSON.stringify(manifest));
console.log(`Saved ${manifest.length} photo(s) for the static build.`);
