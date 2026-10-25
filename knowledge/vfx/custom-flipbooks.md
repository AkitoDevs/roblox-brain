---
title: Custom hand-drawn flipbooks and texture blending
topic: vfx/flipbooks
scope: generic
source: maintainer-skill
tags: vfx flipbook sprite sheet hand drawn animation grid particleemitter texture alpha additive black background surfacegui
---
# Custom hand-drawn flipbooks and texture blending

Roblox has no procedural shader VFX, so bespoke shapes (a lightning strike, a ripple, a stylised splash) come from sprite sheets played by a ParticleEmitter.

1. **Animate** a short loop or one-shot in any 2D animation app. Draw in white or light grey so colour comes from the emitter's Color sequence. Warp or liquify across frames for cheap organic wobble. Export a GIF. A 3D effect rendered in Blender can become a sheet the same way.
2. **Smooth:** frame interpolation (2x or 3x) fills in-betweens; check it doesn't smear sharp shapes like lightning.
3. **Background:** transparent for alpha use; black for additive use (LightEmission 1).
4. **Fill the grid exactly.** Pick columns × rows so the frame count fills every cell; delete trailing frames until no cell is empty, because empty cells play as blank flashes.
5. **Resolution:** uploaded images are capped around 1024 px per side, so an 8-column sheet gives about 128 px per frame. Fewer, larger frames read crisper.
6. **Emitter:** set the texture and a matching FlipbookLayout (custom when it isn't 2x2, 4x4 or 8x8), OneShot for single plays, Loop for ambient. Set speed with the flipbook framerate (and Lifetime for OneShot), not TimeScale, which also speeds up particle motion. Start from a known-good flipbook emitter and change only the texture and grid.
7. **Orient:** ground ripple = VelocityPerpendicular, spread 0, tiny speed; vertical strike = VelocityParallel, Speed 0, fixed EmissionDirection. Rotate and size by moving the attachment, and preview from player camera height.
8. **Layer:** a few copies with offset sizes and delays turn one ripple into a puddle field. Add glow, sparks and a light so the drawn shape doesn't sit alone.

**Alpha versus additive (check before using any texture)**
- GUI images are alpha-blended only; there is no additive mode. A white-on-black particle texture shows as a black square in an ImageLabel.
- Black-background textures belong only in ParticleEmitter, Beam or Trail with LightEmission 1. GUI layers need real alpha.
- Test an unknown texture over a bright saturated backdrop: a dark square around the shape means additive-only.
- A SurfaceGui keeps rendering on an invisible host part, which makes a clean canvas for layered glows. Its canvas stretches to the face, so a non-square face turns a rotated image elliptical (useful for oval portals). With ClipsDescendants on, keep radial images within the canvas or hard edges show.
- GUI layer motion (spin, pulse, ripple, flicker) runs in one client loop that skips disabled or distant GUIs.
