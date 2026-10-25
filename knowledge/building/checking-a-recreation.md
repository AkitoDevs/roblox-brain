---
title: Checking a reference recreation
topic: building/checking-a-recreation
scope: generic
source: maintainer-skill
tags: reference recreation perspective vanishing point camera solve focal length blockout landmarks crop fieldofview lens shift photo scene
---
# Checking a reference recreation

**Check the blockout, numerically and by eye**
- Reprojected landmarks should land within a few percent of the image width, and every primary volume's edges must sit on the reference edges in an overlay, including volumes with no landmark.
- Give the foreground (the bottom third of the frame) at least three landmarks: a check only covers what you give it, and far landmarks alone have passed while the near field was wrong.
- A failing landmark may be a misread: re-zoom before changing geometry.
- The numbers are a sanity check, not the goal.

**Then model crop by crop:** one railing run, one window bay at a time, each compared as reference, before and after through the locked camera. Before deleting a shape that looks wrong, back-project it: it may be a real element in the wrong form. Never project the photo onto geometry that doesn't coincide with it, and match colour only on large surfaces, sampling small accents by hand.

**Studio camera:** Studio's FieldOfView is vertical, so convert with vertical FOV = 2 × atan(sensor height / (2 × focal length)) at the render aspect. Studio has no lens shift: a shifted camera becomes a pitched one, and the verticals converge differently.
