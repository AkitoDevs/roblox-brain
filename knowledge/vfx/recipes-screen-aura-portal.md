---
title: VFX recipes: screen effects, auras, portals and ambient
topic: vfx/recipes-screen-aura-portal
scope: generic
source: maintainer-skill
tags: vfx recipe explosion splash ripple portal aura comet fireworks impact frame camera shake ground spikes weather torch
---
# VFX recipes: screen effects, auras, portals and ambient

- **Impact frames:** for the biggest hits only, 1 to 3 frames (about 0.03 to 0.05 s each) of stark ColorCorrection (saturation -1, extreme contrast) or a black-and-white overlay with Highlight silhouettes, then snap back. Pair with hit-stop and shake, and give players a reduce-flashing setting.
- **Camera shake:** magnitude and roughness with short fade in and out, falloff by distance from the source, client-side, and never for players who turned shake off.
- **Screen-space 3D:** particles and beams welded at a fixed offset in front of the camera make speed lines, fire borders or a frost vignette.
- **Aura:** rising flame streaks (VelocityParallel, 8x8 flipbook, Squash about -3 to 1.8, upward acceleration, thin cone, LockedToPart, size tapering to 0). Layers behind the character get negative ZOffset, sparks in front positive.
- **Weather cell:** source (cloud puffs, drifting multi-key colour), medium (rain or lightning sprites with fixed orientation), receiver (flat decal pad plus a splash ring emitter).
- **Portal:** a SurfaceGui vortex of counter-rotating alpha swirls and rings shrinking toward the centre; additive sprites facing the opening's normal at 1 to 2 per second; layered rim rings; comets spiralling inward; a floor glow, rotating sigil and coloured light; and a dark backing so it reads as depth, not a sticker.
- **Arrival puff (NPC appears, chest opens):** soft smoke (Speed 3 to 7, Drag 4, size 1.6 to 4.6, 14 particles), a 24-particle sparkle burst in the accent colour, a 0.6 s light flash.
- **Torches:** one approved flame template per family, cloned onto every torch with colours swapped and a flickering light.
- **Ambient:** fire = flipbook flame, embers, thin smoke, flicker; water = spray, slow mist, flat ripples, glints; nature = fireflies, drifting petals, dust in light shafts.
