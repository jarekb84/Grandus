# User Story: Place Initial Stone Node Visually in Home Hex

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](./epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

---

## Story Goal

Visually represent the initial, single Stone resource node within the player's home hex, positioned to allow for character movement between it and the Home Base.

---

## Acceptance Criteria

*   Upon entering the Territory View for the initial game state, all existing resource node entities other than the player's Home Base and the initial Stone resource node are removed.
*   The initial Stone resource node entity is visible on the Territory View map.
*   The Stone node entity is positioned visually within the boundaries of the player's designated home hex (the same hex as the Home Base).
*   The Stone node entity's position within the home hex is offset from the Home Base position, ensuring sufficient visual space for the player character to move between the Home Base and the Stone node.
*   The Stone node entity uses the correct visual asset for a Stone resource node.

---

## Notes / Context

*   This story focuses solely on the visual placement based on hex coordinates and the spatial relationship within the home hex relative to the Home Base. Mechanics (capacity, respawn) are handled in subsequent stories.
*   This story was derived from Epic '01-Targeted-Expansion-And-Resource-Setup' as part of the initial breakdown.
*   **Status:** done

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

---

## Technical Plan

## Detailed Technical Plan: Place Initial Stone Node Visually in Home Hex (Revised)

### 1. Approved Implementation Approach:
*   **Selected Option:** A refined version of Option 3, emphasizing separation of concerns and a more functional approach based on user feedback.
*   **Key Characteristics:** Separate the definition of initial entity data from the logic that calculates their pixel positions and the logic that adds them to the Phaser scene.
*   **User Feedback:** Prioritize reducing coupling between entity definition/position calculation and the `TerritoryScene`. Ensure `generateInitialEntities.ts` is deleted. Aim for a plan that supports future hex-centric logic and is more testable.

### 2. Required Refactoring:
*   Delete the file `src/features/shared/utils/entityGenerator.ts` as its functionality is being replaced and refactored into more specific parts. (Pending Verification)
*   Modify `src/features/core/GameContext.tsx` to remove the import and usage of `generateInitialEntities`. (Pending Verification)
*   Modify `src/features/territory/Territory.scene.ts` to remove the special-case positioning logic for "base1" and "player1" within the `addEntity` method. The `addEntity` method should consistently use the `entity.position.x` and `entity.position.y` provided in the `Entity` object for sprite placement. (Pending Verification)

### 3. Detailed Implementation Steps:
*   **Task 1: Define Initial Entity Data** (Completed)
    *   Create a new file `src/features/territory/initialEntityData.ts`.
    *   Define and export a constant array, e.g., `initialTerritoryEntitiesData`, containing raw data objects for the initial Home Base and the initial Stone node.
    *   Each object in this array should include properties like `id`, `type`, `shape`, `color`, `size`, and importantly, their intended `hexCoords` (e.g., `{ q: 0, r: 0 }` for both Home Base and Stone node).
    *   Include an additional property, e.g., `hexOffsetPixels`, for entities that require a visual offset within their hex. For the Stone node, define a specific `{ x, y }` pixel offset value here. For the Home Base, the offset would be `{ x: 0, y: 0 }`.

*   **Task 2: Create Pure Pixel Position Calculation Utility** (Completed)
    *   Create a new utility file, e.g., `src/features/territory/territoryUtils.ts`.
    *   Import or duplicate the hex-to-pixel conversion logic (the `hexToPixelCoords` method or its core calculation) from `TerritoryScene`.
    *   Define and export a pure function, e.g., `getPixelPositionForEntity(entityData: InitialEntityData, hexSize: number, centerX: number, centerY: number): { x: number, y: number }`.
    *   This function will take an initial entity data object, the hex size, and the scene's center pixel coordinates.
    *   It will calculate the base pixel position for the entity's `hexCoords` using the imported/duplicated hex conversion logic.
    *   It will then add the entity's `hexOffsetPixels` to this base position.
    *   It will return the final calculated pixel coordinates `{ x, y }`. This function is purely computational and testable without a scene instance.

*   **Task 3: Create Entity Conversion Utility**
    *   Create a new utility file, e.g., `src/features/territory/initialEntityConverter.ts`.
    *   Define and export a pure function, e.g., `convertInitialEntityDataToEntity(initialData: InitialEntityData, hexSize: number, centerX: number, centerY: number): Entity`.
    *   This function should import and use `getPixelPositionForEntity` to calculate the pixel position.
    *   It should handle the mapping of properties from `InitialEntityData` to the `Entity` type, including setting initial/placeholder runtime properties (like `health`, `gatheringProperties`, etc.) based on the entity `type`. This logic should be moved out of `GameContext.tsx`.

*   **Task 4: Update GameContext for Initial Placement Orchestration**
    *   In `src/features/core/GameContext.tsx`, ensure the import and usage of the old `generateInitialEntities` is removed. (Pending Verification)
    *   Import the `initialTerritoryEntitiesData` constant from `src/features/territory/initialEntityData.ts`. (Completed)
    *   Import the new `convertInitialEntityDataToEntity` utility function.
    *   In the `ConfiguredTerritoryScene`'s `create` method (within `GameContext.tsx`), after calling `super.create()`, get the necessary parameters for position calculation (hex size, scene center X/Y).
    *   Iterate through the `initialTerritoryEntitiesData` array.
    *   For each `entityData` object, call `convertInitialEntityDataToEntity(entityData, hexSize, centerX, centerY)` to get the scene-ready `Entity` object.
    *   Call `this.addEntity(entity)` and `addEntity(sceneEntity)` (for global state) with the resulting `Entity` object.
    *   Ensure any logic to remove other initial resource node entities is handled here if `initialTerritoryEntitiesData` doesn't represent the *only* entities present initially (based on AC 1). (Pending Verification)

*   **Task 5: Verify Visual Placement (Manual)**
    *   Run the game and verify that only the Home Base and the initial Stone node are visible in the Territory View.
    *   Confirm that the Stone node is visually offset from the Home Base within the home hex, leaving space for character movement.
    *   Verify the Stone node uses the correct visual asset.

### 4. Architectural & Standards Compliance:
*   This refined plan further enhances adherence to the Single Responsibility Principle (`05-architecture-patterns.md`) by separating:
    *   Initial entity data definition (`initialEntityData.ts`).
    *   Pure pixel position calculation (`territoryUtils.ts`).
    *   Conversion of initial data to scene-ready entity objects (`initialEntityConverter.ts`).
    *   Scene orchestration and entity adding (`GameContext.tsx` and `TerritoryScene.addEntity`).
*   The new entity conversion utility will be highly testable.
*   The approach continues to support future hex-centric logic and maintains the feature-based directory structure (`06-directory-structure.md`).

### 5. Testing Guidance:
*   **Manual Verification:** Visually confirm the presence and correct relative positioning of the Home Base and Stone node in the game after implementing the refined plan.

### 6. Dependencies & Integration Points:
*   **Module Dependencies:** `src/features/territory/Territory.scene.ts`, `src/features/core/GameContext.tsx`, `src/features/territory/initialEntityData.ts`, `src/features/territory/territoryUtils.ts`, **new file `src/features/territory/initialEntityConverter.ts`**.
*   **External Dependencies:** None.
*   **New Libraries:** None.

### 7. Complexity Estimate:
*   **Overall Complexity:** Low to Medium (Requires creating a new converter file, modifying `GameContext.tsx`, and verifying previous changes).
*   **Estimated Effort:** 1 day.