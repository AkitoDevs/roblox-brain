---
title: Lighting on a budget
topic: lighting/performance
scope: generic
source: maintainer-skill
tags: lighting performance shadows castshadow range particles overdraw mobile lag lights budget
---
# Lighting on a budget

Good lighting does not have to cost frame rate. Most of the look comes from cheap emissive tricks; real lights and shadows are the expensive part.

- **Shadow-casting local lights:** keep about 4 to 6 in any one view. Most lights get Shadows off and a Range of 24 or less.
- **Range is cost.** Light cost grows with what it covers, so trim Range to what is actually lit. Large chandelier or spotlight rigs usually look the same with a noticeably smaller range.
- **Indoors, decor shadows rarely show.** Under a ceiling, the room is already shaded, so small and medium decor shadows cost without being visible. Turn CastShadow off on decor and on anything above head height; keep it on walls, ceiling, columns and statues.
- **Emissive is cheap.** Neon, beams, HDR SurfaceGuis (LightInfluence 0, Brightness above 1) and particles cost far less than real lights. Use them for glow and keep real lights for what must light surfaces.
- **SurfaceGui pools and glass:** PixelsPerStud 8 to 16, MaxDistance set, no more than about a dozen frames each.
- **Overdraw:** avoid big overlapping transparent parts.
- **Particles:** count live particles as rate times lifetime. Keep a whole space at about 1000 or less, and cull or scale by graphics level.
- **Cull on the client.** Far ambient effects should switch off by distance.
- **Before blaming the lighting,** check avatar accessories with VFX: they tint the scene near the camera.
- **Checklist before calling lighting done:** key, fill and rim set; focal points brightest; one grade; every glow lights something and every ray has a pool; no Neon slab blowing out under Bloom; surfaces show relief; gameplay views clear; inside the light, shadow and particle budget.
