---
title: Text glyphs and design-to-Roblox text size tips (unverified)
topic: ui/text-glyphs-and-size
scope: generic
source: community-lesson
tags: ui text glyph emoji dingbat arrow textsize textservice font css em conversion blank box
---
# Text glyphs and design-to-Roblox text size tips

Every line here is **Unverified tip:** material from outside reading, not tested by us.

- **Unverified tip:** some symbols (heavy arrow dingbats) and newer emoji (Unicode 9 and later) draw as blanks or boxes in a TextLabel, leaving gaps in UI text. Older emoji (droplet, cloud, cart, paw prints) and simple glyphs (a right-pointing triangle, a double angle quote as an arrow) draw reliably. Check every symbol in a playtest screenshot before shipping.
- **Unverified tip:** text rebuilt from a web design comes out too small, by a different amount per font. Roblox fits the font's whole line (ascent, descent and line gap) into `TextSize`, whereas a web font size is the em.
- **Unverified tip:** measure each font once with TextService at size 100 (glyph width divided by its advance) to get a conversion factor, then convert design pixels with it per font. `TextSize` truncates to whole numbers, so round.
