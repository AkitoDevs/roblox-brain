---
title: Cutscene and camera ownership tips (unverified)
topic: animation/cutscene-camera-tips
scope: generic
source: community-lesson
tags: camera cutscene ownership handback cleanup run token cut fov position occlusion probe shot size lens
---
# Cutscene and camera ownership tips

Every line here is labelled **Unverified tip:** because it comes from outside reading and has not been tested by us.

- **Unverified tip:** give every cutscene run a token (a counter) and have every callback check it before acting. A late tween or timer from a cancelled run then does nothing instead of fighting the next run.
- **Unverified tip:** write cleanup so it can run twice safely, and always restore a saved snapshot of the camera type, field of view, subject and lighting at the end, including when the scene is cancelled or the player dies.
- **Unverified tip:** only one system should write to the camera at a time. Decide the order of writers (gameplay camera, then combat, then cutscene) and have a cutscene take a lease and give it back.
- **Unverified tip:** never interpolate the camera across a cut; place the new shot, then blend, otherwise the cut reads as a slide.
- **Unverified tip:** when matching two shots, match the camera position first and field of view second; changing both at once hides which one is wrong.
- **Unverified tip:** to check a subject is visible, test several points on it (corners and centre, around nine) with casts toward the camera instead of one centre ray.
- **Unverified tip:** keep a small table of shot sizes (close, medium, wide) with the lens and distance you chose for each, and mark any value you haven't judged in motion as untested.

Tested field-of-view limits are in the measured engine behaviours entry.
