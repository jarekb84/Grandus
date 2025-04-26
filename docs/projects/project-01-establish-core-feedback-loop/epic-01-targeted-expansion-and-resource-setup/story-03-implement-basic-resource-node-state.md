# User Story: Implement Basic Resource Node State (Capacity/Depletion)

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](./epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

---

## Story Goal

Implement the basic state management for resource nodes, specifically handling capacity and depletion states, integrating with the `GatheringService` (from Story 03b). This forms the foundation for detailed mechanics like respawn.

---

## Initial Acceptance Criteria (Optional Placeholder)

*   [Placeholder: A state management system (e.g., ResourceNodeStore/Service) exists for resource nodes.]
*   [Placeholder: Each node has a defined maximum capacity (e.g., loaded from initialEntityData.ts).]
*   [Placeholder: Each node tracks its current capacity.]
*   [Placeholder: The GatheringService (from Story 03b) can query a node's current capacity.]
*   [Placeholder: The GatheringService can decrement a node's current capacity upon successful gathering.]
*   [Placeholder: Attempting to gather from a node with 0 current capacity is prevented or handled appropriately by the GatheringService.]

---

## Notes / Context

*   Focuses on establishing the core state management for node capacity and depletion.
*   Depends on the pure gathering functions (Story 03a) and the extracted `GatheringService` (Story 03b).
*   Establishes the core state before respawn logic (Story 04) is added.
*   Architect Feedback: Create `ResourceNode.store.ts` (Zustand) or integrate into `GameState.store.ts` (if simple enough initially). Update `initialEntityData.ts`. The `GatheringService` (from Tech Debt 2/Story 03b) will interact with this store to check/update state during orchestration.
*   This story was derived from Epic '01-Targeted-Expansion-And-Resource-Setup'.

---

## Embedded Epic Context for Downstream Processing

<!-- ROO CONTEXT - DO NOT MODIFY MANUALLY -->
<!--
Epic Path: ./epic-01-targeted-expansion-and-resource-setup.md
Epic Title: 01-Targeted-Expansion-And-Resource-Setup
Story Title: Implement Basic Resource Node State (Capacity/Depletion)
Epic Goal Summary: Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the Expand Combat action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. (Refines existing Territory view for targeted actions and correct initial state).
Project Context (if available in Epic):
  Project Title: project-01-establish-core-feedback-loop
  Project Goal: Implement the minimum viable gameplay loop connecting the core views: Gather Stone in Territory View, initiate Expand Combat, earn persistent Coins from Combat success (e.g., clearing Wave 1), spend Coins in a minimal Management View to unlock basic Stone-to-Pebble crafting, use crafted Pebbles to conquer the first Hex (e.g., clear Wave 1), and have the conquered Hex reveal a better/new Stone node.
-->