---
title: Decorative UI from native primitives
topic: ui/native-primitives
scope: generic
source: maintainer-skill
tags: ui uicorner uistroke uigradient path2d sunburst bokeh ring glow shine sprite imagecolor3 card title frame primitives
---
# Decorative UI from native primitives

Most menu decoration needs no custom images.

- **Circle or dot:** Frame plus UICorner(1, 0).
- **Ring:** transparent Frame, UICorner(1, 0), UIStroke 1 to 2 px at 0.6 to 0.8 transparency.
- **Soft bokeh:** three concentric circles at sizes 1.0, 0.66 and 0.33 with transparencies about 0.93, 0.85 and 0.7: a fake radial falloff.
- **Petal or confetti:** small rounded Frame about 22 by 8, rotated, tinted at 0.2 to 0.5 transparency.
- **Vines, arcs, orbits:** Path2D with control-point tangents (thickness 2 to 3, light colour, 0.2 to 0.4 transparency; at most 100 points). Keep most behind the cards.
- **Sunburst:** 12 to 16 long thin Frames anchored at the centre, rotated in even steps, each with a UIGradient fading to transparent along its length; rotate the parent slowly.
- **Light beam:** oversized rotated Frame with a UIGradient transparency of 1, 0.85, 1 across its width.
- **Sparkle:** two crossed thin frames, twinkling with a transparency tween.
- **Diamond terminal:** a square Frame rotated 45 degrees. **Hairline:** a 1 to 2 px Frame with a gradient fading at the outer end.
- **Ribbon tag:** pill Frame rotated about 3 degrees, AnchorPoint (0.5, 0.5) on the card's top edge, ZIndex above the card.
- **Card:** Frame, UICorner around 20 px, BackgroundTransparency about 0.1, UIStroke 2.5 in the light colour, a UIGradient for a faint top sheen, UIPadding 14 to 18, centred UIListLayout.
- **Title:** TextLabel with a FontFace, UIGradient for a vertical sheen, UIStroke about 2.5, and a duplicate label offset 3 px down at 0.6 transparency as the drop shadow.
- **Gradient border:** a UIGradient parented to a UIStroke colours the outline; rotate it slowly for a shimmer.
- **Glyph accents** (diamond, four-point star, heart, star) usually render, but test the font and fall back to frames.

**When you do need images:** draw glows, textures and frames in white or greyscale and tint them with ImageColor3 or a UIGradient, so one upload serves every colour and state. Useful sprites: blurred white pill, circle and inner-glow ring (fade in over 1.5 to 2.5 s when an element turns on), a soft diagonal shine streak swept across active tabs now and then, and pattern overlays (halftone, checker, stripes) at 0.6 to 0.95 transparency, masked so the content area stays calm. A handful of shared textures reused everywhere beats many one-off images.
