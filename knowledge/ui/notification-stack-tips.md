---
title: Notification stack and pop-up tips (unverified)
topic: ui/notification-stack-tips
scope: generic
source: community-lesson
tags: ui simulator notification toast alert announce stack merge counter remoteevent popup splash fade money gain
---
# Notification stack and pop-up tips

Every line here is labelled **Unverified tip:** because it comes from reading a measured simulator UI brief, not from our own test. Build one panel and one notification stack, watch them in Play, then promote or drop each line.

**Notifications**
- **Unverified tip:** use one container per kind (announcement, success toast, error alert), each with its own colour and lifetime (for example about 5 s for announcements and 2.5 s for toasts and alerts), and one entry point `notify(kind, text)` fired from the server by a single RemoteEvent.
- **Unverified tip:** cap each container at about 4 visible lines and remove the oldest first.
- **Unverified tip:** when the same message arrives again while it is still showing, merge it into the existing line with a counter, such as "Not enough cash! (x3)", and restart its timer. Spam clicks then show one growing line instead of a wall of copies.
- **Unverified tip:** small pop-ups (a "+250" money gain) can grow in over about 0.18 s with Back Out, then drift up and fade, starting the fade at about 65 % of their lifetime so they stay readable most of the time.
- **Unverified tip:** a big splash ("x2 Luck") pops in over about 0.45 s while a glow behind it spins and grows, then leaves by scaling to about 1.15 while fading over about 0.35 s.

Panel open and close behaviour is in the panel controller notes.
