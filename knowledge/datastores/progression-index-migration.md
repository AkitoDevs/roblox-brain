---
title: Migrating saves when progression lists change (unverified)
topic: datastores/progression-index-migration
scope: generic
source: community-lesson
tags: datastore migration version index progression areas tiers remap schema saved progress unverified
---
# Migrating saves when progression lists change

Labelled **Unverified tip:** one developer's report, not checked against docs or by us. It extends datastores/safe-saving.

- **Unverified tip:** removing or merging entries in an ordered list (areas, worlds, tiers) shifts every later index. Saved current or best progress then points at the wrong stage, and anything derived from the index, such as a difficulty multiplier, changes.
- **Unverified tip:** bump the save's version field and add a one-time mapping from old index to new index. Removed stages collapse onto their replacement, and later stages shift down.
- **Unverified tip:** chain older migrations through the intermediate layout, never straight to the newest one, so each step stays small and checkable.
- **Unverified tip:** test the mapping table in Studio with sample old saves before any playtest on real data.
