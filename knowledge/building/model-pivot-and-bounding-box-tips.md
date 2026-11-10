---
title: Model pivot and bounding box tips (unverified)
topic: building/model-pivot-tips
scope: generic
source: community-lesson
tags: model pivot worldpivot getboundingbox scaleto pivotto grounding orientation rotated part unverified
---
# Model pivot and bounding box tips

Every rule here is labelled **Unverified tip:** because it comes from one developer's report and has not been checked against current docs or by us.

- **Unverified tip:** a brand-new Model with no PrimaryPart may take its pivot orientation from the first rotated part you add to it (for example a cylinder turned 90 degrees). GetBoundingBox measures in that pivot frame, so a tall object can report its height on the X axis.
- **Unverified tip:** when you move parts from a generated or nested model into a fresh Model, first set its WorldPivot to an axis-aligned CFrame, then read the bounding box, then move the pivot to the bottom centre. Only after that call ScaleTo or PivotTo, so scaling and ground placement use the right axes.
- **Unverified tip:** if a size looks sideways, print the model's pivot orientation before trusting any measurement.