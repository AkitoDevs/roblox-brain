// Lesson validation: the server-side gate that keeps submissions small, generic and anonymous.
import { findIssues } from "./safety.mjs";

export const OUTCOMES = ["ran_clean", "had_errors", "user_edited", "user_reverted", "unknown"];

const LIMITS = { problem: 300, fix: 400, topic: 60, apis: 10, api: 60 };
const TOPIC_RE = /^[a-z0-9\-]+(\/[a-z0-9\-]+)*$/;
const API_RE = /^[A-Za-z][A-Za-z0-9_.:]*$/;

/** Returns { ok, errors, lesson } where lesson is a cleaned copy (only known fields). */
export function validateLesson(input, terms = []) {
  const errors = [];
  const l = {};
  if (typeof input !== "object" || input === null) return { ok: false, errors: ["lesson must be an object"] };

  for (const k of ["topic", "problem", "fix"]) {
    const v = input[k];
    if (typeof v !== "string" || !v.trim()) errors.push(`${k} is required`);
    else if (v.length > LIMITS[k]) errors.push(`${k} too long (max ${LIMITS[k]})`);
    else l[k] = v.trim();
  }
  if (l.topic && !TOPIC_RE.test(l.topic)) errors.push("topic must look like 'ui/scaling' (lowercase, slashes, dashes)");

  const apis = input.apis ?? [];
  if (!Array.isArray(apis) || apis.length > LIMITS.apis) errors.push(`apis must be an array of up to ${LIMITS.apis} names`);
  else if (!apis.every((a) => typeof a === "string" && a.length <= LIMITS.api && API_RE.test(a))) errors.push("apis must be plain API/class names");
  else l.apis = apis;

  l.outcome = OUTCOMES.includes(input.outcome) ? input.outcome : "unknown";
  if (input.engine_version != null) {
    if (typeof input.engine_version === "string" && /^[0-9.]{1,12}$/.test(input.engine_version)) l.engine_version = input.engine_version;
    else errors.push("engine_version must look like '0.741'");
  }

  // Safety scan over all free text.
  const text = [l.topic, l.problem, l.fix, ...(l.apis ?? [])].filter(Boolean).join("\n");
  for (const issue of findIssues(text, terms, { lesson: true })) errors.push(`contains ${issue}`);

  return { ok: errors.length === 0, errors, lesson: l };
}
