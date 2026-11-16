const fs = require("fs");
const D = require("./src/data.js");
const idx = {}; D.EPISODES.forEach(([c], i) => idx[c] = i);
const E = c => { if (c === undefined) return undefined; if (!(c in idx)) throw new Error("bad ep " + c); return idx[c]; };
const fix = o => { o.ep = E(o.ep); if (o.until !== undefined) o.until = E(o.until); return o; };
const out = {
  EPISODES: D.EPISODES.map(([c, t], i) => { const [s, n] = c.split("."); return {i, code:`S${s}E${n}`, s:+s, n:+n, title:t}; }),
  FAMILIES: D.FAMILIES,
  CHARACTERS: D.CHARACTERS.map(c => ({...fix({...c}), bio:c.bio.map(b => fix({...b})), role:(c.role||[]).map(r => fix({...r})), job:(c.job||[]).map(r => fix({...r})), posFrom:(c.posFrom||[]).map(p => ({ep:E(p.ep), pos:p.pos}))})),
  LINKS: D.LINKS.map(l => fix({...l})),
  EVENTS: D.EVENTS.map(e => fix({...e})),
  JOURNEYS: D.JOURNEYS.map(j => fix({...j})),
  MYSTERIES: D.MYSTERIES.map(m => ({...fix({...m}), a:m.a.map(a => fix({...a}))})),
  GLOSSARY: D.GLOSSARY.map(g => fix({...g})),
  RECAPS: Object.fromEntries(Object.entries(D.RECAPS).map(([k,v]) => { const [s,n]=k.split("."); return [`S${s}E${n}`, v]; })),
  STORY: Object.fromEntries(Object.entries(D.STORY).map(([k,v]) => { const [s,n]=k.split("."); return [`S${s}E${n}`, v]; })),
  NOTES: Object.fromEntries(Object.entries(D.NOTES).map(([k,v]) => { const [s,n]=k.split("."); return [`S${s}E${n}`, v]; }))
};
// integrity checks
const ids = new Set(out.CHARACTERS.map(c => c.id));
const errs = [];
out.LINKS.forEach(l => { [l.a,l.b].forEach(x => { if (!ids.has(x)) errs.push("link id " + x); });
  const ca = out.CHARACTERS.find(c => c.id === l.a), cb = out.CHARACTERS.find(c => c.id === l.b);
  if (ca && cb && (l.ep < ca.ep || l.ep < cb.ep)) errs.push(`link ${l.a}-${l.b} at ${l.ep} before a node appears (${ca.ep},${cb.ep})`); });
out.EVENTS.forEach(e => e.who.forEach(x => { if (!ids.has(x)) errs.push("event id " + x); }));
out.JOURNEYS.forEach(j => { if (!ids.has(j.who)) errs.push("journey id " + j.who); const c = out.CHARACTERS.find(c => c.id === j.who); if (c && j.ep < c.ep) errs.push("journey before char " + j.who); });
out.CHARACTERS.forEach(c => c.bio.forEach(b => { if (b.ep < c.ep) errs.push(`bio before char ${c.id} ${b.ep}<${c.ep}`); }));
out.CHARACTERS.forEach(c => { if (!c.role.length || c.role[0].ep > c.ep) errs.push('role missing at first appearance: ' + c.id); c.role.forEach(r => { if (r.ep < c.ep) errs.push('role before char ' + c.id); }); c.job.forEach(r => { if (r.ep < c.ep) errs.push('job before char ' + c.id); }); });
out.MYSTERIES.forEach(m => m.a.forEach(a => { if (a.ep < m.ep) errs.push("answer before question: " + m.q); }));
if (errs.length) { console.error(errs.join("\n")); process.exit(1); }
const b64 = Buffer.from(JSON.stringify(out), "utf8").toString("base64");
const html = fs.readFileSync("src/template.html", "utf8").replace("__DATA__", b64);
fs.mkdirSync("public", {recursive:true}); fs.writeFileSync("public/index.html", html);
console.log("ok", html.length, "bytes;", out.CHARACTERS.length, "chars,", out.LINKS.length, "links,", out.EVENTS.length, "events");
