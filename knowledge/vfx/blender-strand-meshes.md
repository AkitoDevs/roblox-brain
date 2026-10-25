---
title: Blender strand-mesh VFX for Roblox
topic: vfx/strand-meshes
scope: generic
source: maintainer-skill
tags: vfx blender strand mesh slash comet swirl orb modifier mask twist neon meshpart doublesided import energy
---
# Blender strand-mesh VFX for Roblox

A Blender modifier stack turns a plain cylinder into a bundle of noisy, flowing energy strands that can be shaped into slashes, comets, swirls, orbs and drills, then imported as a MeshPart. Keep modifiers live while shaping and apply only at export; order matters.

1. **Base:** a cylinder rotated to lie along one axis and scaled long (about 9 to 10x). Subdivide in Edit mode so there are many edge loops along the length: more loops, smoother strands.
2. **Vertex group** containing every vertex at weight 1.
3. **Vertex Weight Edit** on that group: custom-curve falloff, inverted, with a Clouds texture mask using global coordinates. This writes cloudy noise into the weights; the cloud size sets strand thickness and its offset changes the pattern.
4. **Mask** in vertex-group mode, threshold around 0.4: low-weight vertices vanish and the tube breaks into strands. Higher threshold, fewer and thinner strands.
5. **Smooth**, repeat about 30, to melt the cut edges into ribbons.
6. **Simple Deform, Twist** 360 degrees along the tube's length so the strands spiral.
7. **Shape it** by scaling and moving vertex rings in Edit mode; the modifiers re-flow the strands. Taper one end for a comet or arrow, flare it for a blast, pinch in steps for a drill, bend into a crescent for a swirl, wrap around a sphere for an orb shell.
8. **Preview** with an emission material, a dark background and bloom. This is only a preview: Roblox does not carry the emission over.

**Bringing it into Roblox**
- Export with modifiers applied and import as a MeshPart. Stay under the per-mesh triangle limit (about 20k); add Decimate if needed.
- Strands are thin single-sided surfaces: enable DoubleSided on the MeshPart or add a small Solidify so they don't vanish from behind.
- Glow comes from Roblox: Neon material in the effect colour (it blooms with Lighting Bloom), Transparency for fades, and a PointLight in the hue. A white base lets one mesh serve every element.
- Anchored, collision, query, touch and shadows off, Massless; play on the client.
- Animate with tweens or one client loop: pop in (scale about 0.2, 1.1, 1), spin along the length axis, fly along the path, fade, destroy. Stack 2 to 3 copies at different scales and delays for density.
- The noise is baked: to make strands crawl, swap 2 to 4 exported variants as a mesh flipbook, or render the twisting animation as a sprite sheet.
- Pair with stock layers: sparks, a trail behind a projectile, a ground ring at impact.
