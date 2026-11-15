---
title: string.format with %d needs a whole number
topic: engine-facts/string-format-needs-integers
scope: generic
source: community-lesson
tags: string.format %d integer floor math.huge float number formatting error ui label
---
# string.format with %d needs a whole number

**Unverified tip:** `string.format("%d", n)` throws an error when `n` is not a whole number (12.5, or `math.huge`), because the format has no integer to print. A value that changes over time, such as a widening search range, a timer or a tweened number, is usually a float. A UI label that formats it on every frame then errors on every frame while the screen is open.

**Fix.** Floor or round the value before formatting: `string.format("%d", math.floor(n))`. Handle the open-ended case first, because `math.floor(math.huge)` is still not a whole number: test for `math.huge` (and NaN) and show words such as "Any" instead. If a decimal is fine, use `%.0f` or `tostring` and skip the floor.

**Check.** Open the screen with a fractional value and with `math.huge` and confirm the Output stays clean.
