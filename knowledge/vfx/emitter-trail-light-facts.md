---
title: Tested particle, trail, light and capture facts
topic: vfx/emitter-trail-light-facts
scope: generic
source: maintainer-skill
tags: particleemitter lightinfluence instance.new emit rate trail teleport streak clear light range clamp clocktime replication renderfidelity precise capture edit play screenshot
---
# Tested particle, trail, light and capture facts

Each of these was checked in Studio.

**Particles**
- A ParticleEmitter made with `Instance.new` starts with LightInfluence 0, while one inserted in Studio starts with 1. Set every property in code rather than trusting defaults.
- Very high Rate, Lifetime and FlipbookFramerate values are accepted when written. Any runtime cap doesn't show up as a write error, so measure what actually renders.

**Trails**
- Teleporting a part while its Trail is enabled draws one long streak across the jump. Disable the trail (or call `Clear()`), move the part, then enable it again: that draws no streak.

**Lights and lighting**
- PointLight and SpotLight Range clamps at 120 studs.
- `Lighting.ClockTime` set on the server replicates to clients.

**Mesh detail at distance**
- Small unions keep their detail on RenderFidelity Automatic even at 300 studs. A large, finely detailed mesh (about 200 studs across) dropped out at about 80 studs until RenderFidelity was set to Precise. Use Precise for big meshes with fine detail.

**Captures**
- Edit-mode screenshots show `:Emit()` bursts but not continuous Rate emission.
- They also can't show a ParticleEmitter's ongoing output, Fire, Trail or DepthOfField. Judge those from a Play-mode capture.
- A still never proves motion: check timing in Play.
