---
title: Compile-checking shared modules at boot (unverified)
topic: scripting/require-all-modules-tips
scope: generic
source: community-lesson
tags: bootstrap require module compile syntax shared self-check rojo luau startup
---
# Compile-checking shared modules at boot

Every line here is labelled **Unverified tip:** because it comes from outside reading and has not been tested by us.

- **Unverified tip:** with no local Luau checker, a shared module that nothing requires yet (config, formatters with assert self-checks) is never compiled, so a syntax error stays hidden until a later feature needs it. Have the server bootstrap require every shared module once at startup. The first Play then compiles every file and runs all self-checks, and a "ready" print confirms the boot finished.
