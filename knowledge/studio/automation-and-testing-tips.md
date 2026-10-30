---
title: Studio automation and testing tips (unverified)
topic: studio/automation-and-testing-tips
scope: generic
source: community-lesson
tags: studio automation installer dry run backup anchor duplicate names waitforchild dummy players debug command lighting snapshot playtest cleanup
---
# Studio automation and testing tips

Every line here is labelled **Unverified tip:** because it comes from outside reading and has not been tested by us. They are working habits, not engine facts.

- **Unverified tip:** when a tool inserts or patches scripts, give the installer a dry-run flag that reports what it would change. Add an anchor check (the text or instance it expects to find), and make a backup copy first so rollback is one call.
- **Unverified tip:** tag every instance an installer adds (an attribute and a name suffix), so a later cleanup removes exactly those and nothing else.
- **Unverified tip:** audit for duplicate sibling names before relying on WaitForChild or name lookups; with duplicates, which one you get is not something to depend on.
- **Unverified tip:** test multiplayer lobbies and hubs with scripted dummy players, plus an owner-only debug command that forces a state (start the round, trigger the event). It's cheaper than finding extra people.
- **Unverified tip:** ship risky new behaviour behind a kill-switch attribute that can be flipped without republishing.
- **Unverified tip:** before previewing a different mood, snapshot Lighting (including the sky object) and restore it afterwards, since a preview that deletes or swaps the sky is easy to miss.
- **Unverified tip:** before a playtest, scan for stray top-level objects left behind by earlier tool calls, and after a write check the change actually landed (a stuck undo history can swallow writes).
- **Unverified tip:** a cloned character may have different collision groups from the original; check them before debugging "why does it fall through".
- **Unverified tip:** report "not run" as its own status, never as a pass, and keep a short receipt of what was run and what each result was.
