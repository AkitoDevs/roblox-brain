---
title: Melee hit detection, validation and timing
topic: combat/hit-detection
scope: generic
source: maintainer-skill
tags: combat melee hitbox raycast shapecast spatial query keyframe marker validation server reach cooldown combo input action system
---
# Melee hit detection, validation and timing

Starting values below come from study and need tuning in Play; they are not tested constants.

**One input path for every device.** Bind actions through the Input Action System: an InputContext with Bool actions (Attack, Block, Dodge, abilities) and one binding each for keyboard and mouse, gamepad and touch. Disable the context under menus. Place the touch cluster on the right thumb relative to the jump button and show it when the preferred input is touch.

**Timing comes from the animation.** Put KeyframeMarkers on every attack (wind-up end, hit start, hit end, combo window open and close, recover; rolls get invincibility markers) and react with GetMarkerReachedSignal. Never time hits with task.wait.

**Detect on the attacker's client with the right query**
- Swings: sweep raycasts from blade attachments, last position to current, every frame between hit start and hit end.
- Short wide strikes: GetPartBoundsInBox. Area attacks: GetPartBoundsInRadius, then dedupe Humanoids.
- Projectiles: Spherecast. Exact shapes: GetPartsInPart.
- Shape casts miss parts they start inside. Exclude the attacker. Hit each Humanoid once per swing.

**Validate on the server, every time, in this order:**
1. argument types;
2. attacker alive, holding the weapon, off cooldown by server timestamps, with a server-issued swing id;
3. distance within reach plus slack (start at 3 to 4 studs);
4. victim in front (dot product above about 0.2);
5. a line-of-sight raycast;
6. one hit per victim per swing id.

Apply damage only on the server. Each player pays only for their own lag; never trust a reported ping. Test with Studio's incoming replication lag setting.

**Combos.** A time-based input buffer (about 0.15 s, not frames). The combo window chains a buffered press; clear the buffer on hitstun. The server still enforces swing rate.

**Verify honestly.** Run a server with several clients and simulated lag, on phone and tablet emulation. Never call combat done from code alone: feel, timing and shake strength have to be judged in Play.
