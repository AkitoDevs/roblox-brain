---
title: UI motion with TweenService
topic: ui/motion
scope: generic
source: maintainer-skill
tags: ui motion tween tweenservice easing duration popup panel button press hover stagger uiscale canvasgroup animation
---
# UI motion with TweenService

**Should it animate at all?** Decide by how often the player sees it.
- Constantly (hotkey menus, inventory spam): no motion, or a fade of 0.1 s or less.
- Often (buttons, tabs, hovers): quick and subtle, 0.08 to 0.15 s, a small scale change.
- Sometimes (shops, settings, popups): a standard open and close.
- Rarely (big reward, egg hatch, first-time moments): celebrate.

**Easing.** Appearing, reacting or settling: Quint or Exponential, Out (the default). Moving across the screen (tab underline, sliding panel): Quint or Cubic, InOut. Colour and hover changes: Sine Out. Constant motion (spinners, rotating sunburst): Linear. Back Out only for celebrations. Never In on UI, and never Bounce or Elastic on everyday UI.

**Duration.** Press 0.08 to 0.15 s, small popup 0.15 to 0.25 s, main panel 0.2 to 0.3 s, celebration 0.3 to 0.6 s. Everyday UI stays under 0.3 s.

**Enter, exit, interrupt**
- Never grow from nothing: tween a UIScale from 0.95 to 1 together with a CanvasGroup's GroupTransparency from 1 to 0. Fading only the root's background leaves its children showing.
- Exit the way it entered, faster: about 0.15 s to a scale of 0.97 while fading, then Visible = false on Completed.
- Always tween from the current value so a quick re-press continues smoothly.
- Stagger lists by 0.03 to 0.08 s per item.
- Use UIScale rather than Size on frames with children so nothing reflows. Scaling an item inside a UIListLayout or UIGridLayout moves its neighbours: scale an inner frame inside a fixed-size holder.
- Cache each element's original Size and Position the first time you animate it and always tween relative to them, so repeated hovers never drift.

**One preset module.** Keep every screen's motion in one ModuleScript with named TweenInfos (open, close, press, release, slide, hover, celebrate) plus open and close helpers. Never copy tween code into each button.

**Ambient decoration** (drifting particles, rotating rays) runs in one client loop that pauses while the menu is hidden; start motion when a window opens and stop it when it closes.

A playful simulator style may justify some bounce on popups; that is a style decision, not the default. Judge motion by playing it, not by the numbers.
