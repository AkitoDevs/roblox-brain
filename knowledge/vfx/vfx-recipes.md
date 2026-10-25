---
title: VFX recipes with working numbers
topic: vfx/recipes
scope: generic
source: maintainer-skill
tags: vfx recipe explosion splash ripple portal aura comet fireworks impact frame camera shake ground spikes weather torch
---
# VFX recipes with working numbers

- **Explosion:** a flash layer (2 to 4 huge short sprites); main streak flares (Speed 90 to 180, Drag 8, VelocityParallel, Squash -1 to -2); twinkling stars; specks shrinking from 1.2 to 0 with fast spin; smoke (8x8 flipbook, Speed 20 to 110, Drag 8, size 3 to 17, random start rotation); rings (VelocityPerpendicular, size 3 to 30, start transparency 0.75).
- **Splash (water, goo, petals, coins):** a flat flipbook shockwave ring growing fast then holding; streaks (VelocityParallel, Speed 20 to 90, Drag 7, squash with envelope); soft blobs (Speed 30, Drag 3.5); bright droplets (size 0, 1.2, 0, Drag 10, ZOffset 3); a flat beam stain underneath.
- **Puddle ripples:** a hand-drawn ripple flipbook lying flat, 3 to 5 emitters at different sizes and phases, low opacity, faint glints.
- **Strand comet:** a tapered strand mesh in Neon flying along its path while spinning slowly, a glow sprite and PointLight at the head, a trail, sparks shed along the way, a ring and flash on impact.
- **Ground spike eruption:** spikes spawned along a shape (ring, line or cone), placed by raycast so they sit on the ground and take its material and colour, each with a random tilt and size. Spawn progressively outward, hold, then sink back staggered. Dust at each base, a few thrown chunks, a crack decal, shake on the first wave. Tens of spikes, not hundreds, on mobile, reused from a pool.
- **Fireworks:** a rising streak that bursts into many four-point stars in mixed bright hues, a flash and small shake, then glittering fall-off with gravity and twinkling size curves.
