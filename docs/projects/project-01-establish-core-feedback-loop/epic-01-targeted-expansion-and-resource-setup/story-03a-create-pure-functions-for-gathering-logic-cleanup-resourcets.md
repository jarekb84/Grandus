# User Story: Create Pure Functions for Gathering Logic & Clean Up Resource.ts

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](./epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*
**Status:** done

---

## Story Goal

Create pure utility functions (e.g., in a new `features/territory/gatheringUtils.ts`) for essential gathering calculations (`findNearestNodeOfType`, `calculateYield`) based on the *currently active logic* in `Territory.scene.ts`. Remove the unused `ResourceSystem` class and delete the `features/territory/Resource.ts` file.

---

## Acceptance Criteria

*   A new file named `src/features/territory/gatheringUtils.ts` is created.
*   The `gatheringUtils.ts` file contains a pure function `findNearestNodeOfType` with the signature `(position: {x: number, y: number}, resourceType: ResourceType, allNodes: ResourceNodeEntity[]) => ResourceNodeEntity | null`.
*   The implementation of `findNearestNodeOfType` correctly reflects the logic used in `Territory.scene.ts::initiateGathering` to find the closest node of the specified type.
*   The `gatheringUtils.ts` file contains a pure function `calculateYield` with the signature `(nodeData: ResourceNodeEntity, requestedType: ResourceType) => ResourceType[]`.
*   The implementation of `calculateYield` reflects the *current simple behavior* observed in `Territory.scene.ts` (returns a fixed yield of `[requestedType]`), ignoring the `nodeData` for now.
*   The `ResourceSystem` class definition is removed from the `features/territory/Resource.ts` file.
*   All code exclusively related to the `ResourceSystem` (e.g., imports, helper functions only used by it) is removed from `features/territory/Resource.ts`.
*   The `features/territory/Resource.ts` file is deleted as it becomes empty.
*   *(Note: Unit tests are deferred for now during the prototyping phase).*
*   *(Note: The actual usage of these new utility functions within `Territory.scene.ts` will be handled in Story 03b).*

---

## Notes / Context

*   This is a technical prerequisite story identified during architectural review (post-Story 2).
*   **Goal:** Addresses dead code (`Resource.ts`) and extracts reusable logic from the *active* gathering implementation (`Territory.scene.ts`) into pure functions, improving testability and adhering to Functional Design preferences. Sets the stage for extracting orchestration logic (Story 03b).
*   **Architect Feedback (Revised):**
    *   Create pure utility functions in `features/territory/gatheringUtils.ts`.
    *   Base `findNearestNodeOfType` logic on the implementation within `Territory.scene.ts::initiateGathering`.
    *   Implement `calculateYield` to match the *current* simple yield behavior in `Territory.scene.ts` (fixed yield), not the dead code in `Resource.ts`.
    *   Remove the unused `ResourceSystem` class and delete `Resource.ts`.
    *   Defer unit tests for now.
*   This story was derived from Epic '01-Targeted-Expansion-And-Resource-Setup'.

---

## Technical Plan (Revised based on Code Analysis)

### 1. Approved Implementation Approach:
*   **Selected Option:** Direct refactoring based on *active* code analysis. Extract pure functions from `Territory.scene.ts` logic, remove dead code from `Resource.ts`.
*   **Key Characteristics:** Aligns with Functional Design principles, targets actual implementation, removes dead code.
*   **User Feedback:** Plan revised based on user feedback regarding active logic location and removal of unit test requirements.

### 2. Required Refactoring:
*   The entire story constitutes refactoring. No *additional* refactoring is required before starting these tasks.

### 3. Detailed Implementation Tasks (Thin Vertical Slices):
*   [COMPLETED] **Task 1: Create `gatheringUtils.ts` and Implement `findNearestNodeOfType`**
    *   **Files:**
        *   Create `src/features/territory/gatheringUtils.ts`
    *   **Changes:**
        *   In `gatheringUtils.ts`, define and export the `findNearestNodeOfType` function with the signature `(position: {x: number, y: number}, resourceType: ResourceType, allNodes: ResourceNodeEntity[]) => ResourceNodeEntity | null`.
        *   Implement the logic by adapting the node searching/distance calculation code found within `Territory.scene.ts::initiateGathering`, ensuring it operates solely on the provided arguments.
    *   **Vertical Slice Behavior:** Provides a pure utility function for finding the nearest resource node based on active game logic.
    *   **Integration Points:** None in this task (function is created but not yet used).
    *   **Acceptance Criteria:**
        *   `gatheringUtils.ts` created.
        *   `findNearestNodeOfType` function implemented correctly based on `Territory.scene.ts` logic.
        *   Application compiles and runs without errors or regressions.

*   [COMPLETED] **Task 2: Implement `calculateYield` Pure Function**
    *   **Files:**
        *   Modify `src/features/territory/gatheringUtils.ts`
    *   **Changes:**
        *   In `gatheringUtils.ts`, define and export the `calculateYield` function with the signature `(nodeData: ResourceNodeEntity, requestedType: ResourceType) => ResourceType[]`.
        *   Implement the function to return `[requestedType]`, matching the current simple yield behavior observed in `Territory.scene.ts` (line 3347). Ignore the `nodeData` parameter for this implementation.
    *   **Vertical Slice Behavior:** Provides a pure utility function reflecting the current simple resource yield mechanism.
    *   **Integration Points:** None in this task.
    *   **Acceptance Criteria:**
        *   `calculateYield` function implemented correctly based on current behavior.
        *   Application compiles and runs without errors or regressions.

*   [COMPLETED] **Task 3: Remove `ResourceSystem` Class and Delete `Resource.ts`**
    *   **Files:**
        *   Modify `src/features/territory/Resource.ts` (to empty it)
        *   Delete `src/features/territory/Resource.ts`
    *   **Changes:**
        *   Remove the entire `ResourceSystem` class definition and all related imports/code from `Resource.ts`.
        *   Delete the now-empty `src/features/territory/Resource.ts` file.
    *   **Vertical Slice Behavior:** Removes dead code and simplifies the codebase.
    *   **Integration Points:** Verify no other parts of the codebase were importing or using `ResourceSystem`.
    *   **Acceptance Criteria:**
        *   `ResourceSystem` class and all content removed from `Resource.ts`.
        *   `src/features/territory/Resource.ts` file is deleted.
        *   Application compiles and runs without errors or regressions (verifying the class was indeed unused).

### 4. Architectural & Standards Compliance:
*   The plan adheres to `05-architecture-patterns.md` (Functional Design & Testability).
*   The plan adheres to `06-directory-structure.md`.
*   No deviations noted.

### 5. Testing Guidance:
*   Unit tests are deferred for this story as per user feedback during the prototyping phase. Manual verification after Task 3 is recommended.

### 6. Dependencies & Integration Points:
*   **Module Dependencies:** `gatheringUtils.ts` will depend on shared types (`ResourceNodeEntity`, `ResourceType`).
*   **External Dependencies:** None.
*   **New Libraries:** None.

### 7. Complexity Estimate:
*   **Overall Complexity:** Low
*   **Estimated Effort:** Small (code extraction, deletion)

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