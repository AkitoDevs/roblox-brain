---
title: Panel controller tips (unverified)
topic: ui/panel-controller-tips
scope: generic
source: community-lesson
tags: ui simulator panel open close blur blureffect hud hide stall proximityprompt demo data adapter product id gradient tint uigridlayout automaticcanvassize scrollingframe
---
# Panel controller tips

Every line here is labelled **Unverified tip:** because it comes from reading a measured simulator UI brief, not from our own test. Build one panel and one notification stack, watch them in Play, then promote or drop each line.

**Panels**
- **Unverified tip:** while any panel is open, hide the HUD clutter (top buttons, stats, side offers, quest bar, settings) but keep the bottom icons and hotbar, and set an attribute such as `PanelOpen` on the HUD so other scripts can react.
- **Unverified tip:** a camera BlurEffect tweened to Size 14 over about 0.2 s while a panel is open (and back to 0 when the last one closes) separates the panel from the world without hiding it.
- **Unverified tip:** rebuild a panel's list every time it opens (an `onOpened(name, callback)` hook), instead of keeping it in sync all the time.
- **Unverified tip:** for shop stalls in the world, standing inside a floor ring opens the stall's panel and stepping out closes it, but only if the ring opened it. Polling every 0.2 s is enough. Stalls without a ring can use a ProximityPrompt with HoldDuration 0.

**Data and art**
- **Unverified tip:** drive every number and list in the UI through one data adapter module that runs on clearly marked demo data until the real systems exist. The UI then works and can be reviewed before any server code, and the real data plugs into one place later.
- **Unverified tip:** a purchase button whose product or pass id is not set should show an alert like "Not set up yet" instead of prompting. Never invent ids.
- **Unverified tip:** when generating UI art, make each button, title tab and card base once in white or neutral grey and colour it in Studio with a UIGradient. One base then covers every colour, which cuts the number of paid generations.

**Layout gotcha**
- **Unverified tip:** a UIGridLayout with Scale cell sizes inside a ScrollingFrame that uses AutomaticCanvasSize can fail to settle, so the list stops scrolling part-way. Setting the cells in pixels from the frame's AbsoluteSize, re-applied when the size changes, avoids it.

General simulator motion and one-panel rules are in the simulator motion and architecture notes.

Notification stacking and pop-up timing tips are in the notification stack notes; general one-panel and motion rules are in the simulator motion and architecture notes.
