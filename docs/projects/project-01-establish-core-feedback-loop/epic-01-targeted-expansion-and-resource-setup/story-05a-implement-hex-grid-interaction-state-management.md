# User Story: Implement Hex Grid Interaction & Selection State Management

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](./epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

---

## Story Goal

Implement the core system for handling user clicks on hexes within the Territory View, managing the state of the currently selected hex, and making this state accessible for other features (like visual feedback and combat targeting).

---

## Initial Acceptance Criteria (Optional Placeholder)

*   [Placeholder: A system/manager (e.g., HexInteractionManager, or logic within Territory scene/adapter) exists to handle hex grid input.]
*   [Placeholder: Clicking on a hex triggers an input event handled by this system.]
*   [Placeholder: The system identifies the clicked hex coordinates/ID.]
*   [Placeholder: The system maintains the state of the currently 'selected' hex.]
*   [Placeholder: Logic exists to determine if a clicked hex is a valid selection target (e.g., adjacent, uncontrolled).]
*   [Placeholder: Clicking a valid target updates the 'selected hex' state.]
*   [Placeholder: Clicking an invalid target or the current target potentially clears the selection state.]
*   [Placeholder: The 'selected hex' state is accessible (e.g., via a store, event, or adapter property) for use by other systems.]

---

## Notes / Context

*   This is a technical prerequisite story identified during architectural review (post-Story 2).
*   **Goal:** Establishes the foundation for all hex selection features (Stories 05, 06, 07) by creating the input handling and state management layer.
*   **Architect Feedback:** Feat - Implement Hex Grid Interaction & Selection State Management. Goal: As previously defined (create `HexInteractionManager`, handle input, manage selection state, establish communication). Timing: This primarily benefits Stories 5-7 and can be done *after* Stories 3 & 4 are complete.
*   This story was derived from Epic '01-Targeted-Expansion-And-Resource-Setup'.

---

## Embedded Epic Context for Downstream Processing

<!-- ROO CONTEXT - DO NOT MODIFY MANUALLY -->
<!--
Epic Path: ./epic-01-targeted-expansion-and-resource-setup.md
Epic Title: 01-Targeted-Expansion-And-Resource-Setup
Story Title: Implement Hex Grid Interaction & Selection State Management
Epic Goal Summary: Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the Expand Combat action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. (Refines existing Territory view for targeted actions and correct initial state).
Project Context (if available in Epic):
  Project Title: project-01-establish-core-feedback-loop
  Project Goal: Implement the minimum viable gameplay loop connecting the core views: Gather Stone in Territory View, initiate Expand Combat, earn persistent Coins from Combat success (e.g., clearing Wave 1), spend Coins in a minimal Management View to unlock basic Stone-to-Pebble crafting, use crafted Pebbles to conquer the first Hex (e.g., clear Wave 1), and have the conquered Hex reveal a better/new Stone node.
-->