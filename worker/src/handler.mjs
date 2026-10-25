// POST /lesson: the hosted copy of the MCP server's gate. Never trusts the client:
// per-connection burst limit -> size cap -> JSON -> install id shape -> validateLesson() (same rules as lib/)
// -> per-install daily cap -> D1. Stores no IP and no timestamp (date only). The only headers read are
// Content-Length and CF-Connecting-IP, the latter hashed into a rate-limit key and never stored.
import { validateLesson } from "./lib/lesson.mjs";

export const MAX_BODY = 2048; // bytes
export const MAX_PER_DAY = 20;
const INSTALL_RE = /^[0-9a-f]{16}$/; // server/index.mjs makes 8 random bytes as hex

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

/** Same parsing as loadBlocklist() in lib/safety.mjs, but from text instead of files. */
export function parseTerms(...texts) {
  const terms = [];
  for (const t of texts) for (const line of (t ?? "").split("\n")) {
    const s = line.trim();
    if (s && !s.startsWith("#")) terms.push(s.toLowerCase());
  }
  return terms;
}

/** Reads at most `max` bytes; returns null if the body is bigger (without reading the rest). */
async function readCapped(request, max) {
  const declared = Number(request.headers.get("content-length"));
  if (declared > max) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  const buf = new Uint8Array(size);
  let o = 0;
  for (const c of chunks) { buf.set(c, o); o += c.byteLength; }
  return new TextDecoder().decode(buf);
}

async function connectionKey(request) {
  const addr = request.headers.get("cf-connecting-ip") ?? "";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`rbrain-rl:${addr}`));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const RETENTION_DAYS = 90;
const daysAgo = (today, n) => new Date(Date.parse(`${today}T00:00:00Z`) - n * 86400000).toISOString().slice(0, 10);

/** Daily cron: delete lessons (and pending deletion requests) older than RETENTION_DAYS, reviewed or not. */
export async function retention(env, today = new Date().toISOString().slice(0, 10)) {
  const cutoff = daysAgo(today, RETENTION_DAYS);
  const a = await env.DB.prepare("DELETE FROM lessons WHERE day < ?1").bind(cutoff).run();
  const b = await env.DB.prepare("DELETE FROM deletion_requests WHERE day < ?1").bind(cutoff).run();
  return { lessons: a.meta?.changes ?? 0, requests: b.meta?.changes ?? 0 };
}

export async function handle(request, env, terms, today = new Date().toISOString().slice(0, 10)) {
  const { pathname } = new URL(request.url);
  if (pathname !== "/lesson" && pathname !== "/delete") return json(404, { ok: false, error: "not found" });
  if (request.method !== "POST") return json(405, { ok: false, error: "POST only" });
  // Shutdown switch (wrangler.toml [vars] SERVICE_STATUS, "active" by default). Plugins turn sharing off on a 410.
  if (env.SERVICE_STATUS === "ended") return json(410, { ok: false, error: "The Roblox Brain sharing service has ended." });

  // Per-connection burst limit (Workers Rate Limiting binding). The key is a SHA-256 hash of the connecting
  // address, used only as the counter key: it is never stored in D1, logged or returned.
  if (env.RATE_LIMITER) {
    const { success } = await env.RATE_LIMITER.limit({ key: await connectionKey(request) });
    if (!success) return json(429, { ok: false, error: "too many requests, try again in a minute" });
  }

  const raw = await readCapped(request, MAX_BODY);
  if (raw === null) return json(413, { ok: false, error: `body over ${MAX_BODY} bytes` });

  let body;
  try { body = JSON.parse(raw); } catch { return json(400, { ok: false, error: "invalid JSON" }); }
  if (typeof body !== "object" || body === null || Array.isArray(body)) return json(400, { ok: false, error: "lesson must be an object" });

  const install = body.install;
  if (typeof install !== "string" || !INSTALL_RE.test(install)) return json(400, { ok: false, error: "invalid install id" });

  // POST /delete {install}: delete every lesson from this install and nothing else. The random install id, which
  // only that computer's local config holds, is the proof. A request record (install + date) lets the maintainer's
  // next export purge copies already downloaded for review; it is removed after RETENTION_DAYS.
  if (pathname === "/delete") {
    const del = await env.DB.prepare("DELETE FROM lessons WHERE install = ?1").bind(install).run();
    await env.DB.prepare("INSERT INTO deletion_requests (install, day) VALUES (?1, ?2)").bind(install, today).run();
    return json(200, { ok: true, deleted: del.meta?.changes ?? 0 });
  }

  const { ok, errors, lesson } = validateLesson(body, terms);
  if (!ok) return json(400, { ok: false, errors });

  // One statement, so the daily cap can't be raced: insert only while this install has < MAX_PER_DAY today.
  const res = await env.DB.prepare(
    `INSERT INTO lessons (install, day, lesson)
     SELECT ?1, ?2, ?3
     WHERE (SELECT COUNT(*) FROM lessons WHERE install = ?1 AND day = ?2) < ?4`
  ).bind(install, today, JSON.stringify(lesson), MAX_PER_DAY).run();
  if (!res.meta?.changes) return json(429, { ok: false, error: "daily lesson limit reached" });

  return json(201, { ok: true });
}
