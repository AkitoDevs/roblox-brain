---
title: Hide-all-UI toggle tips (unverified)
topic: ui/hide-hud-toggle
scope: generic
source: community-lesson
tags: ui hud hide toggle screengui enabled visible always-on uiscale prompts popups
---
# Hide-all-UI toggle tips

Every line here is **Unverified tip:** material from outside reading, not tested by us.

- **Unverified tip:** switch the whole interface off with `ScreenGui.Enabled = false` rather than setting `Visible` on each child. HUD update loops that keep writing `Visible` on individual elements will quietly undo a per-child hide.
- **Unverified tip:** controls that must survive the toggle (the button that brings the UI back, essential gameplay controls) belong in a separate always-on ScreenGui. Give it the same UIScale value as the main one so sizes match.
- **Unverified tip:** do not hide a layer that holds gameplay prompts the player must answer. Leave that layer enabled and suppress only its optional pop-ups with a flag the pop-up code checks before showing.
