---
title: Recreating simulator UI one-to-one
topic: ui/simulator-recreation
scope: generic
source: maintainer-skill
tags: ui simulator recreation reference screenshot measure pixel grid font matching studs bevel button compare iterate icons
---
# Recreating simulator UI one-to-one

Simulator players judge UI against professional games. Emoji icons, the wrong font or flat dots instead of studs read as amateur. This loop produced an approved one-to-one remake.

**1. Measure the reference**
- Lay the build out on the screenshot's own pixel grid: a canvas Frame sized to the image, centred, with a UIScale of min(viewport width / W, viewport height / H) and a small LocalScript that refits on viewport changes. Every position then copies straight from the image.
- Sample colours from the image rather than guessing. When sampling through a tool that loads 8-bit images as display values, don't apply an extra sRGB conversion.
- Zoom into every area with crops and actually look at them.

**2. Build the structure**
- Bevelled button or panel: a black outer frame with a corner radius, a darker lip frame inset about 3 px, then a body inset about 3 px and 5 to 6 px shorter, with a vertical gradient (light top, saturated bottom) and a thin light rim stroke. That gives the chunky 3D edge.
- Text: white, heavy font, thick black stroke with round joins, plus a dark copy offset about size/9 px down as a drop shadow. Coloured inline values with RichText font colour.
- Badges: a red circle with a black stroke and a white "!" or number. Currency rows: a dark translucent pill, an icon overlapping the left end, a coloured number and a green "+".
