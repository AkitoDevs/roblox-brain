---
title: Lighting and structuring cozy interiors
topic: building/cozy-interiors-lighting
scope: generic
source: maintainer-skill
tags: interior cozy house home bedroom kitchen hallway roleplay hangout story props window light color grade camera rooms
---
# Lighting and structuring cozy interiors

**Lighting and grading**
- Future lighting gives real sun shadows through window frames (set in Studio, not by script). Keep the sun low (about 20 to 35 degrees) and aimed through the main windows so pools land on beds, rugs and tables.
- Dark, slightly warm ambient; environment diffuse and specular around 0.5 to 1 with a Sky so PBR wood and tile catch light.
- Lamps get a warm PointLight (Range 8 to 14, mostly Shadows off); glowing props get a small coloured light that touches the wall.
- Dust motes in sunbeams (rate 2 to 4, slow, long-lived). Soft beam shafts through the windows.
- ColorCorrection slightly warm-green, Contrast +0.1 to +0.2, Saturation -0.05 to -0.15; Bloom threshold high so only windows and lamps glow.
- A very bright backdrop outside the windows so they stay the brightest thing in the room.

**Materials:** textured fabric patterns (flat colours look plastic), PBR wood, panelled walls; slightly worn shapes (a sagging pillow, a crooked frame).

**Structure:** rooms as separate cells joined by door prompts that teleport the player, so each cell can be tiny and densely dressed and only one needs streaming and lighting at a time. Window views can be painted backdrops. Hide small interactive surprises on tiny props to reward exploring.

**Camera:** tight rooms and sloped ceilings trap the default camera. Lower the maximum zoom indoors, use Invisicam occlusion, and keep walkable areas away from the low side of sloped ceilings.
