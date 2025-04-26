# User Story: Implement Adjacent Hex Selection

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](./epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

---

## Story Goal

Allow the player to click on adjacent, uncontrolled hexes in the Territory View to select them as a potential target.

---

## Initial Acceptance Criteria (Optional Placeholder)

*   [Placeholder: Clicking on a hex adjacent to the home base hex registers an input event.]
*   [Placeholder: Clicking an adjacent, uncontrolled hex updates the game state to mark that hex as the 'selected target'.]
*   [Placeholder: Clicking the home base hex or an already controlled hex does not change the 'selected target' state (or deselects).]
*   [Placeholder: Clicking a non-adjacent hex does not change the 'selected target' state.]
*   [Placeholder: Only one hex can be the 'selected target' at a time.]

---

## Notes / Context

*   Focuses on the input handling and state management for selecting a target hex.
*   Depends on the hex interaction and state management system implemented in Story 05a.
*   Visual feedback for selection is handled in Story 6.
*   Interaction with the `Expand Combat` button is handled in Story 7.
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