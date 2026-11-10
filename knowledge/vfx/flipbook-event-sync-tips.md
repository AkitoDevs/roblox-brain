---
title: Flipbook and event sync tips (unverified)
topic: vfx/flipbook-event-sync
scope: generic
source: community-lesson
tags: flipbook loop event sync clock modulo keyframe particle sprite preview size unverified
---
# Flipbook and event sync tips

Labelled **Unverified tip:** one developer's report, low priority, not checked by us.

- **Unverified tip:** a scripted particle event can look disconnected from a looping flipbook if it fires at an arbitrary point in the loop. Drive the flipbook from one clock value.
- **Unverified tip:** compute the delay to the next key frame as (keyTime - clock) modulo the loop length, and schedule the event with that delay so it lands on the drawn moment.
- **Unverified tip:** preview large particle sprites at their real in-game size behind the subject. A contact sheet hides how much of the screen they cover.