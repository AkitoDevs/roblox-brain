---
title: Hit feedback, blocking, parries and dodges
topic: combat/hit-feedback
scope: generic
source: maintainer-skill
tags: combat hit feedback hitstop camera shake knockback damage numbers sound block parry dodge iframes impulse
---
# Hit feedback, blocking, parries and dodges

Starting values from study, to be tuned in Play.

**Hit feedback beat sheet (time from contact)**
- -0.10 s: an anticipation glint at the end of the wind-up.
- 0: impact frame (0.05 to 0.1 s), hit flash (about 0.15 s), a spark burst along the reflected normal, a hit-stop freeze scaled by tier (about 0.03, 0.07, 0.12 s) and the sound stack.
- +0.05 s: camera trauma by tier (light 0, medium 0.15, heavy 0.35, finisher 0.6 plus a small FOV kick).
- +0.1 to 0.4 s: knockback. The server chooses it, but the victim's own client applies the impulse (ApplyImpulse with direction × strength × AssemblyMass), because that client owns the victim's physics. Heavy hits go to ragdoll.

**Sound stack:** a transient, a body layer chosen by the victim's material, a weight layer for heavy hits only and an optional tail. Pool Sounds per layer at the contact attachment, pick a random clip with ±5 to 8% PlaybackSpeed, never repeat the same clip twice in a row, and preload everything.

**Camera shake:** multiply an offset onto the camera CFrame at camera priority with trauma squared decaying over time. Never overwrite the CFrame. Offer a reduce-shake setting.

**Damage numbers:** a pool of about 24 BillboardGuis (MaxDistance about 100), merge hits that land within 0.25 s, show them only to the attacker (and the victim), rise and fade with Quint Out.

**Block and parry.** The server records when block was pressed. The first ~0.18 s (plus ~0.05 s grace) is the parry window: no damage and the attacker is staggered. After that it is a block with chip damage. Frontal hits only. Parry cooldown around 0.6 s. Log press time, hit time and verdict while tuning.

**Dodge.** Start the roll and its effects on the client immediately. The server sets an invincible-until time (roll start + about 0.25 s + about 0.08 s grace) and the hit check rejects hits inside it. Never use a ForceField for this.
