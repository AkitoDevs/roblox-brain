---
title: Testing vehicle driving (unverified)
topic: vehicles/testing
scope: generic
source: community-lesson
tags: vehicle vehicleseat throttlefloat steerfloat testing input network ownership automated test unverified
---
# Testing vehicle driving

Labelled **Unverified tip:** one developer's report, not checked by us.

- **Unverified tip:** setting a VehicleSeat's ThrottleFloat or SteerFloat from a client script to test driving may do nothing, because the seat overwrites them from player input every frame. The vehicle then looks broken in tests.
- **Unverified tip:** drive it from a client loop that writes the values every frame while the rider has network ownership from the server.
- **Unverified tip:** in automated tests, send real key presses, or write the movement constraint values directly to confirm the physics works on its own.