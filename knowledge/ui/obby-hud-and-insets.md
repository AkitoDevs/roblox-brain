---
title: Obby HUD, safe areas and thumb corners
topic: ui/obby-hud-and-insets
scope: generic
source: maintainer-skill
tags: hud obby safe area inset topbar resetonspawn touch target mobile accessibility device simulator stage counter
---
# Obby HUD, safe areas and thumb corners

- **Minimum HUD:** a stage counter (12/150 or a percent), the zone name, an optional timer and skip/shop. Keep the counter small, top-centre, anchored at its centre so growing digits do not drift. Death counters are optional; show tries as a positive stat at zone end.
- **Survive death.** A ScreenGui resets on every respawn unless it is a direct child of the starter GUI container with reset-on-spawn off (inside a folder it still resets). In an obby that restarts the HUD and its tweens every death. Put constantly animated pieces (timer, spinner) in their own small ScreenGui and disable hidden menus.
- **Thumb corners.** Default mobile controls sit bottom-left (thumbstick) and bottom-right (jump). Keep buttons and information out of both. Reach also differs by device: a button 40 percent down is easy on a phone and hard on a tablet.
- **Safe areas.** Keep the default screen insets. Only full-screen decoration should ignore them. Read the top bar from the top-bar inset or the inset-area API, never hard-code its height, and never loop waiting for a non-zero inset (it is zero on the first frame in Studio and on some consoles). Run one layout function at start and on the GuiService change signals.
- **Targets and text.** Roblox states no minimum touch size; use 48 px or more (56 for kids) with a larger invisible hit area on small icons. Text minimum 14 for kid UI.
- **Preferences.** Honour the player's preferred text size, preferred transparency and reduced-motion settings.
- **Tweens.** One tween per property per element; cancel before replaying a toast. Animate stroke transparency, not thickness.
- **Testing.** Use device-simulator profiles (entry phone, notched flagship, tablet), but verify notches and memory on a real phone because the simulator emulates neither. A handful of HUD elements needs no UI framework.
