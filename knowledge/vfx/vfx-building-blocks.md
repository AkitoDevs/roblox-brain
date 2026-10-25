---
title: VFX building blocks in Roblox
topic: vfx/building-blocks
scope: generic
source: maintainer-skill
tags: vfx particleemitter beam trail mesh flipbook squash drag velocityparallel velocityperpendicular lightning debris glyph light flicker
---
# VFX building blocks in Roblox

**ParticleEmitter**
- Flipbooks (4x4, 8x8 or a custom grid; OneShot or Loop). Squash animated over life (for example -3 to 2) gives a swipe. High Speed (90 to 180) with Drag 7 to 8 gives snap-and-hang motion. Acceleration for gravity or rising heat. ShapeInOut Inward for implosions. LockedToPart for auras. ZOffset orders layers.
- NumberRange.new(min, max) errors when min is greater than max: write rotation ranges as NumberRange.new(-40, 40).
- **Orientation tricks:** VelocityParallel with a tiny speed and SpreadAngle 360 gives each sprite a random flat orientation; VelocityParallel with Speed 0 and an EmissionDirection gives a fixed orientation (a vertical lightning strike); VelocityPerpendicular with a tiny speed makes rings face random directions, or one axis with spread 0 (portal rings, ground ripples).
- NumberSequence envelopes randomise size, transparency and squash per particle; a size curve that drops to 0 several times makes stars twinkle.
