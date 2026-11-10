---
title: Client rigs when parts arrive late (unverified)
topic: animation/late-replicated-rigs
scope: generic
source: community-lesson
tags: animation client replication streaming motor6d descendantadded cache rest pivot bob joint bone stale
---
# Client rigs when parts arrive late

Every line here is labelled **Unverified tip:** because it comes from outside reading and has not been tested by us.

- **Unverified tip:** a character can show up on the client before its torso and joints do. If you look joints up only once at spawn, the rig stays unposed for its whole life. Listen to `DescendantAdded` on the character and look the joints up again, and re-check that a joint exists and has a parent before writing to it.
- **Unverified tip:** the same applies to a cache of parts, joints and bones built on first sight of a large model. If more descendants arrive afterwards the skin freezes with no error. Watch `DescendantAdded`, mark the cache stale, and rebuild it on the next frame. Ignore attachments and effects your own script adds.
- **Unverified tip:** with content streaming on, parts and joints can be swapped out and back in after your animator first cached them. Cache each joint's rest offset once per joint instance, re-hook the model when new joints arrive, and look up helper parts when you need them rather than storing them at startup.
- **Unverified tip:** capture a model's rest position once per instance and keep it with that instance (for example in a client-side attribute). If a repeating scan re-reads the current pivot as "rest", and that pivot already includes the animation's offset, a bob animation climbs a little further each pass. Comparing the client and server copies shows whether the drift is client-only.
