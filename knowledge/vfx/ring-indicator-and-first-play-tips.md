---
title: Ground ring indicators and first-play blanks (unverified)
topic: vfx/ring-and-first-play-tips
scope: generic
source: community-lesson
tags: ring adornment cylinder alwaysontop thin height impact frame viewportframe preload first play blank unverified
---
# Ground ring indicators and first-play blanks

Labelled **Unverified tip:** reports from single developers, not checked by us. See vfx/performance for general rules.

- **Unverified tip:** a flat ground ring made from a hollow cylinder handle adornment (inner radius above zero) may not render with AlwaysOnTop on. Keep AlwaysOnTop off for hollow rings; solid discs (inner radius zero) did render with it.
- **Unverified tip:** very thin heights (about 0.05 studs) may fail to render. Use about 0.15 studs or more, and lift the ring slightly above the surface so nearby geometry does not hide it.
- **Unverified tip:** a very short impact frame can come up blank the first time it plays in a session, because meshes in a ViewportFrame and image textures have not loaded yet. Holding the frame longer for a screenshot can hide the problem.
- **Unverified tip:** preload those meshes and images as soon as the moment is known, seconds before the frame fires, and test in a fresh session on first use, not on a repeat.