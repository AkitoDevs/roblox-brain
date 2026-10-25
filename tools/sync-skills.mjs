// Keeps the shared knowledge in step with the maintainer's own skills. Used by the /sync-skills command.
// Classification is automatic and conservative: when in doubt, a skill or a line is left out.
// Private state (all gitignored): triage/sync-map.local.json, triage/skill-snapshots/, triage/name-scan.local.txt.
// Nothing here edits a skill or pushes anything.
//
//   status [--count]                   changed / missing / new skills (--count: number of mapped skills changed)
//   prepare                            auto-classify new + changed skills, write usable lines and entry copies to a draft
//   check <draftDir> [--fix]           blocklist, name and link scan, build rules on proposed entries; --fix drops
//                                      flagged lines and logs what was removed; writes entry diffs
//   apply <draftDir>                   copy every proposed entry that changed and passes check into knowledge/
//   finish <draftDir>                  mark processed skills synced (snapshot + hash) and print the one summary
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { parseEntry } from "../lib/knowledge.mjs";
import { loadBlocklist, findIssues } from "../lib/safety.mjs";
import { unifiedDiff } from "./difflib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mapFile = process.env.RBRAIN_SYNC_MAP ?? path.join(root, "triage", "sync-map.local.json");
const snapDir = process.env.RBRAIN_SNAPSHOTS ?? path.join(root, "triage", "skill-snapshots");
const nameScanFile = process.env.RBRAIN_NAME_SCAN ?? path.join(root, "triage", "name-scan.local.txt");
const home = os.homedir();
const ownRoots = (process.env.RBRAIN_SKILL_ROOTS ?? path.join(home, ".claude", "skills")).split(path.delimiter);
const pluginRoots = (process.env.RBRAIN_PLUGIN_ROOTS ?? path.join(home, ".claude", "plugins")).split(path.delimiter);
const draftsDir = path.join(root, "candidates", "drafts");
const SOURCES = ["own-testing", "community-lesson", "roblox-docs", "maintainer-skill"];

const norm = (s) => s.replace(/^﻿/, "").replace(/\r\n/g, "\n");
const sha = (s) => crypto.createHash("sha256").update(norm(s)).digest("hex");
const expand = (p) => p.replace(/^~(?=[/\\])/, home);
const safeName = (n) => n.replace(/[^a-z0-9._-]+/gi, "_");
const snapPath = (n) => path.join(snapDir, `${safeName(n)}.md`);
const today = () => new Date().toISOString().slice(0, 10);
const under = (p, roots) => roots.some((r) => path.resolve(p).toLowerCase().startsWith(path.resolve(r).toLowerCase() + path.sep));
const readLines = (f) => (fs.existsSync(f) ? norm(fs.readFileSync(f, "utf8")).split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#")) : []);

// ---- signals ---------------------------------------------------------------------------------------------
const privateTerms = readLines(path.join(root, "blocklist.private.txt")).map((t) => t.toLowerCase());
const buildTerms = loadBlocklist(root);
const scanNames = readLines(nameScanFile);
const nameRe = scanNames.length ? new RegExp(`(?<![a-z0-9])(${scanNames.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![a-z0-9])`, "i") : null;
const PATH_RE = /[A-Za-z]:[\\/][\w]|~[\\/]\.?\w|\/Users\/|\/home\/|\[\[[^\]]+\]\]/; // local paths and private note links
const BORROWED_RE = /https?:\/\/|www\.|github\.com|youtu\.?be|©|\bcopyright\b|\blicen[cs]ed?\b|\b(adapted|condensed|ported|copied|taken|translated) from\b|\bbased on\b|\bcopy of\b|\bfrom (x|twitter|youtube|a video|video|devforum|the forum|forum|reddit) (research|round|post|thread|breakdown|notes?)\b|\(from [^)]*(video|research|forum|thread|breakdown)[^)]*\)|\bcredit(s|ed)? (to|by)\b|(^|\s)@[a-z0-9_]{3,}/i;
// "learned from X" only counts when X is a specific named work or creator (a capitalised name or a link)
const LEARNED_NAMED_RE = /\b(learned|learnt|studied|taken) from\b[^.\n]{0,40}?(\b[A-Z][a-zA-Z0-9]+[A-Z0-9]\w*|\b[A-Z][a-z]+ [A-Z][a-z]+|https?:)/;

function lineSignal(line) {
  const low = line.toLowerCase();
  if (privateTerms.some((t) => low.includes(t))) return "a private term";
  if (PATH_RE.test(line)) return "a local path or private note link";
  if (BORROWED_RE.test(line) || LEARNED_NAMED_RE.test(line)) return "attribution or a link to someone else's material";
  if (nameRe?.test(line)) return "the name of another game, creator or brand";
  return null;
}

// headerText: also treat attribution in the skill's opening lines as skill-level (new skills only; for a changed
// mapped skill, new lines are filtered one by one instead).
function skillLevelThirdParty(file, text, headerText = true) {
  if (under(file, pluginRoots)) return "comes from an installed plugin or marketplace";
  const fm = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  if (/^\s*(author|license|licence)\s*:/im.test(fm) || /^\s+author\s*:/im.test(fm)) return "has another author or a licence in its header";
  let d = path.dirname(file);
  for (let i = 0; i < 3; i++) {
    if (["LICENSE", "LICENSE.md", "LICENSE.txt", "LICENCE"].some((n) => fs.existsSync(path.join(d, n)))) return "ships with someone else's licence file";
    if (ownRoots.some((r) => path.resolve(d) === path.resolve(r))) break;
    d = path.dirname(d);
  }
  if (!headerText) return null;
  const head = text.split("\n").slice(0, 25).join("\n");
  if (BORROWED_RE.test(head) || LEARNED_NAMED_RE.test(head)) return "its header credits or links another creator's work";
  return null;
}

// Classify a whole (new) skill. Few flagged lines -> mixed (use the rest); more -> excluded. In doubt, exclude.
function classifyNew(file, text) {
  const tp = skillLevelThirdParty(file, text);
  if (tp) return { group: "third-party", reason: tp };
  if (!under(file, ownRoots)) return { group: "personal", reason: "lives outside your own skills folders" };
  const lines = text.split("\n").filter((l) => l.trim());
  const flagged = lines.map(lineSignal).filter(Boolean);
  const personal = flagged.filter((s) => s === "a private term" || s.startsWith("a local path")).length;
  const ratio = flagged.length / (lines.length || 1);
  if (!flagged.length) return { group: "shareable", reason: "your own skill with no personal or borrowed signals" };
  if (ratio <= 0.1) return { group: "mixed", reason: `${flagged.length} personal or borrowed line(s) dropped, the rest used` };
  return { group: personal >= flagged.length / 2 ? "personal" : "unsure", reason: personal >= flagged.length / 2 ? "mentions private terms, paths or private notes too often" : "too many borrowed or named lines to separate safely" };
}

// ---- map and scanning ------------------------------------------------------------------------------------
function loadMap() {
  if (!fs.existsSync(mapFile)) { console.error(`No sync map at ${path.relative(root, mapFile)}. It is private and built once by the maintainer.`); process.exit(1); }
  return JSON.parse(fs.readFileSync(mapFile, "utf8"));
}
const saveMap = (m) => fs.writeFileSync(mapFile, JSON.stringify(m, null, 2) + "\n");
const readSkill = (s) => { const p = expand(s.path); return fs.existsSync(p) ? norm(fs.readFileSync(p, "utf8")) : null; };

function scanSkills(roots) {
  const found = [];
  const walk = (d, depth) => {
    if (depth > 6 || !fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (!e.isDirectory() || e.name === "node_modules" || e.name.startsWith(".")) continue;
      const p = path.join(d, e.name), f = path.join(p, "SKILL.md");
      if (fs.existsSync(f)) {
        const raw = norm(fs.readFileSync(f, "utf8"));
        const name = (raw.match(/^name:\s*"?([^"\n]+)"?/m)?.[1] ?? e.name).trim();
        const desc = raw.match(/^description:\s*(.*)$/m)?.[1] ?? "";
        if (/roblox|luau/i.test(`${name} ${desc}`) || (raw.match(/roblox|luau/gi) ?? []).length >= 5) found.push({ name, path: f, synced: /[\\/]synced[\\/]/.test(f), text: raw });
      } else walk(p, depth + 1);
    }
  };
  for (const r of roots) walk(r, 0);
  return found;
}

function status() {
  const m = loadMap();
  const changed = [], missing = [], unsynced = [];
  for (const [name, s] of Object.entries(m.skills)) {
    const text = readSkill(s);
    if (text === null) missing.push(name);
    else if (!s.sha256) unsynced.push(name);
    else if (sha(text) !== s.sha256) changed.push(name);
  }
  const knownPaths = new Set(Object.values(m.skills).map((s) => path.resolve(expand(s.path)).toLowerCase()));
  const knownNames = new Set([...Object.keys(m.skills), ...Object.keys(m.classified ?? {})]);
  const fresh = scanSkills([...ownRoots, ...pluginRoots]).filter((s) => !knownPaths.has(path.resolve(s.path).toLowerCase()) && !knownNames.has(s.name) && !knownNames.has(`${s.name} (local)`));
  return { m, changed, missing, unsynced, fresh };
}

const draftDirArg = (a) => {
  const dir = path.resolve(a ?? "");
  if (!dir.startsWith(draftsDir + path.sep) || !fs.existsSync(path.join(dir, "report.json"))) { console.error("Pass a sync draft folder made by `prepare` (under candidates/drafts/)."); process.exit(1); }
  return dir;
};
const readReport = (dir) => JSON.parse(fs.readFileSync(path.join(dir, "report.json"), "utf8"));
const writeReport = (dir, r) => fs.writeFileSync(path.join(dir, "report.json"), JSON.stringify(r, null, 2) + "\n");
const walkMd = (d) => (fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walkMd(path.join(d, e.name)) : e.name.endsWith(".md") ? [path.join(d, e.name)] : [])) : []);

// ---- commands --------------------------------------------------------------------------------------------
const [cmd, ...rest] = process.argv.slice(2);

if (cmd === "status") {
  const st = status();
  if (rest.includes("--count")) { console.log(st.changed.length); process.exit(0); }
  console.log(`Mapped skills: ${Object.keys(st.m.skills).length}. Changed since last sync: ${st.changed.length}. Not synced yet: ${st.unsynced.length}. Missing on disk: ${st.missing.length}. New Roblox skills found: ${st.fresh.length}.`);
  for (const [k, v] of [["Changed", st.changed], ["Not synced yet", st.unsynced], ["Missing", st.missing], ["New", st.fresh.map((f) => f.name)]]) if (v.length) console.log(`${k}: ${v.join(", ")}`);
} else if (cmd === "prepare") {
  const st = status();
  const out = path.join(draftsDir, `sync-${today()}`);
  if (fs.existsSync(out)) { console.error(`${path.relative(root, out)} already exists: finish or delete it first.`); process.exit(1); }
  fs.mkdirSync(path.join(out, "usable"), { recursive: true });
  const report = { created: today(), used: [], skipped: [], removed: [], newSkills: [] };
  const copyEntries = (ids) => { for (const id of ids) { const dst = path.join(out, "knowledge", `${id}.md`); if (fs.existsSync(dst)) continue; fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(path.join(root, "knowledge", `${id}.md`), dst); } };
  const keep = (name, lines, entries, group) => {
    const usable = [], dropped = [];
    for (const l of lines) { const sig = lineSignal(l); (sig ? dropped : usable).push(sig ? { sig } : l); }
    fs.writeFileSync(path.join(out, "usable", `${safeName(name)}.txt`), usable.join("\n") + "\n");
    for (const d of dropped) report.removed.push({ skill: name, reason: d.sig, where: "skill text, before drafting" });
    report.used.push({ skill: name, group, entries, usableLines: usable.filter((l) => l.trim()).length, droppedLines: dropped.length });
    copyEntries(entries);
  };
  // changed mapped skills: only the lines added since the last sync are candidates
  for (const name of [...st.changed, ...st.unsynced]) {
    const s = st.m.skills[name];
    const text = readSkill(s);
    const tp = skillLevelThirdParty(expand(s.path), text, false);
    if (tp) { report.skipped.push({ skill: name, reason: tp }); continue; }
    const before = fs.existsSync(snapPath(name)) ? norm(fs.readFileSync(snapPath(name), "utf8")) : "";
    const added = unifiedDiff(before, text, "a", "b").split("\n").filter((l) => l.startsWith("+") && !l.startsWith("+++")).map((l) => l.slice(1));
    if (!added.some((l) => l.trim())) { report.skipped.push({ skill: name, reason: "only removals or formatting changed; nothing to add" }); continue; }
    keep(name, added, s.entries, s.group ?? "shareable");
  }
  // new skills: classify automatically
  for (const f of st.fresh) {
    const c = classifyNew(f.path, f.text);
    report.newSkills.push({ skill: f.name, ...c });
    st.m.classified ??= {};
    if (c.group === "shareable" || c.group === "mixed") {
      st.m.skills[f.name] = { path: f.path.replace(home, "~"), synced: f.synced, group: c.group, sha256: null, entries: [], last_sync: null };
      keep(f.name, f.text.replace(/^---\n[\s\S]*?\n---\n?/, "").split("\n"), [], c.group);
    } else {
      st.m.classified[f.name] = c.group;
      report.skipped.push({ skill: f.name, reason: `${c.group}: ${c.reason}` });
    }
  }
  for (const name of st.missing) report.skipped.push({ skill: name, reason: "skill file no longer found on disk" });
  saveMap(st.m);
  writeReport(out, report);
  console.log(`Prepared ${path.relative(root, out)}: ${report.used.length} skill(s) to draft from, ${report.skipped.length} skipped, ${report.removed.length} line(s) removed before drafting.`);
  for (const u of report.used) console.log(`USE ${u.skill} (${u.group}): ${u.usableLines} usable line(s) in usable/${safeName(u.skill)}.txt; entries: ${u.entries.join(", ") || "none yet (add new ones under knowledge/<area>/)"}`);
  for (const s of report.skipped) console.log(`SKIP ${s.skill}: ${s.reason}`);
} else if (cmd === "check") {
  const dir = draftDirArg(rest[0]);
  const fix = rest.includes("--fix");
  const report = readReport(dir);
  let failed = 0, changed = 0;
  fs.rmSync(path.join(dir, "entry-diffs"), { recursive: true, force: true });
  fs.mkdirSync(path.join(dir, "entry-diffs"), { recursive: true });
  for (const f of walkMd(path.join(dir, "knowledge"))) {
    const id = path.relative(path.join(dir, "knowledge"), f).replace(/\\/g, "/").replace(/\.md$/, "");
    let text = norm(fs.readFileSync(f, "utf8"));
    const live = path.join(root, "knowledge", `${id}.md`);
    const before = fs.existsSync(live) ? norm(fs.readFileSync(live, "utf8")) : "";
    if (fix) {
      // only lines that are new compared with the live entry can be removed by the scans
      const liveLines = new Set(before.split("\n"));
      const kept = text.split("\n").filter((l) => {
        if (liveLines.has(l) || /^(title|topic|scope|source|tags):|^---$/.test(l)) return true;
        const sig = lineSignal(l) ?? (findIssues(l, buildTerms).length ? "a blocked pattern (code, id, email, path or token)" : null);
        if (sig) report.removed.push({ entry: id, reason: sig, where: "proposed entry" });
        return !sig;
      });
      text = kept.join("\n");
      fs.writeFileSync(f, text);
    }
    const e = parseEntry(text, id);
    const problems = [];
    if (e.error) problems.push(e.error);
    for (const k of ["title", "topic", "scope", "source"]) if (!e.meta[k]) problems.push(`missing '${k}'`);
    if (e.meta.scope && e.meta.scope !== "generic") problems.push("scope must be 'generic'");
    if (e.meta.source && !SOURCES.includes(e.meta.source)) problems.push(`source must be one of ${SOURCES.join(", ")}`);
    for (const i of findIssues(`${JSON.stringify(e.meta)}\n${e.body}`, buildTerms)) problems.push(`contains ${i}`);
    const newLines = text.split("\n").filter((l) => !before.split("\n").includes(l));
    for (const l of newLines) { const sig = lineSignal(l); if (sig) problems.push(`new line contains ${sig}`); }
    const words = e.body.split(/\s+/).filter(Boolean).length;
    const diff = unifiedDiff(before, text, before ? `knowledge/${id}.md` : "/dev/null", `knowledge/${id}.md (proposed)`);
    if (diff) { changed++; fs.writeFileSync(path.join(dir, "entry-diffs", `${id.replace(/\//g, "__")}.diff`), diff); }
    console.log(`${problems.length ? "FAIL" : " ok "}  ${id}  (${words} words${words > 400 ? ", consider splitting" : ""}${diff ? (before ? ", updated" : ", new") : ", unchanged"})`);
    for (const p of [...new Set(problems)]) console.log(`        - ${p}`);
    if (problems.length) failed++;
  }
  writeReport(dir, report);
  console.log(failed ? `Check FAILED for ${failed} file(s).` : `Check OK. ${changed} entr${changed === 1 ? "y" : "ies"} changed or new.`);
  process.exit(failed ? 1 : 0);
} else if (cmd === "apply") {
  const dir = draftDirArg(rest[0]);
  const report = readReport(dir);
  report.applied = { updated: [], created: [] };
  for (const f of walkMd(path.join(dir, "knowledge"))) {
    const id = path.relative(path.join(dir, "knowledge"), f).replace(/\\/g, "/").replace(/\.md$/, "");
    if (!/^[a-z0-9-]+(\/[a-z0-9-]+)+$/.test(id)) throw new Error(`bad entry id: ${id}`);
    const text = norm(fs.readFileSync(f, "utf8"));
    const live = path.join(root, "knowledge", `${id}.md`);
    const before = fs.existsSync(live) ? norm(fs.readFileSync(live, "utf8")) : null;
    if (before === text) continue;
    fs.mkdirSync(path.dirname(live), { recursive: true });
    fs.writeFileSync(live, text);
    report.applied[before === null ? "created" : "updated"].push(id);
  }
  writeReport(dir, report);
  console.log(`Applied: ${report.applied.updated.length} updated, ${report.applied.created.length} new.`);
} else if (cmd === "finish") {
  const dir = draftDirArg(rest[0]);
  const report = readReport(dir);
  const m = loadMap();
  fs.mkdirSync(snapDir, { recursive: true });
  const processed = [...report.used.map((u) => u.skill), ...report.skipped.map((s) => s.skill).filter((n) => m.skills[n] && readSkill(m.skills[n]) !== null)];
  for (const name of processed) {
    const s = m.skills[name];
    const text = readSkill(s);
    fs.writeFileSync(snapPath(name), text);
    s.sha256 = sha(text);
    s.last_sync = today();
  }
  for (const id of report.applied?.created ?? []) {
    const owner = report.used.find((u) => u.entries.length === 0 || u.entries.includes(id));
    if (owner && !m.skills[owner.skill].entries.includes(id)) m.skills[owner.skill].entries.push(id);
  }
  saveMap(m);
  const a = report.applied ?? { updated: [], created: [] };
  const lines = [
    `Entries updated (${a.updated.length}): ${a.updated.join(", ") || "none"}`,
    `New entries (${a.created.length}): ${a.created.join(", ") || "none"}`,
    `Skills skipped (${report.skipped.length}):${report.skipped.length ? "" : " none"}`,
    ...report.skipped.map((s) => `  - ${s.skill}: ${s.reason}`),
    `Removed by the scans (${report.removed.length}):${report.removed.length ? "" : " nothing"}`,
    ...Object.entries(report.removed.reduce((acc, r) => { const k = `${r.skill ?? r.entry}: ${r.reason}`; acc[k] = (acc[k] ?? 0) + 1; return acc; }, {})).map(([k, n]) => `  - ${n} line(s) from ${k}`),
  ];
  fs.writeFileSync(path.join(dir, "SUMMARY.txt"), lines.join("\n") + "\n");
  console.log(lines.join("\n"));
} else {
  console.error("Commands: status [--count] | prepare | check <draftDir> [--fix] | apply <draftDir> | finish <draftDir>");
  process.exit(1);
}
