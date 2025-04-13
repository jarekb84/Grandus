# Technical Story: Refine Resource Node State Management

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

---

## Story Goal

Decide and document the approach for storing and managing resource node state (capacity, respawn timer), potentially creating a basic `ResourceNodeStore` or updating entity definitions, aligning with `STATE_ARCHITECTURE.md`. Consolidate/clarify gathering logic location (`Resource.ts` vs `Territory.scene.ts`).

---

## Initial Acceptance Criteria (Optional Placeholder)

*   [Placeholder: To be detailed during story grooming/refinement]
*   A decision on the state management approach (e.g., Scene `data`, Zustand store, dedicated class) is documented.
*   If a new store/class is chosen, its basic structure is defined.
*   The responsibility for gathering logic is clearly assigned (e.g., to the Scene, a service, or the node entity).
*   Documentation reflects alignment with `STATE_ARCHITECTURE.md` principles (even if implementation is deferred).

---

## Notes / Context

*   This is a technical planning/design story resulting from architect feedback.
*   Focus is on *defining* the approach, not full implementation.
*   This story precedes the implementation of the limited node state.
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