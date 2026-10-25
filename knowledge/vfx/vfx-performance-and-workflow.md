---
title: VFX performance, readability and workflow
topic: vfx/performance
scope: generic
source: maintainer-skill
tags: vfx performance particles budget emitters overdraw mobile pooling cleanup readability restraint orientation workflow testing screenshot
---
# VFX performance, readability and workflow

**Performance (mobile first)**
- Under about 200 active particles per effect, ambient emitters at 6 per second or less, at most about 6 emitters per effect.
- Never duplicate emitters to thicken an effect: dozens of copies at high rates is the classic lag source. Raise one emitter's count or use a better flipbook.
- Avoid huge transparent particles filling the screen (overdraw); a flipbook beats many particles.
- Moving effect lights: Shadows off, short Range, alive only while the effect plays.
- Effect meshes stay at a few thousand triangles; reuse one uploaded mesh for many effects by recolouring and rescaling; pool spawned parts.
- Store templates in ReplicatedStorage, clone and emit, and destroy after the computed maximum lifetime. Cull ambient emitters when the player is far away.
- Play cosmetic effects on the client. The server only says what happened and where.

**Readability and restraint**
- Big effects for big moments; ambient effects stay subtle (1 to 6 particles per second, low opacity).
- One focal point per effect; avoid uniform noise.
- Check contrast against the real background: colourful effects pop most on darker, desaturated floors.
- Orientation is part of the effect: check every flat element (portal disc, ground ring, slash, beam decal) from player camera height and from the side.
- Match the effect's drawing style to the build's art style.
- Screen effects (impact frames, shake, flashes) are the strongest and most tiring tools: keep them for big hits and respect reduce-motion settings.
- Respect the game's content rules (for example, use the splash recipe for water or coins rather than blood).

**Workflow**
- Plan first: list each layer and which tool makes it (flipbook, strand mesh, beam, particle, tween, screen effect). A signature effect usually needs one custom piece plus stock layers.
- Build in an isolated test area with a dark and a bright background. Tune at TimeScale 0.25, then at full speed, then on a phone-sized view.
- Study downloaded effects by reading their real emitter numbers (curves, speed, drag, orientation, ZOffset, emit counts) rather than eyeballing videos.
- Screenshots: particles may not have spawned in the first capture after a camera move, so take two. Some capture tools skip AlwaysOnTop billboards.
- Bring static builds to life with cheap motion besides flipbooks: GlobalWind on grass and wind-affected particles, bone-rigged swaying banners and foliage, small ambient creatures on looping paths. Keep flipbooks and strand meshes for the hero effect.
