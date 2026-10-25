---
title: UI construction: shadows, slots, borders and hygiene
topic: ui/construction-shadows-slots
scope: generic
source: maintainer-skill
tags: ui header glint button pressable glossy gradient richtext stroke metallic text shadow scroll fade canvasgroup slot rarity border 9-slice pixel
---
# UI construction: shadows, slots, borders and hygiene

- **Soft outer shadow without a 9-slice:** four edge frames whose gradient fades outward plus four corner images, under the panel. Or a hard dark backing frame offset a few px.
- **Scroll fade:** a frame in the panel colour with a vertical transparency gradient over the bottom of a scroll area, so items fade instead of being cut.
- **Whole-window fades:** make the window root a CanvasGroup and tween GroupTransparency. CanvasGroups re-render to a texture, so use them for a few big windows, not every row.
- **Item slot:** a 9-slice frame (ScaleType Slice with SliceCenter), icon or viewport inside, amount top-left, level label, a star row with negative list padding so stars overlap, a faint rarity pattern, a white stroke when selected.
- **Rarity border:** a UIStroke with a UIGradient; rotate the gradient over time for a mythic shimmer.
- **Corner brackets:** four small L-shapes at the corners of the selected element, animated in from slightly outside.
- **Patterns:** a tiled ImageLabel at 0.8 to 0.95 transparency over the fill, masked by a UIGradient so it reads as texture, not noise.
- **Pixel art:** ResampleMode Pixelated, integer SliceScale, sizes at whole multiples of the art, no rotation or fractional positions.
- **Ornate frames** (torn paper, metal, crystal) as 9-slice images so corners never stretch.
- **Hygiene:** mirror the static HUD in StarterGui so Studio matches the game, build heavy panels lazily and reuse them, one loop for decorative motion paused when hidden, pool toasts and fly-up icons.
