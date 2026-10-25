---
title: Simulator UI motion and architecture
topic: ui/simulator-motion-architecture
scope: generic
source: maintainer-skill
tags: ui simulator item card rarity tabs rewards daily rebirth offer hud popup hover press toggle rainbow border sunburst motion module
---
# Simulator UI motion and architecture

**Motion, all in one module (never a script copied per button)**
- Popup open: UIScale from about 0.85 to 1 with Back Out around 0.2 to 0.3 s; close to about 0.8 in about 0.12 s, then Visible = false. Bounce suits this genre; big windows starting from much smaller (0.7) read as a lurch.
- Hover: scale about 1.06 to 1.1 with a short Out tween and a hover sound. Press: about 0.9 in 0.05 to 0.08 s. Release back with Back Out plus a click sound.
- Toggle: knob position plus bar colour, about 0.2 s Quad Out.
- Rainbow border: a UIGradient inside a UIStroke rotating 0 to 360 over about 2 s, Linear, repeating. Sunburst: image rotation 360 over about 4 s, Linear, repeating.
- Toasts pop from about 0.5, never from 0; money counters count up and bump.
- One panel at a time: track the active window and close it before opening another.

**Working UI architecture:** config ModuleScripts (shop, rebirth, wheel) plus RemoteEvent request and result pairs, with the server deciding money and purchases. If you start from a kit, replace its developer product and game pass ids with your own. Check that the motion script runs in Play (no console errors, values actually changing) before calling it done.
