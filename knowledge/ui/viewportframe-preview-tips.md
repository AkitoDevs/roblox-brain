---
title: ViewportFrame preview and clone tips
topic: ui/viewportframe-preview-tips
scope: generic
source: community-lesson
tags: viewportframe clone collectionservice tags attributes glass preview shop character fixed camera headroom framing
---
# ViewportFrame preview and clone tips

- A clone put into a ViewportFrame keeps its CollectionService tags and attributes, so tag scans find the stale copy as if it were the real object. Strip tags from the clone and all its descendants before parenting it, and make tag scans confirm real objects sit under the workspace.
- **Unverified tip:** a Glass item can look like a plain white object in a viewport, which misrepresents a shop item. Check the preview in a screenshot; for the viewport copy swap Glass for an opaque material and show the colour behaviour directly.
- **Unverified tip:** never name a child after an existing GuiObject property such as `Selected`: indexing returns the property, not the child.
- **Unverified tip:** a live character preview rebuilt on every option click can jitter or jump. Use a fixed camera with reserved headroom for late-loading accessories rather than fitting to each model, and pose the rig at a constant time so every rebuild looks identical.
- **Unverified tip:** verify framing by projecting every part corner through the camera for each body variant. Parts nearer the camera project further from centre.
