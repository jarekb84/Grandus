# User Story: Restructure Resource Node Entity Data for Persistence (04a)

**Epic:** [../epic-01-targeted-expansion-and-resource-setup.md](../epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base/node, implement hex selection for Expand Combat, make initial node depletable/respawnable.

---

## Story Goal

Refactor the resource node entity data structure to logically group runtime-configurable properties related to gathering and respawning (e.g., `max capacity`, `current capacity`, `respawn duration`, `respawn capacity increment`, `yield multiplier`, `gathering speed`, `gathering time`). Ensure all these properties are persisted in the game state and update relevant initialization functions (like `initializeNode`) to use the new structure.

---

## Initial Acceptance Criteria (Placeholder)

*   Resource node entity data includes a dedicated structure (e.g., `resourceMechanics`) containing all relevant runtime-configurable properties (`maxCapacity`, `currentCapacity`, `respawnDuration`, `respawnCapacityIncrement`, `yieldMultiplier`, `gatheringSpeed`, `gatheringTime`).
*   The `initializeNode` function (or equivalent) accepts this structure as input.
*   The game state persistence mechanism correctly saves and loads this entire structure for each resource node.
*   Existing gathering and basic respawn functionality remain unchanged after refactoring.

---

## Notes / Context

*   This story is a technical refactoring effort identified as a prerequisite for implementing incremental respawn cycles (Story 04b).
*   It addresses the need to manage and persist several interrelated, runtime-configurable properties identified during the development of Story 04.
*   Architect Recommendation: Implement this story first in the sequence 04a -> 04b -> 04c -> 04d.


## User voice Notes (note these were created before the epic architecture overview was done)
### Summary

This story is a technical refactoring effort to restructure the data associated with a resource node entity. The goal is to group related runtime properties (gathering, respawning) more logically and ensure all configurable runtime properties are properly included and persisted in the game state.

### Current Data Structure and Initialization

*   Currently, the `base entity` may have a sub-property like `gathering properties`.
*   Properties such as `max capacity`, `current capacity`, `respawn duration`, and the new `respawn capacity increment` exist, but their organization might need improvement.
*   The `initializeNode` function currently accepts individual parameters like `node id`, `max cap`, and `current cap`.

### Rationale for Refactoring and Persistence

*   Several properties (`yield multiplier`, `gathering speed`, `gathering time`, `respawn duration`, `respawn capacity increment`) are runtime properties.
*   These properties are all interrelated and affect resource gathering and respawning mechanics.
*   Crucially, all these properties can be configured and changed during runtime.
*   Therefore, all these runtime-configurable properties must be persisted as part of the game state.
*   This also helps me with debugging when I console out to see the current state of a nodes values

### Proposed Data Structure Changes

*   Restructure the `resource node entity` data to better group related properties (e.g., under a single structure like `resource mechanics` or `runtime properties` that encompasses all gathering and respawn-related configurable values).
*   Refactor the `initializeNode` function (and potentially other relevant functions) to accept a single object or structure containing these properties, rather than multiple disparate parameters. This improves the function signature and maintainability.

### Game State Persistence

*   Explicitly ensure that all identified runtime properties (`yield multiplier`, `gathering speed`, `gathering time`, `respawn duration`, `respawn capacity increment`, etc.) are included in the data structure used for persisting the game state.
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