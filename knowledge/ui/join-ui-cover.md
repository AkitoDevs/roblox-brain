---
title: Join-time UI cover tips (unverified)
topic: ui/join-ui-cover
scope: generic
source: community-lesson
tags: ui join loading screen cover replicatedfirst startergui flash bootstrap timeout removedefaultloadingscreen
---
# Join-time UI cover tips

Every line here is **Unverified tip:** material from outside reading, not tested by us.

When the interface is rebuilt in layers, the older StarterGui version can show for a second or two on join while later layers wait to replace or restyle it. Hide that with a cover:

1. **Unverified tip:** create an opaque cover from a LocalScript in ReplicatedFirst so it exists before the rest of the UI.
2. **Unverified tip:** remove the default loading screen only after the cover is parented, so there is no gap between them.
3. **Unverified tip:** lift the cover when the client bootstrap reports that the final UI is built and the first server data snapshot has arrived.
4. **Unverified tip:** always add a timeout that lifts the cover anyway, so a failed bootstrap cannot trap players behind it.
