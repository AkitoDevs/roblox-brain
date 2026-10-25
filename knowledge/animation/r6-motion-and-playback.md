---
title: R6 motion technique and Roblox playback
topic: animation/r6-playback
scope: generic
source: maintainer-skill
tags: animation r6 spline catmull-rom grip weld motor6d transform keyframesequence root motion linearvelocity priority punch passing poses baking
---
# R6 motion technique and Roblox playback

**Motion technique**
- **Spline sampling.** Easing each key segment separately makes motion stop dead at every key. Sample a Catmull-Rom spline through runs of keys instead (zero tangent at chain ends and reversals). Keep hard snaps for hit-stops only.
- **Stance blends.** Blend into and out of a stance with a separate smoothstep segment that doesn't join the spline, so the stance pose stays exact.
- **Fixed grip.** The weapon has one grip frame in the hand. To aim the blade, rotate the shoulder, never the weapon in the hand. For a second hand, search the roll about the blade axis until that hand reaches the handle. Add per-frame sub-keys along a swing so the tip travels a true arc rather than a chord.
- **Grounding.** Find the lowest leg-box corner (legs swing with the torso's pitch) and set the root height from it on every pose so feet stay planted.
- **Baking.** Bake every frame linearly for export so the authoring tool, the data and Roblox match exactly. Walks use a linear root with a known stride; playback rate in Roblox = movement speed / stride speed. Chain combos by slicing each attack at its cancel point.
- **Shared motion.** Share one body motion for dashes and rolls across characters and vary only the arms per weapon.
- **Style notes that read well:** dashes are full-force step-ins (load, drive off the back foot, stomp), not slides; rolls tumble one way with no unwinding spin; the weapon stays in hand through jumps.
