---
title: Separating animation foot sink from landing dip (unverified)
topic: animation/r6-measurement-tips
scope: generic
source: community-lesson
tags: animation r6 foot sink landing grounding measurement raycast hip height humanoid play
---
# Measuring foot sink in Play

Every line here is labelled **Unverified tip:** because it comes from outside reading and has not been tested by us.

- **Unverified tip:** when you measure how far feet sink into the floor during live Play, a single number mixes two causes: the pose's own sink and the humanoid's brief dip on landing. A fixed pose can then look broken on hard landings when it is fine.
- **Unverified tip:** every post-physics frame, record the lowest body-part corner twice. First, against the floor found by a downward raycast. Second, against root height minus hip height. The second figure shows the animation alone.
- **Unverified tip:** the difference between the two is the engine's landing dip. Expect it to last a few frames and to grow with landing speed, and do not "fix" the pose for it.
