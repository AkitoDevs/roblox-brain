---
title: Measured engine behaviours (easing, casts, collision, light and camera limits, fonts)
topic: engine-facts/measured-engine-behaviours
scope: generic
source: own-testing
tags: easing cubic cubicv2 poseeasingstyle keyframe animation reversed raycast spherecast blockcast inside start canquery cancollide pointlight range limit max fieldofview fov clamp gotham montserrat font trail clear particleemitter rate lifetime
---
# Measured engine behaviours

Measured in Studio (Edit mode, values read back by script, October 2026). Each one changes how you should write code.

**Pose easing: use CubicV2, not Cubic.** On keyframe poses, the legacy `Cubic` style runs reversed: `Cubic` + `In` produces an ease-out curve, and `Cubic` + `Out` an ease-in. `CubicV2` matches TweenService's direction. If a Cubic key "eases the wrong way", this is why. (Measured in the Edit animation evaluator; a running game wasn't measured separately.) `PoseEasingStyle` has no Quad; the options are Linear, Constant, Elastic, Cubic, Bounce and CubicV2.

**Casts ignore a part they start inside.** `Raycast`, `Spherecast` and `Blockcast` that begin inside a part don't report that part; they return nil or the next part behind it. For hit checks that may start overlapping (a sword already inside an enemy), also run an overlap query (`GetPartsInPart` or `GetPartBoundsInBox`) at the start position.

**CanQuery only works when CanCollide is off.** A part with `CanCollide = true` and `CanQuery = false` is still hit by raycasts. For purely visual parts, turn off CanCollide, CanQuery and CanTouch together.

**PointLight Range tops out at 120.** Writing 200 reads back as 120. For a bigger lit area, use several lights or ambient and environment lighting.

**Camera FieldOfView clamps to 1–120.** Writing 150 reads back as 120, and 0.1 reads back as 1.

**Gotham is now Montserrat.** The Gotham font family points to the same files as Montserrat (GothamBlack measures the same as Montserrat Black). If a style guide says "Gotham Black", what players see is Montserrat Black.

**Small extras:** `Trail:Clear()` exists, and it removes the current trail segments (useful after teleporting a trail's parent). ParticleEmitter accepts Rate 5000 and Lifetime 60 when written in Edit; how much a running game actually emits wasn't measured.
