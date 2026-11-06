---
title: Modular kits and hero-first workflow for repeated sets
topic: building/kit-and-hero-first-workflow
scope: generic
source: maintainer-skill
tags: modular kit hero prop trim sheet pivot snap grid batch variation texture mesh budget obby
---
# Modular kits and hero-first workflow for repeated sets

A course repeats the same pieces dozens of times, so one bad piece ships dozens of times and one fixed piece fixes all of them.

**Order of work**
1. Reference board (open and actually look at every image), then a style sheet with 3 to 4 colour roles, material notes and a "right vs wrong" panel.
2. Blockout, then ONE hero prop taken through the whole pipeline (model, upload, place, screenshot). The project lead approves it before any batch is generated.

**Kit rules**
- One base unit for every zone (4 studs is a good start) so zones can meet; move snap equals the base, rotate snap 45 degrees.
- One pivot convention (centred on the ground plane unless the piece hinges); short consistent names with a numeric suffix for variants, such as `Candy_Plat_2x2_01`; one mesh id per piece.
- Offer S, M and L sizes instead of stretching one piece. One logic quirk per kit.
- Stress test in a scratch place: loop pieces back to check for drift, stack them to catch z-fighting, rotate 90 degrees to check pivots. Fix the piece, never add patch pieces.

**Variety without new assets**
- Swap material variants or the surface colour per stage, add random yaw and a 5 to 10 percent tint, group props in threes, and give each 5 to 10 stages one hero set piece.

**Textures and budgets**
- One near-white trim sheet tinted per object; keep it at 512 or below (256 for small props). A mesh has one material, so split by colour. Avoid scattered decals: they break batching.
- Keep meshes watertight and under 20,000 triangles; a union above that is silently simplified.
- Turn shadows off on small and distant parts, never animate size during play, and stream set pieces as atomic models.
