---
title: Importing, holding and skinning weapons in Roblox
topic: art/weapons-roblox
scope: generic
source: maintainer-skill
tags: weapon import 3d importer grip weld pivot surfaceappearance skin rarity gradient rainbow shimmer part-built blade tiers
---
# Importing, holding and skinning weapons in Roblox

**Import**
- Studio's 3D Importer handles FBX and OBJ, and current versions handle glTF/GLB; check your version.
- Before import: merge by material, keep each mesh well under the per-mesh triangle limit (about 20k), and scale to the character (a small knife is about 1 to 1.5 studs long for a 5-stud character).
- **Pivot at the grip centre.** Weld to the hand with the grip axis along the fist, with a small offset so the weapon sits in front of the hand. A weapon should go through the fist, never through the forearm.
- **Skin with SurfaceAppearance:** ColorMap plus MetalnessMap and RoughnessMap. Atlas parts can use the palette image as their ColorMap. SurfaceAppearance.Color tints the whole mesh, which gives cheap recolours for rarity variants.
- Massless; CanCollide, CanQuery and CanTouch off; CastShadow off for small weapons.

**Part-built weapons (no mesh)**
- Build the blade from 2 to 4 wedges or blocks along an arc, or one thin block for a straight blade. Add a thin, slightly lighter metal strip along the edge to fake the grind.
- **Gradient on a flat blade:** a SurfaceGui on each large face holding a full-size Frame with a UIGradient (a rainbow ColorSequence of up to 20 keypoints at Rotation 30 to 45 for a diagonal sweep). LightInfluence about 0.5 to 0.8 so the blade still takes some light. A second mostly transparent frame with a white gradient band makes the sheen.
- **Animated shimmer:** tween the UIGradient's Offset or Rotation slowly in a loop; for a tiling Texture tween OffsetStudsU/V; for whole-object hue cycling step SurfaceAppearance.Color or the part Color.
- **Rings and guards:** 8 to 12 small cylinders in a circle, or one ring mesh. A plain cylinder makes a flat washer, not a ring.

**Skin tiers by rarity**
- Common: flat material colours.
- Rare: a two-tone gradient, a coloured edge strip, one emissive accent.
- Epic: a full rainbow or themed gradient with a sheen band, plus a soft trail when swung.
- Legendary: an animated shimmer, a faint aura particle along the blade, and a coloured light that tints the hand and floor.
- Keep the handle dark and matte at every tier: the frame is what makes the skin pop.

**Checklist:** silhouette reads as one black shape at game distance; small detail visible because dark tones are separated; materials differ in roughness and metalness; one warm accent; the skin flows continuously across the shape; merged by material, pivot at the grip, sized to the character; held in the fist.
