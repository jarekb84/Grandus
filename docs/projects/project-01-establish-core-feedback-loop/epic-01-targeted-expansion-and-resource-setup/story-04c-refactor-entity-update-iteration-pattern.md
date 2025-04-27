# User Story: Refactor Entity Update Iteration Pattern (04c - Technical Story)

**Epic:** [../epic-01-targeted-expansion-and-resource-setup.md](../epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base/node, implement hex selection for Expand Combat, make initial node depletable/respawnable.

---

## Story Goal

Investigate and refactor systems subscribing to state stores (initially `ResourceNode.store`) to use a more targeted update mechanism (e.g., event-based via an Event Bus, selective subscriptions, or processing queues) instead of iterating over all entities on every state change. Focus specifically on `Territory.scene.ts` visual updates first. Examine `RespawnService` as a secondary target.

---

## Initial Acceptance Criteria (Placeholder)

*   Analysis confirms the iteration pattern in `Territory.scene.ts`'s `updateNodeVisuals` (or equivalent) and potentially `RespawnService`.
*   A targeted update mechanism (e.g., Event Bus listener, specific store subscription) is implemented in `Territory.scene.ts` for handling visual updates triggered by `ResourceNode.store` changes.
*   The scene no longer iterates over all nodes in the store for visual updates triggered by store changes; it only updates the specific node(s) indicated by the event/signal.
*   (Optional Stretch) `RespawnService` is refactored similarly if analysis shows significant benefit.
*   Existing node visuals and respawn logic function correctly after the refactoring.
*   Performance implications are considered and ideally measured (e.g., reduced update loop time in Phaser).

---

## Notes / Context

*   This is a crucial technical story identified during architectural review.
*   It addresses a performance bottleneck/architectural smell where systems iterate over all entities on any state change, which will not scale.
*   This refactoring is a prerequisite for efficiently implementing dynamic visuals in Story 04d.
*   Depends on Story 04a (Incremental Respawn) as the events needed might be influenced by that logic.
*   Architect Recommendation: Implement after 04b and critically before 04d. Focus on event-driven updates or selective subscriptions.

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