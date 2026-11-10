---
title: Room enemies and content streaming (unverified)
topic: scripting/streaming-room-spawn-tips
scope: generic
source: community-lesson
tags: streaming streamingenabled modelstreamingmode persistentperplayer addpersistentplayer dungeon enemies spawn teleport party pop-in
---
# Room enemies and content streaming

Every line here is labelled **Unverified tip:** because it comes from outside reading and has not been tested by us.

- **Unverified tip:** with StreamingEnabled on, enemies can pop in after a player has already arrived in a room. Spawn the room's enemies before moving the party in, set their `ModelStreamingMode` to `PersistentPerPlayer`, and call `AddPersistentPlayer` for each party member, so the models replicate at once without reaching other players.
