---
title: Server-side movement checks (speed and teleport)
topic: security/movement-checks
scope: generic
source: community-lesson
tags: anti cheat anticheat exploit speed hack teleport hack fly movement check validation server walkspeed rubber band capture the flag carry objective delivery payout
---
# Server-side movement checks (speed and teleport)

Clients own their character's physics, so an exploiter can move faster than WalkSpeed or teleport. The server can't stop that movement, but it can notice it and refuse what the player gains from it.

**Sample positions on the server**, about every 0.25 s per player, using **horizontal distance only** (ignore Y), so jumps, falls and jump pads don't trip it.

- **Speed: use a leaky bucket.** Each sample, add the distance moved and subtract what's allowed: the server's own `Humanoid.WalkSpeed` × elapsed time, plus a margin. Flag only when the bucket goes over a limit. Ping spikes and small bursts drain away instead of flagging honest players. Read WalkSpeed on the server, so slowdowns (carrying something, status effects) tighten the limit automatically.
- **Teleport: a single big step.** One sample that moves much farther than any allowed speed could (allowing for `player:GetNetworkPing()`) gets flagged immediately.
- **Allow legitimate moves.** When your own code teleports, launches or respawns a player, mark them as exempt for a moment or reset their last position.

**Check again at the moment of value.** Periodic samples leave gaps, and an exploiter can deliver a flag, coin or objective in between. In the server handler that pays out (scoring, delivery, purchase), run the teleport check right then against the last known good position before granting anything.

**Respond proportionally:**
- Rubber-band: move them back with `character:PivotTo(lastGoodCFrame)`.
- Cancel the gain: a flagged player carrying an objective drops it.
- Log repeated flags rather than banning on one, because a false positive is worse than a missed cheat.

**Test it:** in Studio, raise your WalkSpeed from the client command bar and confirm a flag and rubber-band; then play honestly with lag simulation on (Studio's network settings) and confirm nothing is flagged.

Pair this with security/remote-validation: the server also validates every remote argument.
