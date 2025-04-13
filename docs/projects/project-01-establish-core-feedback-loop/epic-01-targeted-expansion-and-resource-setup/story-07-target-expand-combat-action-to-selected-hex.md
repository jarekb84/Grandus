# User Story: Target `Expand Combat` Action to Selected Hex

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](./epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

---

## Story Goal

Modify the `Expand Combat` action/button so it only initiates combat against the currently selected adjacent hex.

---

## Initial Acceptance Criteria (Optional Placeholder)

*   [Placeholder: The `Expand Combat` button/action is disabled if no valid adjacent hex is selected (state from Story 5).]
*   [Placeholder: The `Expand Combat` button/action is enabled only when a valid adjacent hex is selected.]
*   [Placeholder: Activating the `Expand Combat` action uses the currently selected hex coordinates/ID as the target for the combat initiation.]
*   [Placeholder: Activating the action correctly triggers the transition to the Combat Scene (or placeholder logic) with the target hex information.]

---

## Notes / Context

*   Focuses on connecting the hex selection state (Story 5) to the existing `Expand Combat` UI/action.
*   Depends on the selection state logic implemented in Story 5.
*   Does not implement the Combat Scene itself, only the initiation targeting.
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