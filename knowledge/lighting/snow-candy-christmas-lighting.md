---
title: Lighting snow, candy and Christmas scenes
topic: lighting/snow-candy-christmas-lighting
scope: generic
source: maintainer-skill
tags: lighting snow candy christmas atmosphere haze sky bloom warm cool shadow ice material lighting style
---
# Lighting snow, candy and Christmas scenes

- **Warm key, cool shadow.** Use a warm ColorShift_Top and a cool lavender ColorShift_Bottom and OutdoorAmbient, plus one warm source per zone (lamp, window, candle) against the cool ambient. Dark moody blue reads horror; keep festive values bright.
- **Snow is a neutral canvas that light tints.** Use a lavender-blue base, never pure white, with darker hollows. Raise the Bloom threshold so only fairy lights glow. A Retro tone mapper mutes whites, so check it first.
- **Atmosphere order.** Set Density and Offset first, then Haze and Color. Glare only shows when Haze is above 0 and Decay needs both. A high Offset keeps a horizon silhouette in bounded maps. Heavy haze flattens the middle ground, so keep it low where colour carries the scene (candy).
- **If Atmosphere does nothing,** confirm a Sky with all six faces exists in Lighting, that no second Atmosphere or fog value fights it (fog start and end are hidden once an Atmosphere exists), and then balance Density against Offset. Judge by screenshot, not by property values.
- **Cost.** Shadowed lights are the most expensive: a narrow spot is cheaper than a surface light, which is cheaper than a point light. Use unshadowed lights or emissive meshes for string-light bulbs. The best lighting mode falls back to shadow maps and then voxel lighting on weak devices, so the look must survive voxel lighting; test at several graphics levels and on a real phone.
- **The old technology property is deprecated and read-only.** It is replaced by a lighting style (realistic or soft) plus a quality-priority flag; compare those two by screenshot on one stage instead of the retired compatibility mode.
- **Materials.** The ice material is slippery by default (friction 0.02), so keep it off normal floors. Glass refraction does not work on mobile. Candy looks best as coloured smooth plastic with one thin highlight stripe.
