---
title: Validating RemoteEvents and RemoteFunctions
topic: security/remote-validation
scope: generic
source: own-testing
tags: remote remoteevent remotefunction exploit server validate trust client
---
# Validating remotes

Everything the client sends can be forged. The server decides outcomes.

- Never let the client send results such as damage dealt, currency earned, or items owned. Send intent ("use ability 3", "buy item X") and let the server compute the result.
- Validate every argument: check type, range, NaN, string length, and that Instances still exist and are the class you expect.
- Check ownership and state on the server: does this player own the item, is the cooldown over, are they in range, are they alive.
- Rate-limit per player per remote (a simple token bucket or last-fired timestamp) so spamming cannot grief the server.
- Never trust Instances or CFrames the client passes for authority. Re-derive positions from server-side character state when it matters.
- A RemoteFunction invoked server-to-client can be made to hang or error by the client. Prefer RemoteEvents for server-to-client, and never yield the server on a client reply without a timeout.
- Keep server logic in ServerScriptService or ServerStorage modules; only put what clients must see in ReplicatedStorage.
- Gate any developer cheat or QA remote behind a server-side check (for example Studio-only or an explicit allowlist) and remove it from live builds.
