---
title: Strokes, corners and text that scale with the UI
topic: ui/responsive-kit
scope: generic
source: maintainer-skill
tags: ui responsive uistroke scaledsize strokesizingmode textscaled uitextsizeconstraint uicorner scale aspect ratio phone tablet
---
# Strokes, corners and text that scale with the UI

A UI that scales correctly with no script needs more than Scale sizes: strokes, corners and text must scale too, or they turn hairline on phones and chunky on monitors.

- **Size and position in Scale,** and lock shapes with UIAspectRatioConstraint. Polished kits put one on nearly every element, including text boxes (aspect around 4).
- **UIStroke with StrokeSizingMode = ScaledSize.** Thickness becomes a fraction of the element's size, so outlines grow and shrink with it. Starting values: text labels 0.05 to 0.15, button borders 0.03 to 0.05, large panels 0.008 to 0.02. The default mode (FixedSize) is pixels.
- **Border placement:** UIStroke.BorderStrokePosition (Outer, Center, Inner) and BorderOffset place the border. Inner keeps tightly packed tiles from overlapping.
- **TextScaled on every label plus UITextSizeConstraint** so MaxTextSize caps it on big screens; LineHeight about 1.2.
- **UICorner in Scale** (0.1 to 0.3 for tiles and buttons; 0.5 for pills and circles) so rounding stays proportional. Per-corner radii make tabs and asymmetric chips.
- **One UIScale per screen** computed from the viewport size is an alternative for whole windows.
- **Check at phone, tablet and desktop sizes.** Strokes must stay visible (at least about 1.5 px) on the smallest screen, nothing overlaps, and text never drops below a readable size.
