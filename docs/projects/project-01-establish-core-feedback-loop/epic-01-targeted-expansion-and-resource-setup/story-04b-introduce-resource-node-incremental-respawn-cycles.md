# User Story: Introduce Resource Node Incremental Respawn Cycles (04b)

**Epic:** [../epic-01-targeted-expansion-and-resource-setup.md](../epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base/node, implement hex selection for Expand Combat, make initial node depletable/respawnable.

---

## Story Goal

Modify the resource node respawn mechanism so that capacity increases incrementally by a configurable amount (`respawn capacity increment`) at the end of each `respawn duration` cycle, continuing until max capacity is reached, instead of instantly setting to max capacity. The `isRespawning` state should persist throughout these cycles.

---

## Initial Acceptance Criteria (Placeholder)

*   A new configurable property `respawnCapacityIncrement` is added to the resource node data structure (established in Story 04a).
*   When a node starts respawning, a cycle timer based on `respawnDuration` begins.
*   Upon completion of a `respawnDuration` cycle:
    *   The node's `currentCapacity` increases by `respawnCapacityIncrement`.
    *   The `isRespawning` state remains true.
    *   If `currentCapacity` is still less than `maxCapacity`, another `respawnDuration` cycle is initiated.
*   When `currentCapacity` reaches or exceeds `maxCapacity` after an increment:
    *   `currentCapacity` is capped at `maxCapacity`.
    *   The `isRespawning` state is set to false.
    *   No further respawn cycles are initiated for this respawn event.

---

## Notes / Context

*   This story introduces the core logic for incremental respawning.
*   Depends on the data structure refactoring completed in Story 04a.
*   Architect Recommendation: Implement this story after 04a and before 04c.


## User voice Notes (note these were created before the epic architecture overview was done)

### Summary

This story introduces a new behavior for resource node respawning where capacity increases incrementally over time via defined respawn cycles, rather than jumping directly to max capacity upon finishing respawning.

### Current vs. Desired Respawn Behavior

*   **Current:** On finishing respawn, the node's capacity goes from its current value (e.g., zero or one) directly to max capacity.
*   **Desired:** The respawn behavior should be incremental. For every `respawn duration` that elapses, the node should gain a specific, configurable amount of capacity.

### Respawn Cycles Concept

*   Introduce the concept of "respawn cycles".
*   A new configurable value is needed: `respawn capacity increment`. This value determines how much capacity is added per cycle.
*   Each respawn cycle lasts for the defined `respawn duration`.
*   At the end of a `respawn duration` cycle, the node's current capacity should increase by the `respawn capacity increment`.
*   These cycles should continue until the node reaches its `max capacity`.

### Handling `isRespawning` State and Timers

*   The `isRespawning` state/timer should *not* be wiped out or reset to false after each increment of capacity.
*   It should only be reset to false when the node reaches `max capacity`.
*   Instead of a single `finish respawn` event that sets to max, the system should initiate a process where upon completion of a `respawn duration` cycle, capacity is incremented, and if not yet at max capacity, the process effectively starts another timer or continues the existing one for the next increment cycle. The architect should determine the best technical implementation for this cycle management.

### New Configuration

*   A new configurable field is required to define the amount of capacity added per cycle.
*   Suggested names: `respawn capacity increment`, `respawn duration increment`, or `respawn duration capacity increment value`. Consider the existing naming convention for clarity.

---

## Embedded Epic Context for Downstream Processing

<!-- ROO CONTEXT - DO NOT MODIFY MANUALLY -->
<!--
Epic Path: ../epic-01-targeted-expansion-and-resource-setup.md
Epic Title: 01-Targeted-Expansion-And-Resource-Setup
Epic Goal Summary: Align home base/node, implement hex selection for Expand Combat, make initial node depletable/respawnable.
Project Context (if available in Epic):
  Project Title: project-01-establish-core-feedback-loop
  Project Goal: Implement core loop: Gather -> Expand Combat -> Coins -> Crafting -> Conquest -> Better Node.
-->