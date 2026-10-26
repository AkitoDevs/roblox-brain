---
title: Animation markers, priorities and ownership
topic: animation/markers-priority-ownership
scope: generic
source: maintainer-skill
tags: animation keyframe marker getmarkerreachedsignal stopped ended priority enum action adjustspeed hit window ownership permission live game studio-only
---
# Animation markers, priorities and ownership

These are engine behaviours that cause silent bugs in combat and cutscenes.

**Markers and hit windows**
- Connect a track's marker signals once, when the track is loaded, never on every swing. Stacked connections fire the hit code twice or more.
- Close a hit window on the track's `Stopped` event, which fires as the fade-out starts, not on `Ended`, which fires after the fade. Otherwise an interrupted attack (a stun, a dodge) can leave an invisible damage zone open.
- Keep every window at least 2 to 3 frames long. A Heartbeat-based sampler can skip a window of a single frame (about 0.016 s).
- If the client plays a track with `AdjustSpeed`, scale the server's elapsed-time checks by the same factor.
- Don't run server logic on marker signals from tracks that only replicated to the server. Time server checks from the server's own clock.

**Priorities**
- Use priority, not blend weights, to stop an attack and its hit reaction fighting over the same joints.
- The `AnimationPriority` enum's numeric `Value` is not in ladder order (Core is 1000 and Idle is 0). Never compare priorities with `>=` on `Value`; compare against an explicit list of enum items.

**Ownership**
- In a live game, an animation plays only if the experience's owner (the user or the group) owns it or has been granted access.
- Studio hides this, because it loads your own uploads. "Works" means it played for a non-owner account in a live server. Until that has been checked, call it "Studio-only".
