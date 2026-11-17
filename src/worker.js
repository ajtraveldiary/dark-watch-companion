// Dark Watch Companion – Worker
// Serves the static site and a small shared-photo API backed by R2.
//
//   GET    /api/photos          -> { photos: [{ h, v }] }  (h = hashed character id, v = version)
//   GET    /photos/:id          -> the image (public, cached)
//   PUT    /api/photos/:id      -> upload/replace   (owner only: Authorization: Bearer <ADMIN_KEY>)
//   DELETE /api/photos/:id      -> remove           (owner only)
//   GET    /api/owner           -> 204 if the key is right, 401 if not (used by the page to check a key)
//
//   POST   /api/visit           -> count this visitor (once per browser per day) and return the counts
//   GET    /api/visits          -> { total, today }  (cached at the edge for 60 s)
//
// Character ids are listed hashed so the photo list doesn't reveal who appears later in the show.

import { DurableObject } from "cloudflare:workers";

const ID_RE = /^[a-z][a-z0-9_]{1,30}$/;
const MAX_BYTES = 300 * 1024;
const TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

// Security headers for everything the Worker itself returns (the static page gets its own from public/_headers).
const SEC = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
  "x-frame-options": "DENY",
  "content-security-policy": "default-src 'none'; frame-ancestors 'none'; sandbox"
};
const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...SEC, ...extra } });
const err = (status, message) => json({ error: message }, status);

async function sha(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("dark-photo:" + text));
  return [...new Uint8Array(buf)].slice(0, 12).map(b => b.toString(16).padStart(2, "0")).join("");
}

// Compare SHA-256 digests in constant time, so neither the key's content nor its length leaks through timing.
async function sameKey(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || !a || !b) return false;
  const enc = new TextEncoder();
  const [x, y] = await Promise.all([crypto.subtle.digest("SHA-256", enc.encode(a)), crypto.subtle.digest("SHA-256", enc.encode(b))]);
  const u = new Uint8Array(x), v = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < u.length; i++) diff |= u[i] ^ v[i];
  return diff === 0;
}

async function isOwner(request, env) {
  const auth = request.headers.get("authorization") || "";
  const key = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return !!env.ADMIN_KEY && key.length <= 512 && sameKey(key, env.ADMIN_KEY);
}

// Check the file really is the image type it claims to be (magic bytes), not just its content-type header.
function looksLike(type, buf) {
  const b = new Uint8Array(buf.slice(0, 12));
  if (type === "image/jpeg") return b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF;
  if (type === "image/png") return b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47;
  if (type === "image/webp") return b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50;
  return false;
}

// ---------- Visitor counter ----------
// One SQLite-backed Durable Object holds the counts. A visitor is counted at most once per UTC day:
// the Worker sends a salted hash of IP + browser + day (no IP is ever stored), and duplicates are ignored.
// Protection, outermost first:
//   1. The page only calls POST /api/visit once per day per browser.
//   2. Cross-site POSTs are refused before anything else runs.
//   3. Per-IP rate limits (Workers Rate Limiting binding) refuse floods before they reach storage.
//   4. GET /api/visits is cached at the edge for 60 s, so readers rarely reach the object.
//   5. The object itself stops recording new visitors after DAILY_CAP in one day, and keeps
//      per-visitor rows for two days only, so storage writes and size stay bounded no matter what.
const DAILY_CAP = 20000;
const COUNTER_NAME = "global";

export class VisitCounter extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec("CREATE TABLE IF NOT EXISTS seen (day TEXT NOT NULL, h TEXT NOT NULL, PRIMARY KEY (day, h)) WITHOUT ROWID");
    this.sql.exec("CREATE TABLE IF NOT EXISTS totals (k TEXT PRIMARY KEY, n INTEGER NOT NULL)");
    this.prunedFor = "";
  }
  get(k) { const r = this.sql.exec("SELECT n FROM totals WHERE k = ?", k).toArray(); return r.length ? r[0].n : 0; }
  counts(day) { return { total: this.get("all"), today: this.get("day:" + day) }; }
  async stats(day) { return this.counts(day); }
  async visit(day, h) {
    if (this.prunedFor !== day) {                  // once a day: drop per-visitor rows older than yesterday
      const y = new Date(Date.parse(day + "T00:00:00Z") - 86400000).toISOString().slice(0, 10);
      this.sql.exec("DELETE FROM seen WHERE day < ?", y);
      this.sql.exec("DELETE FROM totals WHERE k LIKE 'day:%' AND k < ?", "day:" + y);
      this.prunedFor = day;
    }
    if (this.get("day:" + day) >= DAILY_CAP) return { ...this.counts(day), capped: true };
    const ins = this.sql.exec("INSERT OR IGNORE INTO seen (day, h) VALUES (?, ?)", day, h);
    ins.toArray();                                  // run it, then check whether a new row went in
    if (ins.rowsWritten > 0) {
      this.sql.exec("INSERT INTO totals (k, n) VALUES ('all', 1) ON CONFLICT(k) DO UPDATE SET n = n + 1");
      this.sql.exec("INSERT INTO totals (k, n) VALUES (?, 1) ON CONFLICT(k) DO UPDATE SET n = n + 1", "day:" + day);
    }
    return this.counts(day);
  }
}

const today = () => new Date().toISOString().slice(0, 10);
const clientIp = request => request.headers.get("cf-connecting-ip") || "unknown";
async function limited(binding, key) {
  if (!binding) return false;                       // local dev without the binding: don't block
  try { const { success } = await binding.limit({ key }); return !success; } catch { return false; }
}
function sameSite(request, url) {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return false;
  const origin = request.headers.get("origin");
  return !origin || origin === url.origin;
}
async function visitorHash(request, env, day) {
  const salt = env.ADMIN_KEY || "dark-watch";       // secret salt, so hashes can't be reversed to IPs
  const raw = [salt, clientIp(request), request.headers.get("user-agent") || "", day].join("|");
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return [...new Uint8Array(buf)].slice(0, 12).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function handleVisits(request, env, ctx, url) {
  if (!env.VISITS) return err(503, "Visitor counter isn't set up.");
  const stub = env.VISITS.get(env.VISITS.idFromName(COUNTER_NAME));
  const day = today();

  if (url.pathname === "/api/visit") {
    if (request.method !== "POST") return err(405, "Use POST.");
    if (!sameSite(request, url)) return err(403, "Not allowed.");
    if (await limited(env.VISIT_LIMIT, "v:" + clientIp(request))) return err(429, "Too many requests. Try again in a minute.");
    if (await limited(env.VISIT_GLOBAL, "all")) return json(await stub.stats(day));   // flood: answer, but don't record
    return json(await stub.visit(day, await visitorHash(request, env, day)));
  }

  // GET /api/visits
  if (request.method !== "GET") return err(405, "Use GET.");
  if (await limited(env.READ_LIMIT, "r:" + clientIp(request))) return err(429, "Too many requests. Try again in a minute.");
  const cache = caches.default;
  const key = new Request(url.origin + "/api/visits?d=" + day);
  const hit = await cache.match(key);
  if (hit) return hit;
  const res = new Response(JSON.stringify(await stub.stats(day)), { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=60" } });
  ctx.waitUntil(cache.put(key, res.clone()));
  return res;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === "/api/visit" || pathname === "/api/visits") return handleVisits(request, env, ctx, url);

    if (pathname === "/api/photos" && request.method === "GET") {
      const out = [];
      let cursor;
      do {
        const page = await env.PHOTOS.list({ prefix: "p/", cursor, include: ["customMetadata"] });
        for (const o of page.objects) {
          const id = o.key.slice(2);
          out.push({ h: await sha(id), v: o.etag.slice(0, 10) });
        }
        cursor = page.truncated ? page.cursor : undefined;
      } while (cursor);
      return json({ photos: out });
    }

    if (pathname === "/api/owner") {
      if (!env.ADMIN_KEY) return err(503, "Photo uploads aren't set up yet: the ADMIN_KEY secret is missing.");
      // Brute-force guard: a few key checks per minute per IP, before the key is even looked at.
      if (await limited(env.OWNER_LIMIT, "o:" + clientIp(request))) return err(429, "Too many attempts. Wait a minute and try again.");
      return (await isOwner(request, env)) ? new Response(null, { status: 204, headers: SEC }) : err(401, "That owner key isn't right.");
    }

    const api = pathname.match(/^\/api\/photos\/([^/]+)$/);
    if (api) {
      const id = decodeURIComponent(api[1]);
      if (!ID_RE.test(id)) return err(400, "Unknown character id.");
      if (!env.ADMIN_KEY) return err(503, "Photo uploads aren't set up yet: the ADMIN_KEY secret is missing.");
      if (request.method !== "PUT" && request.method !== "DELETE") return err(405, "Use PUT or DELETE.");
      if (!sameSite(request, url)) return err(403, "Not allowed.");
      if (await limited(env.OWNER_LIMIT, "o:" + clientIp(request))) return err(429, "Too many attempts. Wait a minute and try again.");
      if (!(await isOwner(request, env))) return err(401, "Only the site owner can change photos.");

      if (request.method === "PUT") {
        const type = (request.headers.get("content-type") || "").split(";")[0].trim();
        if (!TYPES.has(type)) return err(415, "Send a JPEG, PNG or WebP image.");
        const body = await request.arrayBuffer();
        if (!body.byteLength) return err(400, "The image is empty.");
        if (body.byteLength > MAX_BYTES) return err(413, "The image is too large (300 KB max).");
        if (!looksLike(type, body)) return err(415, "That file isn't a real " + type.slice(6).toUpperCase() + " image.");
        const obj = await env.PHOTOS.put("p/" + id, body, { httpMetadata: { contentType: type } });
        return json({ id, h: await sha(id), v: obj.etag.slice(0, 10) });
      }
      if (request.method === "DELETE") {
        await env.PHOTOS.delete("p/" + id);
        return json({ id, deleted: true });
      }
      return err(405, "Use PUT or DELETE.");
    }

    const img = pathname.match(/^\/photos\/([^/]+)$/);
    if (img && (request.method === "GET" || request.method === "HEAD")) {
      const id = decodeURIComponent(img[1]);
      if (!ID_RE.test(id)) return new Response("Not found", { status: 404 });
      const obj = await env.PHOTOS.get("p/" + id);
      if (!obj) return new Response("Not found", { status: 404 });
      const headers = new Headers(SEC);
      obj.writeHttpMetadata(headers);
      const ct = headers.get("content-type") || "";
      if (!TYPES.has(ct)) headers.set("content-type", "application/octet-stream");   // never serve anything renderable
      headers.set("etag", obj.httpEtag);
      // The page adds ?v=<version> to the URL, so a cached copy is replaced as soon as the photo changes.
      headers.set("cache-control", url.searchParams.has("v") ? "public, max-age=31536000, immutable" : "public, max-age=60");
      return new Response(request.method === "HEAD" ? null : obj.body, { headers });
    }

    return env.ASSETS.fetch(request);
  }
};
