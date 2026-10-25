---
title: Choosing and using Fusion, Vide or Iris
topic: ui/libraries
scope: generic
source: maintainer-skill
tags: ui framework library fusion vide iris reactive declarative scope state computed spring debug panel cleanup
---
# Choosing and using Fusion, Vide or Iris

**Pick the tool**
- Large reactive game UI (menus, shops, inventories) in a new or rewritten screen: **Fusion 0.3** (scopes, explicit use) or **Vide** (terse, Solid-like, typecheck-friendly).
- Debug, admin or tuning panels and live stats: **Iris** (immediate mode).
- An existing imperative codebase: keep it imperative and add a library only for a new, self-contained screen. Never run two paradigms on the same instances.
- Script-hub GUI libraries are made for exploit tools: never embed them in a game.
- Library code is client-only and ships as a ModuleScript in ReplicatedStorage.

**Fusion 0.3**
- Scopes own lifetimes: scoped(Fusion, components) gives method syntax; scope:doCleanup() destroys functions, instances, connections and nested scopes in reverse order. innerScope() for things that close earlier (popups), cleaned with the parent.
- State: scope:Value(x), read with peek, write with :set(). Writing an equal value doesn't propagate. Computed(function(use, scope) ... end) must be immediate and pure: never yield or play sounds inside it.
- Side effects through Observer with onChange or onBind; both return a disconnect.
- 0.2 habits that are gone: constructors without a scope, the old cleanup name, the Ref key (use a Value).
- Lists with ForValues reuse outputs when items move; freeze constant tables so updates can be skipped.
- Spring keeps velocity, so it suits interruptible motion; Tween follows a fixed curve and should not be interrupted.
- Components take (scope, props) and return one instance, array or state object, never multiple values.

**Vide**
- source, derive, effect, root (returns destroy), untrack, cleanup, batch.
- Stable scopes never rerun; reactive scopes (effect, derive) rerun and cannot be created inside another reactive scope: wrap them in untrack.
- show, switch, indexes and values for dynamic UI.
- Mutating a table inside a source does nothing until you set it again.
- Disconnect any connection whose callback captures its own instance.

**Iris for tools**
- Everything runs every frame; state lives in Iris.State. Sliders, checkboxes, tables and plot widgets (good for frame-time graphs) make a tuning panel in a few lines.
- Gate it behind an admin check, create it only on demand, shut it down when closed, and never ship it to players.

**Checklist:** one paradigm per instance tree; every scope or root destroyed on close; no connections capturing their own instance; debug tools absent for players.
