---
title: Simulator UI panels, pop-ups, stalls and data seam
topic: ui/simulator-panels
scope: generic
source: maintainer-skill
tags: ui simulator panel blur popup stall proximity prompt demo data adapter grid layout scrolling frame gotcha
---
# Simulator UI panels, pop-ups, stalls and data seam

**While a panel is open**
- Hide HUD clutter (top buttons, stats, side offers, quest bar, settings); keep the bottom icons and hotbar.
- Set a `PanelOpen` attribute on the HUD and tween a camera `BlurEffect` to Size 14 over 0.2 s. Tween it back to 0 when the last panel closes. This sits on top of the one-panel-at-a-time rule.

**Pop-ups**
- Small and money pop-ups grow in 0.18 s with Back Out, then rise and fade. Start the fade at 65% of their lifetime.
- A splash pops in over 0.45 s while a glow spins and grows behind it, then exits by scaling to 1.15 and fading over 0.35 s.

**World stalls**
- Standing inside a stall's floor ring opens its panel. Leaving closes it only if the ring opened it. Poll every 0.2 s and accept up to 8 studs of height above the ring.
- A stall without a ring gets a ProximityPrompt (HoldDuration 0, range 12).

**Data seam**
- Feed every number and list through one adapter module that runs on clearly marked demo data, so real systems can be plugged in later without touching the UI.
- A purchase button with no real product id in config should show a "Not set up yet" alert. Never invent ids.

**Gotcha: scrolling grids.** A `UIGridLayout` with Scale cell sizes inside a ScrollingFrame using `AutomaticCanvasSize` never settles and stops scrolling part-way. Compute pixel cell sizes from the list's `AbsoluteSize` and apply them again on resize.
