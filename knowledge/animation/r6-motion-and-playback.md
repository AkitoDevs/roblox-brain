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

**How the Animator plays clips (measured on R6 in Edit)**
- Two-key Linear clips interpolate with nlerp; unevenly spaced keys use a lerp of the rotation vector. Rotations are not slerped, so avoid huge single steps and never key an exact 180 degree turn.
- A track at weight 0.5 on its own gives half the rotation: spare weight blends toward the rest pose, not toward a lower layer.
- The HumanoidRootPart pose in a clip is ignored. Key root motion on the Torso pose.
- A clip registered at runtime shows nothing until its Length is above 0, plus one frame after Play. Preload clips before they're needed.
- To hold a pose for a capture: Play, AdjustSpeed(0), set TimePosition, then StepAnimations(0).
