---
title: Lighting a scene with intent
topic: lighting/principles
scope: generic
source: maintainer-skill
tags: lighting key fill rim mood grading value atmosphere colorcorrection bloom scene
---
# Lighting a scene with intent

Flat, even light is the most common reason a Roblox scene looks cheap. Decide the light before tuning numbers.

- **One key light, chosen on purpose.** Pick where the main light comes from (sun, window, lamp, magic) and its colour. Fill (Ambient, OutdoorAmbient) is dimmer and usually the opposite temperature. Add rim light to separate characters and props from the background.
- **Plan values, not only colours.** The gameplay focus, signs, NPCs and the path are brightest; corners, ceilings and backgrounds fall darker.
- **Light shapes are composition.** Window pools, spot pools and rim highlights lead the eye, so put them on paths and focal points.
- **Limited palette plus one grade.** One hue family plus one accent. Grade with a single ColorCorrection: several of them multiply, so keep one and tween it.
- **Every visible source lights something.** A lamp gets a light, a window gets rays and a floor pool, an emissive panel gets a SurfaceLight, a glowing orb gets a coloured PointLight that paints the floor.
- **Depth through air.** Atmosphere haze fades distance toward the sky colour; dark foreground silhouettes against a bright background read as deep.
- **Consistency.** Every shaft, pool and shadow follows one sun direction (Lighting:GetSunDirection()), and sunlight only enters openings that face the sun.
- **Never compete with gameplay.** Before adding a centrepiece, shaft or glow near a play area, check it from the real gameplay camera (its CFrame and FieldOfView). Keep it out of the play space and above the view's top edge.
- **Make Studio show the real look.** If a client settings script rewrites Bloom, ColorCorrection or shadows at runtime (a graphics slider), set the place's edit-time values to the runtime high preset, or every edit-mode screenshot lies.
- **Zones on the client.** Tween Lighting and Atmosphere when the camera enters a zone and restore the stored values on exit. Check the camera position a few times per second, not every frame.
- **Find the system before you rename.** Scripts that recolour lights often select parts by Material and Name, so changing Neon to SmoothPlastic can silently disconnect them. Extend that system to new pieces instead.
