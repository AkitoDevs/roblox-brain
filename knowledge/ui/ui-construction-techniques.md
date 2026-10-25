---
title: UI construction techniques for headers, buttons and slots
topic: ui/construction
scope: generic
source: maintainer-skill
tags: ui header glint button pressable glossy gradient richtext stroke metallic text shadow scroll fade canvasgroup slot rarity border 9-slice pixel
---
# UI construction techniques for headers, buttons and slots

- **Header bar:** Frame with a two-tone UIGradient of the window colour plus two or three thin white frames rotated about -30 degrees at 0.75 to 0.85 transparency, clipped inside, as glints. Sweep one across every few seconds.
- **Painted header art:** for anime or event headers, paint the banner as one image with an aspect constraint overlapping the panel's top-left; keep the title as live text only when it must change.
- **White textures, tinted:** draw frames, slots and glows in white or greyscale and colour them with ImageColor3 or a UIGradient, so one image serves every colour and state.
- **Pressable 3D button:** two stacked rounded frames, the lower one darker and offset 3 to 4 px down (or a face frame at about 92% height over a full-size darker lip). On press, move the face down 2 px and scale to 0.96.
- **Glossy button:** a vertical gradient from lighter top to deeper bottom, a border stroke in a darker shade of the same hue, label stroke darker still, and a tinted glow sprite behind (about 2.3x the button, 0.4 transparency). A diagonal gloss image or a faint stripe pattern adds depth.
- **Overlay that survives recolouring:** one child frame under the labels with a vertical gradient (white sheen fading by the middle, a dark band at the bottom as a lip) keeps the bevel right when scripts change the button colour.
- **Tinted outlines:** on coloured buttons, stroke text and borders with a dark shade of the fill hue rather than black.
- **RichText outlines:** a stroke tag with miter joins gives each label its own sharp outline without a UIStroke (thickness about 7 for titles, 4 to 5 for labels, 2 to 3 for small text).
- **Metallic and gradient text:** a vertical UIGradient on a TextLabel colours the glyphs (silver, gold, purple ramps).
