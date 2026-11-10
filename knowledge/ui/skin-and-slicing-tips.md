---
title: Panel skin, button text and slicing tips (unverified)
topic: ui/skin-and-slicing-tips
scope: generic
source: community-lesson
tags: ui 9-slice imagecolor3 gloss textbutton skin zindex imagerectoffset cap tiled header pattern
---
# Panel skin, button text and slicing tips

Every line here is **Unverified tip:** material from outside reading, not tested by us.

- **Unverified tip:** `ImageColor3` multiplies the whole image, so tinting a glossy white 9-slice panel also tints its white highlight and the shine vanishes on saturated colours. Use pre-coloured glossy panels for saturated colours (pick the closest hue) and tint the white panel only for greys and pastels.
- **Unverified tip:** the text of a TextButton draws underneath any child image used as its skin. Set the button's `TextTransparency` to 1, draw the text with a child label at a higher `ZIndex` than the skin, and mirror the button's `Text` to it with `GetPropertyChangedSignal`.
- **Unverified tip (low priority):** 9-slice on an uploaded image with transparent padding may draw only the top part of the art, and uploads can be stored downscaled, so offsets measured on the source file can be wrong. Instead build the piece from three stretched image labels (left cap, middle, right cap), each cropped with an image rectangle measured at the stored resolution, with the middle overlapping by 1 px to hide seams. Derive cap widths from height over width so they hold at any scale.
- **Unverified tip (low priority):** a header with a repeating pattern (checks, stripes) distorts when stretched and plain 9-slice cannot keep its cells square. Measure a seamless repeat, then build the header from a left cap, as many repeat copies as fit, and a right cap, with the body and bottom rows as separate pieces.
