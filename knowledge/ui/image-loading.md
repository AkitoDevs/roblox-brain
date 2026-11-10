---
title: Image loading and preloading tips (unverified)
topic: ui/image-loading
scope: generic
source: community-lesson
tags: ui image imagelabel isloaded transparency fade preload contentprovider preloadasync fetch status icons
---
# Image loading and preloading tips

Every line here is **Unverified tip:** material from outside reading, not tested by us.

- **Unverified tip:** an ImageLabel that is fully transparent (`ImageTransparency = 1`) may never report `IsLoaded = true`, so a "wait until loaded, then fade in" routine hangs. Start the fade at a value just under 1 (such as 0.99), or rely on the preload status instead of `IsLoaded`.
- **Unverified tip:** passing bare asset-id strings to the content preloader can report failures and may even reset images that are already on screen back to loading. Preload through instances instead (an ImageLabel showing each id).
- **Unverified tip:** do not trust the preload loop merely finishing. Check each id's fetch status afterwards, and retry or log the ones that failed, or those icons pop in late when a menu opens.
- **Unverified tip:** keep frequently shown icons drawn somewhere at a tiny size so they stay ready.
