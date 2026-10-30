---
title: Mixing and ducking tips (unverified)
topic: scripting/audio-mixing-tips
scope: generic
source: community-lesson
tags: mixing duck ducking loudness normalise mono phone speaker licence voice routing
---
# Audio mixing and sound-key tips

Every line here is labelled **Unverified tip:** because it comes from outside reading and has not been tested by us (and nothing was listened to).

- **Unverified tip:** make ducking a named request with an expiry. A system asks "lower music by this much for this long" and the mixer restores the level when the request ends, so a cancelled scene can't leave the music quiet.
- **Unverified tip:** normalise loudness across your sound effects so a new sound isn't louder than the rest, and check the mix in mono on a phone speaker, since many players listen that way.
- **Unverified tip:** give each sound key (a name in a lookup table) one job. A key reused for several purposes makes later swaps risky.
- **Unverified tip:** for voice or sung content, keep a note of where it came from and its licence before using it in a game.
- **Unverified tip:** route a group of sounds by setting each Sound's SoundGroup property; parenting a Sound under a SoundGroup instance is not reported to do the routing.

Check Roblox's audio asset rules (what you may upload and use) in the official documentation before shipping any audio.
