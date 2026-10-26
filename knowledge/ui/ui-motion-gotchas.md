---
title: UI motion gotchas (anchors, layouts, interrupted tweens, reduced motion)
topic: ui/motion-gotchas
scope: generic
source: maintainer-skill
tags: ui motion tween uiscale anchorpoint uilistlayout uigridlayout position size completed cancelled playbackstate reduced motion guiservice accessibility
---
# UI motion gotchas

Engine behaviours to check before judging how a UI animation feels.

**UIScale grows from the AnchorPoint.** On a top-left-anchored button, a hover or pop tween grows only right and down. This was tested. Set AnchorPoint to 0.5, 0.5 (and adjust Position to match) before tuning a hover, or the "feel" being judged is really an off-centre grow.

**A layout owns Position.** Children of a UIListLayout or UIGridLayout have their Position rewritten every layout pass, so a Position tween on them does nothing visible. Don't tween Size there either: it reflows the neighbours. Tween a UIScale or Rotation, or move an inner frame inside a fixed-size holder.

**The newest tween wins.** Starting a new tween on the same property cancels the old one, and the old one's Completed fires with a Cancelled state. Any "then hide it" or "then destroy it" step on Completed has to check that the state is Completed, or a quick re-open is hidden by the old close.

**Reduced Motion.** Read GuiService.ReducedMotionEnabled before any slide, pop, shake or looping decoration. When it's on, use a short fade or an instant change instead, and keep the information (colour, text, icon) the same. Listen for it changing rather than reading it once.

Status words still apply: a tween that ran is Executed; how it feels is judged in Play by the person you're building for.
