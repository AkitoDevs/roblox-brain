---
title: Playtest and module testing tips (unverified)
topic: studio/playtest-module-tips
scope: generic
source: community-lesson
tags: studio testing renderstepped heartbeat step function module cache require clone temporary script connection viewport safe root device emulation
---
# Playtest and module testing tips

Every line here is labelled **Unverified tip:** because it comes from outside reading and has not been tested by us.

- **Unverified tip:** when Studio is not rendering (display asleep, window hidden), `RenderStepped` never fires and screenshots time out, while `Heartbeat` keeps running. Keep the simulation in a plain step function that takes `dt`, separate from the event connection, and call it by hand at several fixed frame rates. Assert on peak values, settling and cleanup.
- **Unverified tip:** in Edit mode, requiring a ModuleScript again after editing its source can return the old cached result, so a check silently runs on outdated code. Clone the module, parent the clone beside the original so its relative requires work, require the clone, then destroy it. Print a value only the new code has to confirm.
- **Unverified tip:** event connections belong to the script whose thread made them, even inside a required module. A ProximityPrompt built from a temporary test script can show and fire on the client yet never run its server handler once that script is destroyed. Keep the test script alive until the test ends, or let the game's own script build the object.
- **Unverified tip:** automated playtests use one fixed viewport, so other devices cannot be checked directly. Put each ScreenGui's content under a single safe-root Frame, drive layout from its `AbsoluteSize`, and during the test resize that frame to a fixed offset size (such as 844x390 or 390x720) to emulate a phone or tablet. Target buttons by instance path, not by screen coordinates, which land offset from the visible GUI.
