---
title: Clip, scale and playability checks
topic: building/clip-scale-playability-checks
scope: generic
source: maintainer-skill
tags: build critique greyscale value focal point clip check overlap coplanar capture set day dusk night lighting budget play walk review
---
# Clip, scale and playability checks

**Clip and scale checks (after every build step)**
- Run a scripted overlap and coplanar-face test, then take close-ups at the joints. Allowlist intentional overlaps by name. One gatehouse went from thousands of overlaps to zero this way; flush door jambs were fixed with a small lift.
- Keep the 5-stud stand-in in frame, and do a Play walk for routes, doors and stairs: Play finds things captures miss, like a door recess you can't walk into.
- A build that looks right from the hero camera may not be playable: walk it from spawn and look at the back, inside and under.
- Use 0.25 and 0.125 stud increments; keep overlays slightly apart.
- Budgets: box collision on walls and decor, CastShadow off on edge foliage and small detail, no stacked transparency over large screen areas, each mesh under 20k triangles. Draw calls and memory need Studio's own scene analysis or render stats, so list them as unverified until someone checks.

**Critique by eye**
1. Capture the same cameras before and after (front, side, back, elevated, player height), plus a desaturated copy and a solid-black silhouette.
2. After each fix, recheck the other qualities that element touches from a second view: hills added for ground contact once flattened the side silhouette.
3. Name the three biggest remaining weaknesses honestly, and say when a change is small.
4. Numbers are background only: if a number passes but the image looks wrong, the image wins. If the person you're building for prefers another version, show the alternatives and take their pick.
5. Report status with exact words (created, executed, previewed, imported, runtime-tested, approved) and keep the previous version recoverable.
