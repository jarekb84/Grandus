# User Story: Implement Adjacent Hex Selection

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

---

## Story Goal

Implement hex clicking in `Territory.scene.ts`, update the selection state (using the mechanism from Tech Story 4), and provide visual feedback (highlighting).

---

## Initial Acceptance Criteria (Optional Placeholder)

*   [Placeholder: To be detailed during story grooming/refinement]
*   Clicking an adjacent, uncontrolled hex updates the selected hex state (using the mechanism defined in Story 04).
*   The selected hex displays clear visual feedback (e.g., highlight, outline).
*   Clicking a non-adjacent or controlled hex does not change the selection state.
*   Clicking the currently selected hex might de-select it (TBD during grooming).

---

## Notes / Context

*   This story implements the user-facing interaction for selecting a target hex.
*   Requires the state communication mechanism from Story 04 to be in place.
*   This story was derived from Epic '01-Targeted-Expansion-And-Resource-Setup'.

---

## Embedded Epic Context for Downstream Processing

<!-- ROO CONTEXT - DO NOT MODIFY MANUALLY -->
<!--
Epic Path: epic-01-targeted-expansion-and-resource-setup.md
Epic Title: 01-Targeted-Expansion-And-Resource-Setup
Epic Goal Summary: Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*
Project Context (if available in Epic):
  Project Title: project-01-establish-core-feedback-loop
  Project Goal: Implement the minimum viable gameplay loop connecting the core views: Gather Stone in Territory View, initiate Expand Combat, earn persistent Coins from Combat success (e.g., clearing Wave 1), spend Coins in a minimal Management View to unlock basic Stone-to-Pebble crafting, use crafted Pebbles to conquer the first Hex (e.g., clear Wave 10), and have the conquered Hex reveal a better/new Stone node.
-->