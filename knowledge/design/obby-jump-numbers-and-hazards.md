---
title: Obby jump numbers and fair hazards
topic: design/obby-jump-numbers-and-hazards
scope: generic
source: maintainer-skill
tags: obby jump gap distance platform size hazard kill brick telegraph fairness moving platform difficulty
---
# Obby jump numbers and fair hazards

**Numbers (default character: jump height 7.2, gravity 196.2, walk speed 16)**
- Flat jump reach is about 8.67 studs (launch speed 53.15, air time 0.542 s). Each extra point of walk speed adds about 0.54 studs. Measure in Play before locking a cap, since edge take-off and lag change it.
- Gaps 4 to 6 studs are normal, 7 is a hard moment, never above 8. Avoid the "almost max" band of 7.5 to 8.5: players cannot tell whether it is possible. Required jumps should use roughly 60 to 80 percent of the real maximum.
- Rises 2 to 3 studs, 4 at most; shorten the gap when the landing is higher. Platforms 6x6 or larger (a beginner walkable width of at least 4) and at least 0.5 thick, with solid-looking edges. Make shapes larger on mobile.
- Hazard jumps use 4 to 5 studs. Never stack a narrow platform, a big gap and a timed hazard in an early stage. Safe stretches use smaller gaps than danger stretches, in consistent widths.

**Fair hazards**
- A kill block must be instantly recognisable: one dimmed red-orange look per zone, never used on safe parts, never grey. Very bright neon looks like a larger hitbox.
- Telegraph visually (a pre-flash, a crack, a wind-up), not by sound alone, because players mute audio. Deaths come only from visible hazards, never from surprise pushes or hidden zones.
- Spinners, lasers and movers use uniform periods so the timing is learnable. Fade a disappearing platform before it vanishes. Avoid sideways conveyors pushing toward kill blocks.
- Moving platforms: a PrismaticConstraint in servo mode works best (lower its responsiveness for fast ones). Tweened anchored parts do not carry characters. Check riding behaviour with two clients, since the docs do not describe it.
- Optional forgiveness scripting (a short coyote window after leaving a ledge, a jump buffer before landing, a nudge when the head bumps a corner) is a tuning guess, not a rule; start near 0.1 s and 0.12 s and adjust by feel, with touch controls getting equal or larger windows.
