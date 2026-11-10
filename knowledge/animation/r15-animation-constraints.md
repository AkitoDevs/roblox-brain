---
title: Scripted poses on rigs using animation constraints (unverified)
topic: animation/r15-animation-constraints
scope: generic
source: community-lesson
tags: animation r15 animationconstraint motor6d transform tween preSimulation pose avatar
---
# Scripted poses on rigs using animation constraints

Every line here is labelled **Unverified tip:** because it comes from a single outside report, is rig-dependent, and has not been tested by us. Test it in Studio on your own avatar first.

- **Unverified tip:** on some current R15 avatars the joints are animation constraints rather than motors, and tweening a joint offset then silently shows nothing.
- **Unverified tip:** if that happens, write each joint's transform every frame right after the animator runs (the pre-simulation step), find joints by the part they move rather than by name, and stop the avatar's own animations while your scripted one plays.
