# User Story: Target `Expand Combat` Action

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

---

## Story Goal

Modify `Territory.tsx` and `useTerritoryAdapter` to use the selected hex state (from Tech Story 4) to call `requestCombatStart(hexId)`. Update button UI.

---

## Initial Acceptance Criteria (Optional Placeholder)

*   [Placeholder: To be detailed during story grooming/refinement]
*   The `Expand Combat` button is disabled or provides feedback if no valid adjacent hex is selected.
*   When an adjacent hex is selected, clicking the `Expand Combat` button calls `useTerritoryAdapter.requestCombatStart` with the correct selected hex ID.
*   The UI potentially updates to reflect the targeted action (e.g., button text changes).

---

## Notes / Context

*   This story connects the hex selection (Story 5) to the combat initiation action.
*   Requires the hex selection state to be accessible via the adapter (established in Story 4).
*   Depends on Story 5 (selection implementation) and Story 4 (state communication).
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