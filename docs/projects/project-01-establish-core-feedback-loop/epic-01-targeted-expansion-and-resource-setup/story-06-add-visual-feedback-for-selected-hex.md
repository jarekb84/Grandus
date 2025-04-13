# User Story: Add Visual Feedback for Selected Hex

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](./epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

---

## Story Goal

Provide clear visual feedback (e.g., highlighting or outlining) when a player selects an adjacent hex.

---

## Initial Acceptance Criteria (Optional Placeholder)

*   [Placeholder: When an adjacent, uncontrolled hex is selected (state from Story 5), its visual representation changes (e.g., border highlight, color tint).]
*   [Placeholder: Only the currently selected hex shows the selection feedback.]
*   [Placeholder: If no hex is selected, or a non-selectable hex is clicked, no selection feedback is shown (or existing feedback is removed).]
*   [Placeholder: The visual feedback is clearly distinguishable.]

---

## Notes / Context

*   Focuses purely on the visual rendering aspect of hex selection.
*   Depends on the selection state logic implemented in Story 5.
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