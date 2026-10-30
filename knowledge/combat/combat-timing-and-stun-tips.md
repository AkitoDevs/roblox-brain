---
title: Combat timing, stun and hit-stop tips (unverified)
topic: combat/combat-timing-and-stun-tips
scope: generic
source: community-lesson
tags: combat stun parry hitstop hit-stop slow motion time scale contact reach damage credit ability data
---
# Combat timing, stun and hit-stop tips

Every line here is labelled **Unverified tip:** because it comes from outside reading and has not been tested in Studio. Treat it as a starting idea and test it before relying on it.

- **Unverified tip:** store stun as an end time (stunned until now plus duration), not a countdown that each system decrements. Any system can then read "is stunned" the same way, and two stuns stack by taking the later end time.
- **Unverified tip:** resolve a hit in one function with a fixed order: validity, then blocked or parried, then damage, then stun, then effects. Several scattered handlers that each check part of this are where double hits and ignored parries come from.
- **Unverified tip:** for hit-stop, set the speed of the attacker's and victim's action tracks to 0 for a few frames, then restore it. Leave idle and movement tracks alone so characters don't look frozen solid. Time the stop on the frame of contact.
- **Unverified tip:** use two clocks for slow-motion moves: real time for the camera, sound and UI, and a separate body time for the animation. Hit-stop is then a stretch where body time runs at rate 0. End any slow-motion segment before the first contact so the impact lands at full speed.
- **Unverified tip:** place contact at the limb's farthest reach, and warp the timeline so the blade or fist spends a couple of extra frames near that point; the hit then reads as heavier without making the whole move slower.
- **Unverified tip:** give each victim a stun budget (a cap on total stun in a short window) so a chain can't lock someone forever. Express frame advantage in tenths of a second if your tools mix frame rates.
- **Unverified tip:** keep abilities as data (damage, range, windup, stun, cooldown in one table per ability) and have one shared executor read it. Roster balance then becomes editing numbers. Keep a ledger of who damaged whom recently so the last hit isn't the only source of kill credit.

See also the tested notes on hit detection and on animation playback in this knowledge base.
