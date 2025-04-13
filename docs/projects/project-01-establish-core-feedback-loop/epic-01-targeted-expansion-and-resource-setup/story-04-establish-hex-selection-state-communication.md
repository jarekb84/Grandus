# Technical Story: Establish Hex Selection State Communication

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

---

## Story Goal

Define and implement the mechanism for `Territory.scene.ts` to store the currently selected hex and communicate it to (or make it accessible by) `useTerritoryAdapter`.

---

## Initial Acceptance Criteria (Optional Placeholder)

*   [Placeholder: To be detailed during story grooming/refinement]
*   A clear mechanism (e.g., Scene data property, event emission, adapter callback) for storing and accessing the selected hex ID is documented and implemented.
*   `useTerritoryAdapter` can reliably retrieve the currently selected hex ID (or null/undefined if none selected).
*   The chosen communication pattern is documented.

---

## Notes / Context

*   This is a technical planning/implementation story resulting from architect feedback.
*   Focus is on the *communication channel* between the Phaser scene and the React adapter for the selected hex state.
*   This story precedes the implementation of the actual hex selection interaction.
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