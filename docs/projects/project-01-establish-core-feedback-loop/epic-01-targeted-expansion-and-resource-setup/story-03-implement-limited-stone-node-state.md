# User Story: Implement Limited Stone Node State

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

---

## Story Goal

Implement the chosen state management (defined in Story 02) for the initial Stone node (capacity, respawn timer) and integrate it with the primary gathering logic to respect limits and trigger respawn.

---

## Initial Acceptance Criteria (Optional Placeholder)

*   [Placeholder: To be detailed during story grooming/refinement]
*   The initial Stone node adheres to its defined capacity (e.g., 1 Stone).
*   Attempting to gather from a depleted node has no effect (or provides appropriate feedback).
*   The node respawns/replenishes its resource after the defined timer elapses.
*   Gathering logic correctly interacts with the node's state (capacity, timers).

---

## Notes / Context

*   This story implements the state logic designed in the preceding technical story (Story 02).
*   Requires the state management approach to be defined first.
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