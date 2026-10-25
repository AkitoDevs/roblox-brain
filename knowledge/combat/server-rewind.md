---
title: Server rewind for melee and hitscan (untested)
topic: combat/lag-compensation
scope: generic
source: maintainer-skill
tags: combat melee hitscan lag compensation rewind ring buffer validation server latency
---
# Server rewind for melee and hitscan (untested)

**Status: untested.** This is a design to try, not a proven setup. Test it with two clients and simulated lag in Studio before relying on it. It builds on the server checks in the melee hit detection entry.

**When to use it.** Only when fights feel unfair under lag: the attacker clearly hit on their screen but the server's present-time check says the target had already moved. For most games the plain present-time check plus a little reach slack is enough.

**How it works**
- The server keeps a short ring buffer of each character's recent root positions, stamped with server time.
- On a hit claim, the server estimates when the attacker saw the target. It clamps that estimate to a small maximum rewind window that the server chooses. Never accept a time the client sends without checking it.
- Run the usual reach, facing and line-of-sight checks against the target's position at that estimated time.
- If the estimate falls outside the window, judge against the present position instead.
- Rewind changes only the validation. Damage is still applied now, on the server.

**Tuning.** Keep the window as small as still feels fair, and tune it in Play with simulated lag. A large window lets laggy attackers hit players who have already escaped, which feels worse to the victim than a missed hit feels to the attacker. Pick starting values by testing; don't copy numbers from elsewhere.
