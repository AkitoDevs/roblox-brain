---
title: No blurry UI images
topic: ui/sharp-images
scope: generic
source: maintainer-skill
tags: ui blurry image resolution upscale icon uiscale cap 1024 tiles backdrop splatter sharp raster vector imagelabel
---
# No blurry UI images

A raster image drawn larger than its source resolution goes soft. Treat that as a defect, not a style.

- **Audit every build.** For each ImageLabel, compute the drawn pixel size (design size × UIScale) at 1080p and 1440p and compare it with the source size (icon packs are often 256 px; Roblox uploads max out at 1024 px per side). Flag anything drawn bigger than its source.
- **Cap the UI scale.** Use min(viewport width / W, viewport height / H, 1.5) so large screens show the UI at its 1080p pixel size instead of upscaling the icons. The same cap belongs in any refit script.
- **Size icons to the source at that cap:** a 256 px icon displays at most about 170 design units (170 × 1.5 = 255 px).
- **Default: no decorative backdrop behind panels.** A clean panel over the game world is usually enough. Stretched splatter PNGs look blurry, splats built from frames look "bland and bubbly", and painted ones easily pick up artefacts or run off screen. Only add a backdrop when asked, and keep it subtle and fully on screen.
- **If a large organic backdrop is wanted** (ink splatters, splashes, auras, torn edges), paint it at its exact on-screen pixel size, cut it into tiles under 1024 px with a 2 px overlap so no seam shows, and place each tile at its design size so it draws at 1:1 or smaller. Never stretch a small PNG across a panel.
- **What makes painted ink look rich:** a warped edge with smooth lobes so the band swells and thins, sharp tapered spikes in the corner bursts, a rough micro-edge and drips on the bottom only, a gradient rim with a soft offset shadow and a thin inner highlight, droplets with thin rims (thick rims look like targets), and enough padding that rims and shadows aren't cut off square. Preview the image over a greyed panel area before uploading.
- **Vector UI** (frames with full-round corners) is only for simple geometric shapes: pills, rings, dots, bars. It can't make sharp tapered spikes, so organic art built that way looks bubbly.
- **Generated images:** render at 1024 px with hard, 1 px anti-aliased edges rather than soft gradients that look out of focus.
- **Check icon colour against its tile:** an icon that clashes with its rarity tile colour looks wrong even when sharp.
