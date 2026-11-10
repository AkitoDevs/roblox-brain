---
title: Keeping IKControl-driven limbs steady (unverified)
topic: animation/ikcontrol-stability
scope: generic
source: community-lesson
tags: animation ikcontrol inverse kinematics weight pole target jitter destroy fade limb
---
# Keeping IKControl-driven limbs steady

Every line here is labelled **Unverified tip:** because it comes from a single outside report and has not been tested by us. The outcome is unknown, so test it in Studio before relying on it.

- **Unverified tip:** a limb driven by one IKControl may jerk for a single frame when a different IKControl on the same character is destroyed or has its weight reach zero, even if the two chains share no joints.
- **Unverified tip:** do not remove or zero any IK control while other IK-driven motion is visible. Keep helper controls alive at their current weight until the motion settles, then fade them out and remove them together.
- **Unverified tip:** glide a pole target to its new position rather than switching it instantly, and keep poles off the path the hand or foot travels.
