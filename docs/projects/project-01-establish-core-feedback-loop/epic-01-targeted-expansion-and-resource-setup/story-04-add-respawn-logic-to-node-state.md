# User Story: Add Respawn Logic to Node State

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](./epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

---

## Story Goal

Add respawn timing and logic to the node state management system (from Story 03), allowing depleted nodes to replenish their capacity after a set duration (e.g., 1 second for the initial Stone node).

---

## Initial Acceptance Criteria (Optional Placeholder)

*   [Placeholder: The node state management system (from Story 03) can track a respawn timer for depleted nodes.]
*   [Placeholder: When a node's capacity reaches 0 (detected by GatheringService or state system), a respawn timer starts (e.g., 1 second duration from config/initial data).]
*   [Placeholder: While the respawn timer is active, the node remains depleted (capacity 0).]
*   [Placeholder: Upon timer completion, the node's capacity is restored to its maximum value.]
*   [Placeholder: The respawn timer logic is integrated within or triggered by the node state system (Story 03).]

---

## Notes / Context

*   Focuses on implementing the time-based replenishment mechanic for resource nodes.
*   Depends on the basic node state management (capacity/depletion) established in Story 03.
*   Implements the "slow respawn" aspect of the Epic Goal for the initial node.
*   **Architect Feedback:** Clarify goal: Focus on adding respawn logic and initial values to the system built in Story 3. Depends on Story 3.
*   This story was derived from Epic '01-Targeted-Expansion-And-Resource-Setup'.

---

## Embedded Epic Context for Downstream Processing

<!-- ROO CONTEXT - DO NOT MODIFY MANUALLY -->
<!--
Epic Path: ./epic-01-targeted-expansion-and-resource-setup.md
Epic Title: 01-Targeted-Expansion-And-Resource-Setup
Story Title: Add Respawn Logic to Node State
Epic Goal Summary: Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the Expand Combat action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. (Refines existing Territory view for targeted actions and correct initial state).
Project Context (if available in Epic):
  Project Title: project-01-establish-core-feedback-loop
  Project Goal: Implement the minimum viable gameplay loop connecting the core views: Gather Stone in Territory View, initiate Expand Combat, earn persistent Coins from Combat success (e.g., clearing Wave 1), spend Coins in a minimal Management View to unlock basic Stone-to-Pebble crafting, use crafted Pebbles to conquer the first Hex (e.g., clear Wave 1), and have the conquered Hex reveal a better/new Stone node.
-->