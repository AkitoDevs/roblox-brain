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

**Text fitting (all lines Unverified tip: outside reading, not tested by us).**
- **Unverified tip:** `TextBounds` is reported in drawn screen pixels, not layout units. Under a UIScale, divide it by the active scale before comparing it with Position and Size offsets, or text measures too small below scale 1, too large above it, and overlaps on small phones are missed. Calibrate by comparing an auto-sized label's AbsoluteSize with its TextBounds at two scales.
- **Unverified tip:** TextService measurements can understate width on phones: small scaled text with a stroke draws wider than measured. Fit from the label's real TextBounds one frame after layout, shrinking `TextSize` until they fit AbsoluteSize, with wrapping off so a long word is not cut. Use one size across a row so names stay even.
- **Unverified tip:** a text-fit pass can succeed while labels still draw near 8 px, so also check drawn TextBounds against a minimum. Give short screens a separate compact layout (taller bars, shorter labels).
