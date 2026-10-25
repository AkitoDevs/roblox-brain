---
title: Simulator UI: icons, fonts, studs and comparison
topic: ui/simulator-icons-fonts-studs
scope: generic
source: maintainer-skill
tags: ui simulator recreation reference screenshot measure pixel grid font matching studs bevel button compare iterate icons
---
# Simulator UI: icons, fonts, studs and comparison

**3. Icons, never emoji.** Use a consistent icon pack in the style (outlined variants suit simulator UI), pick by looking at contact sheets rather than filenames, and preload images before capturing or they render blank. If nothing matches, render new icons in the same style (a three-band toon ramp with an inverted-hull outline, transparent 256 px PNG).

**4. Match the font, don't guess.** Zoom into the reference's text, render 20 to 30 candidate fonts in Studio over the reference background, and compare letter shapes (a, R, S) and width. Then measure the reference's text widths and size each label to match instead of one global size.

**5. Real studs, not dots.** Simulator surfaces have raised studs: a tiled stud ImageLabel (highlight on the top-left rim, shadow bottom-right, so it tints any colour) behind each surface's content with a matching corner radius. Transparency about 0.38 on coloured surfaces and 0.45 to 0.55 on dark ones.

**6. Compare and iterate, one fix at a time.** After every pass, capture and stack the reference over the capture on the same grid, check close-ups side by side, fix only the biggest visible mismatch, and re-compare. An order that worked: icons, font, studs, text sizes, colour saturation, icon variants, oversized elements. Keep the build as re-runnable scripts, and remember an edit-mode still is not a play test.
