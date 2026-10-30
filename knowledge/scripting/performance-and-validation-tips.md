---
title: Performance and validation tips (unverified)
topic: scripting/performance-and-validation-tips
scope: generic
source: community-lesson
tags: performance same value write descendantadded dispatcher lazy load allocation remote validation isfinite nan intent unreliable
---
# Performance and validation tips

Every line here is labelled **Unverified tip:** because it comes from outside reading and has not been tested by us. Measure before and after in your own place.

**Performance**
- **Unverified tip:** don't write a property or attribute when the value hasn't changed (compare first). Same-value writes may still cost work or fire change signals in busy loops.
- **Unverified tip:** use one DescendantAdded connection on a service and dispatch to handlers by tag or name, instead of many separate listeners each running on every new instance.
- **Unverified tip:** load per-character or per-map data lazily when it is first needed, and release it after.
- **Unverified tip:** avoid building new tables and strings every frame in hot loops; reuse buffers.
- **Unverified tip:** count worst-case frames, not averages, when judging a combat or effects pass: the frame where everything overlaps is the one that drops.
- **Unverified tip:** before a broad optimisation pass, record the render and physics counts and keep a list of what you changed so it can be reverted one item at a time.

**Validation**
- **Unverified tip:** reject numbers that are NaN or infinite (a finite check) as well as out of range; a NaN slips past simple "greater than" checks.
- **Unverified tip:** design remotes as intent only ("start this attack"), with the server computing damage, position and timing, so there is nothing for a client to forge.
- **Unverified tip:** use a separate rate limit per action, not one for the whole player.
- **Unverified tip:** use unreliable remotes only for data that can be dropped (cosmetics), keep payloads small, and keep gameplay-critical events reliable and ordered.

Tested remote-validation and rate-limit patterns are in the security and scripting entries.
