---
title: Stylised asset standards from Blender to Roblox
topic: art/asset-standards
scope: generic
source: maintainer-skill
tags: blender modeling hard surface materials texture bevel silhouette lod presentation gameplay asset roughness atlas implementation qa
---
# Stylised asset standards from Blender to Roblox

**Modeling**
- Silhouette before detail; primary, secondary and tertiary hierarchy; important shapes readable at distance.
- Selective bevels to catch highlights; no needless subdivision or microgeometry that vanishes at game distance.
- Consistent scale and orientation, applied transforms, origins placed where the asset attaches or rotates, moving parts separated, meaningful names, clean normals, few material slots.
- When useful keep two versions and label them: a **presentation asset** for close-up renders and a **gameplay asset** that is optimised and practical.
- Hard surface (swords, armour, hammers): believable thickness, bevels for rim light, restrained damage, deliberate asymmetry, layered geometry over pure texture, readable grip, guard and blade.
- Organic and energy shapes (flames, wind ribbons, crystals, smoke): tapered forms, intentional negative space, large shapes plus a few small accents, controlled asymmetry instead of perfect rings, no obvious default primitives.
- Check front, side, three-quarter, silhouette-only, normal-shaded and actual in-game scale. If it only works from one dramatic angle, revise.

**Materials**
- One coherent material system: base colour, roughness, metalness where appropriate, texture scale, edge definition, wear placement and contrast with the environment.
- Metal is not grey plastic with high metalness; energy is not maximum neon; stone needs controlled variation and readable facets; dark materials keep enough value separation to show shape.
- Use atlases and shared materials for Roblox. Anything procedural must be bakeable to a real texture; never rely on Blender-only shaders for in-game looks.

**Implementation note per effect or asset:** trigger, attachment point, forward direction, duration, scale, required textures and meshes, the Roblox implementation (static mesh, flipbook, trail or beam, emitter, tweened mesh, animation-driven), whether it follows the character, weapon or world, whether it is cosmetic or tied to a gameplay event, cleanup, and performance risks.

**Roblox rules:** modest mesh complexity, limited simultaneous particles, never hundreds of parts for one small effect, shared textures, pooling for frequent effects, no endless emitters, few dynamic lights. Effects are triggered by validated gameplay events; hits are confirmed on the server, and clients render visuals for responsiveness.

**Process:** inspect what exists, plan (silhouette, motion, palette, timing, target), build, actually preview it, inspect for clipping, orientation, flicker and density, refine real problems only, optimise, and report what was really created and tested. Prove one complete vertical slice in the real game (model, material, animation, effect, import) before scaling to a whole set.
