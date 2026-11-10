---
title: More script facts (string replacement, property replication)
topic: engine-facts/measured-script-facts-more
scope: generic
source: community-lesson
tags: gsub percent replacement source patch humanoid autorotate replication client server property
---
# More script facts

- **A percent sign in gsub replacement text is a capture reference.** Patching a script's `Source` with `string.gsub` fails with an "invalid use of %" error when the inserted text holds percent signs (format patterns, UI text such as a plus-ten-percent label). Find the anchor with a plain `string.find` (plain flag on) and rebuild the source with `string.sub` plus concatenation, or pass a function as the replacement.
- **Unverified tip:** restore a client-set property on the client that changed it. If a client turned `Humanoid.AutoRotate` off, a server write of `true` does nothing, because a server write only replicates when the server's own value changes. The character then keeps a fixed facing and appears to run backward.
