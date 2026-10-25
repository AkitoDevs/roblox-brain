---
title: Baking, exporting and foliage cards for Roblox kits
topic: art/bake-export
scope: generic
source: maintainer-skill
tags: blender bake emit fbx export uv layer vertex colors texel density triangles foliage alpha card atlas import 3d studs pivot
---
# Baking, exporting and foliage cards for Roblox kits

**Bake**
1. Apply modifiers, join the pieces, Smart UV Project with a small margin (about 0.01).
2. Route the painted result through Emission and bake EMIT to a 1024 × 1024 image at about 64 samples (16 is grainy).
3. Rewire the baked image into Base Color and pack it. Model in studs (1 Blender unit = 1 stud) on a grid, with the pivot at a consistent corner such as bottom-front-left.

**Export (FBX)**
- Scale option for units, copy and embed textures, and turn colour export off: Blender writes colour attributes as vertex colours by default, and the shading is already baked.
- Keep exactly one UV layer, named UVMap: delete primitives' default layers and helper layers. Studio doesn't support multiple UV sets.
- When scripting, applying scale with Blender's transform-apply also applies location and rotation unless you turn those off, which makes later rotations swing about the world origin.
- In Studio, import with the scale unit set to studs.

**Check by re-importing:** size, embedded image, exactly one UV layer, no colour attributes, and the part and triangle count against what you built (a missing part can make the size look right). Object dimensions can read stale after a mesh transform until the view layer updates.

**Texel density:** √(pixels² × UV area ÷ surface area), in pixels per stud. Keep pieces of one kit within about 15% of each other (around 45 to 55 px per stud at 1024² worked for a small kit).

**Triangle budget:** check before export. Curve over-sampling with two bevel segments gave over 10,000 triangles for one arch; five points per block and one segment gave under 1,000 with the same look.

**Foliage as alpha cards**
1. Render a dense tuft front-on, orthographic, to a 512 × 512 sprite with a transparent background.
2. Make a card from three quads crossing at 60 degrees: about 6 triangles versus 18 for a geometry tuft.
3. Pack a 2 × 2 atlas (two grass shapes, flowers, ivy) and remap each card's UVs into one quarter.
4. In Blender previews, raise the transparent bounce limit (about 64) or overlapping cards render black.
5. In Roblox: SurfaceAppearance with AlphaMode set to Transparency, the MeshPart's own Transparency at 0, and DoubleSided on (from notes; confirm in your place).
