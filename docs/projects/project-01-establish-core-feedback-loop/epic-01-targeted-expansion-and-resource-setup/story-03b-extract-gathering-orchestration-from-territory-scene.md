# User Story: Extract Gathering Orchestration from Territory Scene

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](./epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

---

## Story Goal

Create a new `GatheringService` (or similar logic, perhaps within the adapter) responsible solely for orchestrating the gathering sequence (find node, move player, interact with node state, handle wait, move player back, trigger gain). Modify `Territory.scene.ts` and `useTerritoryAdapter` to use this new service, removing the orchestration logic from the scene.

---

## Initial Acceptance Criteria (Optional Placeholder)

*   [Placeholder: A new service/module (e.g., `GatheringService`) exists for gathering orchestration.]
*   [Placeholder: The orchestration logic (find node, move, interact, wait, move back, trigger gain) is implemented within the new service.]
*   [Placeholder: The service uses the pure functions created in Story 03a (e.g., `findNearestNodeOfType`).]
*   [Placeholder: The service is designed to interact with the future Node State system (Story 03) for capacity checks/updates.]
*   [Placeholder: `Territory.scene.ts::initiateGathering` (or equivalent) is simplified to call the new orchestration service.]
*   [Placeholder: `useTerritoryAdapter` is updated to call the new orchestration service instead of the scene's method directly.]
*   [Placeholder: The changes are purely refactoring and do not alter existing gathering behavior.]
*   [Placeholder: The scene (`Territory.scene.ts`) no longer contains complex gathering orchestration logic.]

---

## Notes / Context

*   This is a technical prerequisite story identified during architectural review (post-Story 2).
*   **Goal:** Addresses the SRP violation in `Territory.scene.ts` by extracting the complex gathering orchestration. Creates a dedicated place for this logic, improving maintainability and preparing for the integration of node state management (Story 03).
*   Depends on the pure gathering functions created in Story 03a.
*   **Architect Feedback:** Create a new `GatheringService` (or similar, potentially just functions within the adapter if simple enough) responsible *only* for orchestrating the gathering sequence:
    1.  Use `findNearestNodeOfType` (from Tech Debt 1/Story 03a).
    2.  Call `Territory.scene.ts::moveEntityTo` for player movement to node.
    3.  Interact with the Node State system (from future Story 3) to check/update capacity/depletion.
    4.  Handle the wait/gathering time (potentially via a Promise or event).
    5.  Call `Territory.scene.ts::moveEntityTo` for player movement back.
    6.  Trigger resource gain event/callback (e.g., `onResourceGathered`).
    *   Modify `Territory.scene.ts::initiateGathering` to simply call this new orchestration service/function.
    *   Modify `useTerritoryAdapter` to call this new orchestration service/function instead of `scene.initiateGathering`.
*   This story was derived from Epic '01-Targeted-Expansion-And-Resource-Setup'.

---

## Embedded Epic Context for Downstream Processing

<!-- ROO CONTEXT - DO NOT MODIFY MANUALLY -->
<!--
Epic Path: ./epic-01-targeted-expansion-and-resource-setup.md
Epic Title: 01-Targeted-Expansion-And-Resource-Setup
Story Title: Extract Gathering Orchestration from Territory Scene
Epic Goal Summary: Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the Expand Combat action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. (Refines existing Territory view for targeted actions and correct initial state).
Project Context (if available in Epic):
  Project Title: project-01-establish-core-feedback-loop
  Project Goal: Implement the minimum viable gameplay loop connecting the core views: Gather Stone in Territory View, initiate Expand Combat, earn persistent Coins from Combat success (e.g., clearing Wave 1), spend Coins in a minimal Management View to unlock basic Stone-to-Pebble crafting, use crafted Pebbles to conquer the first Hex (e.g., clear Wave 1), and have the conquered Hex reveal a better/new Stone node.
-->