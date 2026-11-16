// Dark Watch Companion – Worker
// Serves the static site and a small shared-photo API backed by R2.
//
//   GET    /api/photos          -> { photos: [{ h, v }] }  (h = hashed character id, v = version)
//   GET    /photos/:id          -> the image (public, cached)
//   PUT    /api/photos/:id      -> upload/replace   (owner only: Authorization: Bearer <ADMIN_KEY>)
//   DELETE /api/photos/:id      -> remove           (owner only)
//   GET    /api/owner           -> 204 if the key is right, 401 if not (used by the page to check a key)
//
// Character ids are listed hashed so the photo list doesn't reveal who appears later in the show.

const ID_RE = /^[a-z][a-z0-9_]{1,30}$/;
const MAX_BYTES = 300 * 1024;
const TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra } });
const err = (status, message) => json({ error: message }, status);

async function sha(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("dark-photo:" + text));
  return [...new Uint8Array(buf)].slice(0, 12).map(b => b.toString(16).padStart(2, "0")).join("");
}

function sameKey(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function isOwner(request, env) {
  const auth = request.headers.get("authorization") || "";
  const key = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return !!env.ADMIN_KEY && sameKey(key, env.ADMIN_KEY);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

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
      return isOwner(request, env) ? new Response(null, { status: 204 }) : err(401, "That owner key isn't right.");
    }

    const api = pathname.match(/^\/api\/photos\/([^/]+)$/);
    if (api) {
      const id = decodeURIComponent(api[1]);
      if (!ID_RE.test(id)) return err(400, "Unknown character id.");
      if (!env.ADMIN_KEY) return err(503, "Photo uploads aren't set up yet: the ADMIN_KEY secret is missing.");
      if (!isOwner(request, env)) return err(401, "Only the site owner can change photos.");

      if (request.method === "PUT") {
        const type = (request.headers.get("content-type") || "").split(";")[0].trim();
        if (!TYPES.has(type)) return err(415, "Send a JPEG, PNG or WebP image.");
        const body = await request.arrayBuffer();
        if (!body.byteLength) return err(400, "The image is empty.");
        if (body.byteLength > MAX_BYTES) return err(413, "The image is too large (300 KB max).");
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
      const headers = new Headers();
      obj.writeHttpMetadata(headers);
      headers.set("etag", obj.httpEtag);
      // The page adds ?v=<version> to the URL, so a cached copy is replaced as soon as the photo changes.
      headers.set("cache-control", url.searchParams.has("v") ? "public, max-age=31536000, immutable" : "public, max-age=60");
      return new Response(request.method === "HEAD" ? null : obj.body, { headers });
    }

    return env.ASSETS.fetch(request);
  }
};
