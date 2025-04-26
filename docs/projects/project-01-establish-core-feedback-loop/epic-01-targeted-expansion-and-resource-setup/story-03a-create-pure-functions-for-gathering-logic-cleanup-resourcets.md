# User Story: Create Pure Functions for Gathering Logic & Clean Up Resource.ts

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](./epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

---

## Story Goal

Create pure utility functions (e.g., in a new `features/territory/gatheringUtils.ts`) for essential gathering calculations (`findNearestNodeOfType`, `calculateYield`). Remove the unused `ResourceSystem` class and associated dead code from `features/territory/Resource.ts`, potentially deleting the file if empty.

---

## Initial Acceptance Criteria (Optional Placeholder)

*   [Placeholder: A new file (e.g., `gatheringUtils.ts`) exists containing pure functions.]
*   [Placeholder: A pure function `findNearestNodeOfType(position, resourceType, allNodes)` is implemented and tested.]
*   [Placeholder: A pure function `calculateYield(nodeData)` is implemented and tested (potentially reusing logic from old `Resource.ts`).]
*   [Placeholder: The `ResourceSystem` class is removed from `features/territory/Resource.ts`.]
*   [Placeholder: Any other dead code associated with `ResourceSystem` is removed.]
*   [Placeholder: `features/territory/Resource.ts` is deleted if empty, or repurposed solely for gathering utils if appropriate.]
*   [Placeholder: The changes are purely refactoring and do not alter existing gathering behavior.]

---

## Notes / Context

*   This is a technical prerequisite story identified during architectural review (post-Story 2).
*   **Goal:** Addresses dead code and extracts reusable logic into pure functions, improving testability and adhering to Functional Design preferences. Sets the stage for extracting orchestration logic (Story 03b).
*   **Architect Feedback:** Create pure utility functions (e.g., in a new `features/territory/gatheringUtils.ts`) for:
    *   `findNearestNodeOfType(position: {x, y}, resourceType: ResourceType, allNodes: ResourceNodeEntity[]) => ResourceNodeEntity | null`
    *   `calculateYield(nodeData: ResourceNodeEntity) => ResourceType[]` (Re-evaluate `Resource.ts::calculateResourceYields` for reuse).
    *   Remove the unused `ResourceSystem` class and associated dead code from `features/territory/Resource.ts`. Delete the file if empty, or repurpose for the new utils if appropriate.
*   This story was derived from Epic '01-Targeted-Expansion-And-Resource-Setup'.

---

## Embedded Epic Context for Downstream Processing

<!-- ROO CONTEXT - DO NOT MODIFY MANUALLY -->
<!--
Epic Path: ./epic-01-targeted-expansion-and-resource-setup.md
Epic Title: 01-Targeted-Expansion-And-Resource-Setup
Story Title: Create Pure Functions for Gathering Logic & Clean Up Resource.ts
Epic Goal Summary: Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the Expand Combat action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. (Refines existing Territory view for targeted actions and correct initial state).
Project Context (if available in Epic):
  Project Title: project-01-establish-core-feedback-loop
  Project Goal: Implement the minimum viable gameplay loop connecting the core views: Gather Stone in Territory View, initiate Expand Combat, earn persistent Coins from Combat success (e.g., clearing Wave 1), spend Coins in a minimal Management View to unlock basic Stone-to-Pebble crafting, use crafted Pebbles to conquer the first Hex (e.g., clear Wave 1), and have the conquered Hex reveal a better/new Stone node.
-->