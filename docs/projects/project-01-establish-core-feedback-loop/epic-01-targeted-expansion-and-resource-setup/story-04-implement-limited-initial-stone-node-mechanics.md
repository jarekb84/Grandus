# User Story: Implement Limited Initial Stone Node Mechanics

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](./epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

---

## Story Goal

Ensure the initial Stone node has a capacity of 1 Stone and replenishes slowly (e.g., every second) after being gathered, using the architecture established in Story 3.

---

## Initial Acceptance Criteria (Optional Placeholder)

*   [Placeholder: The initial Stone node has a maximum capacity defined as 1.]
*   [Placeholder: Gathering from the node reduces its current capacity.]
*   [Placeholder: Gathering is prevented if the node's current capacity is 0.]
*   [Placeholder: After being depleted (capacity 0), the node starts a replenishment timer (e.g., 1 second).]
*   [Placeholder: Upon timer completion, the node's capacity is restored to 1.]
*   [Placeholder: The node state (capacity, timer) is managed by the `ResourceNodeStore`/`ResourceService` established in Story 3.]

---

## Notes / Context

*   This story implements the specific game mechanics for the initial node's limited capacity and respawn.
*   Depends on the state management structure created in Story 3.
*   This story was derived from Epic '01-Targeted-Expansion-And-Resource-Setup' as part of the initial breakdown.

---

## Embedded Epic Context for Downstream Processing

<!-- ROO CONTEXT - DO NOT MODIFY MANUALLY -->
<!--
Epic Path: ./epic-01-targeted-expansion-and-resource-setup.md
Epic Title: 01-Targeted-Expansion-And-Resource-Setup
Epic Goal Summary: Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the Expand Combat action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. (Refines existing Territory view for targeted actions and correct initial state).
Project Context (if available in Epic):
  Project Title: project-01-establish-core-feedback-loop
  Project Goal: Implement the minimum viable gameplay loop connecting the core views: Gather Stone in Territory View, initiate Expand Combat, earn persistent Coins from Combat success (e.g., clearing Wave 1), spend Coins in a minimal Management View to unlock basic Stone-to-Pebble crafting, use crafted Pebbles to conquer the first Hex (e.g., clear Wave 1), and have the conquered Hex reveal a better/new Stone node.
-->