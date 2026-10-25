---
title: R6 punches and Roblox animation playback
topic: animation/r6-punches-and-playback
scope: generic
source: maintainer-skill
tags: animation r6 spline catmull-rom grip weld motor6d transform keyframesequence root motion linearvelocity priority punch passing poses baking
---
# R6 punches and Roblox animation playback

**Punches on R6 (passing poses).** Guard, body opens, hips coil first, wind-up, counter-dip, hips lead while the fist drags, shoulder whip, fist overtakes, contact with a one-frame overshoot, a brief hold, extension, the arm recoils first, recoil, settle. The arm inherits the torso's yaw, so a twisted torso throws the punch off target: compensate with an outward shoulder swing and check the fist direction numerically in root space. A straight R6 arm can't bring the fist beside the ear, so raise it behind the shoulder; a good arc runs at shoulder height from back, around the side, to the front. Preview cheaply with a pose sheet: one cloned rig per key lined up on a diagonal in a single capture.

**Roblox playback (verified)**
- A keyframe Pose's CFrame equals the Motor6D Transform, C0 inverse × relative × C1 with the standard R6 C0 and C1. Limb poses must be pure rotations.
- KeyframeSequenceProvider:RegisterKeyframeSequence gives a temporary id for Studio testing only; shipping needs uploaded animations.
- Root motion: drive the root with a LinearVelocity limited to the horizontal axes. Priorities: Idle for idle, Movement for walks, Action for moves.
- Weapon attachment: a Weld with an explicit C0; WeldConstraints can capture stale offsets.
- Hits are server-authoritative and timed from animation markers; the client only reports which move started.
