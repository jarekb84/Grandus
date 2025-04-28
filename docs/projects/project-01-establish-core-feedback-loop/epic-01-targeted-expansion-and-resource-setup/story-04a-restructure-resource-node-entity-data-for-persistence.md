**Status:** complete
# User Story: Restructure Resource Node Entity Data for Persistence (04a)

**Epic:** [../epic-01-targeted-expansion-and-resource-setup.md](../epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base/node, implement hex selection for Expand Combat, make initial node depletable/respawnable.

---

## Story Goal

Refactor the resource node entity data structure to logically group runtime-configurable properties related to gathering and respawning (e.g., `max capacity`, `current capacity`, `respawn duration`, `respawn capacity increment`, `yield multiplier`, `gathering speed`, `gathering time`). Ensure all these properties are persisted in the game state and update relevant initialization functions (like `initializeNode`) to use the new structure.

---

## Acceptance Criteria

1.  **Data Grouping:** The resource node's persisted data structure includes a logical grouping containing *at least* the following runtime-configurable properties: `maxCapacity`, `currentCapacity`, `respawnDuration`, `respawnCapacityIncrement`, `yieldMultiplier`, `gatheringSpeed`, `gatheringTime`. (Verification: Inspect persisted game state or debug node data).
2.  **Initialization Update:** The primary function responsible for initializing a resource node (e.g., `initializeNode` or equivalent) is updated to accept these grouped properties as input. (Verification: Code inspection or unit test).
3.  **Persistence Correctness:** Saving and then loading the game state correctly restores the *values* of all the properties listed in AC#1 for each resource node. (Verification: Save game, modify values if possible, load game, check values).
4.  **Functional Equivalence:** The observable behavior of resource gathering and the existing basic respawn mechanism remains functionally identical to before this change. (Verification: Gameplay testing - gather from a node, observe depletion, observe basic respawn).

---

## Notes / Context

*   This story is a technical refactoring effort identified as a prerequisite for implementing incremental respawn cycles (Story 04b).
*   It addresses the need to manage and persist several interrelated, runtime-configurable properties identified during the development of Story 04.
*   Architect Recommendation: Implement this story first in the sequence 04a -> 04b -> 04c -> 04d.


## User voice Notes (note these were created before the epic architecture overview was done)
### Summary

This story is a technical refactoring effort to restructure the data associated with a resource node entity. The goal is to group related runtime properties (gathering, respawning) more logically and ensure all configurable runtime properties are properly included and persisted in the game state.

### Current Data Structure and Initialization

*   Currently, the `base entity` may have a sub-property like `gathering properties`.
*   Properties such as `max capacity`, `current capacity`, `respawn duration`, and the new `respawn capacity increment` exist, but their organization might need improvement.
*   The `initializeNode` function currently accepts individual parameters like `node id`, `max cap`, and `current cap`.

### Rationale for Refactoring and Persistence

*   Several properties (`yield multiplier`, `gathering speed`, `gathering time`, `respawn duration`, `respawn capacity increment`) are runtime properties.
*   These properties are all interrelated and affect resource gathering and respawning mechanics.
*   Crucially, all these properties can be configured and changed during runtime.
*   Therefore, all these runtime-configurable properties must be persisted as part of the game state.
*   This also helps me with debugging when I console out to see the current state of a nodes values

### Proposed Data Structure Changes

*   Restructure the `resource node entity` data to better group related properties (e.g., under a single structure like `resource mechanics` or `runtime properties` that encompasses all gathering and respawn-related configurable values).
*   Refactor the `initializeNode` function (and potentially other relevant functions) to accept a single object or structure containing these properties, rather than multiple disparate parameters. This improves the function signature and maintainability.

### Game State Persistence

*   Explicitly ensure that all identified runtime properties (`yield multiplier`, `gathering speed`, `gathering time`, `respawn duration`, `respawn capacity increment`, etc.) are included in the data structure used for persisting the game state.
---

## Embedded Epic Context for Downstream Processing

<!-- ROO CONTEXT - DO NOT MODIFY MANUALLY -->
<!--
Epic Path: ../epic-01-targeted-expansion-and-resource-setup.md
Epic Title: 01-Targeted-Expansion-And-Resource-Setup
Epic Goal Summary: Align home base/node, implement hex selection for Expand Combat, make initial node depletable/respawnable.
Project Context (if available in Epic):
  Project Title: project-01-establish-core-feedback-loop
  Project Goal: Implement core loop: Gather -> Expand Combat -> Coins -> Crafting -> Conquest -> Better Node.
-->

---

## Technical Plan (Story 04a) - Revised (Bifurcation Refactor)

### 1. Approved Implementation Approach:
*   **Selected Option:** Refactor core entity structures to **bifurcate** graphical/visual properties from runtime/mechanics properties. Implement this using an **Inside-Out** approach, tackling Phaser visuals first, then domain store mechanics, and finally the lightweight global state representation.
*   **Key Characteristics:** This involves defining new interfaces (`GraphicalProperties`, `LightweightEntity`), restructuring existing entities (`BaseEntity`, `ResourceNodeEntity`, etc.), updating initial data handling (`initialEntityData`, `initialEntityConverter`), modifying how entities are registered and used in different contexts (`GameContext`, `Territory.scene`, `ResourceNode.store`, `GameState.store`), and updating services/adapters (`GatheringService`, `useTerritoryAdapter`) to source data from the correct, specialized structures.
*   **Rationale:** Addresses identified code smells (SRP violations, inefficient data passing, confusing multi-store lookups) by aligning data structures with their usage context (Phaser visuals vs. domain logic vs. global state). Improves clarity, maintainability, testability, and potentially performance by reducing unnecessary data transfer.
*   **User Feedback:** Incorporates detailed feedback regarding the intermixing of property types, multiple data representations, confusing service logic, and the desire for a structured, incremental refactoring approach (Inside-Out).

### 2. Required Refactoring:
*   This story *is* the refactoring task. The tasks below break down the necessary steps. No prerequisite refactoring outside this story's scope is needed.

### 3. Detailed Implementation Tasks (Thin Vertical Slices - Inside-Out):

*   **Task 1: Refactor for Graphical Properties (Phaser Focus)**
    *   **Status:** complete
    *   **Goal:** Isolate properties needed *only* for visual representation in Phaser and update relevant initialization/scene code.
    *   **Files:**
        *   `src/features/shared/types/entities.ts`
        *   `src/features/territory/initialEntityData.ts`
        *   `src/features/territory/initialEntityConverter.ts`
        *   `src/features/territory/Territory.scene.ts` (or specific scene rendering entities)
        *   `src/features/core/GameContext.tsx`
    *   **Changes:**
        1.  **Define `GraphicalProperties` Interface (`entities.ts`):** Create `interface GraphicalProperties { position: Position; shape: Shape; size: number; color: number; }` (or similar, based on exact needs of the scene).
        2.  **Update `BaseEntity` (`entities.ts`):** Remove `position` and `properties` (shape, size, color). Add `graphical: GraphicalProperties;`. *Alternatively, keep BaseEntity minimal (ID, type) and add `graphical` only to entity types that are visualized.* (Decision: Let's keep `graphical` on `BaseEntity` for now, assuming most entities have a visual representation).
        3.  **Update `initialEntityData.ts`:** Group visual properties (`position`, `shape`, `size`, `color`) under a `graphical` key within the `properties` object for clarity.
        4.  **Update `initialEntityConverter.ts`:** Modify conversion logic (`convertInitialEntityDataToEntity`) to:
            *   Read visual properties from `initialData.properties.graphical`.
            *   Create the `GraphicalProperties` object.
            *   Assign it to the `graphical` field of the returned entity.
            *   *Temporarily*, keep populating the runtime `mechanics` as before (to be addressed in Task 2).
        5.  **Update Scene (`Territory.scene.ts`):** Modify functions that add/update entity visuals (e.g., `addEntityGraphic`, `updateEntityGraphic`) to expect an object containing *only* `id` and `graphical: GraphicalProperties`. Update calls within the scene.
        6.  **Update `GameContext.tsx`:** Modify the part where entities are registered with the Phaser scene (`scene.addEntityGraphic` or similar) to pass only the `id` and the `graphical` property extracted from the converted entity object.
    *   **Vertical Slice Behavior:** Establishes the explicit `GraphicalProperties` structure, updates initial data/conversion for visuals, and modifies the Scene/GameContext interaction to use only visual data for rendering. Runtime mechanics remain temporarily untouched but functional.
    *   **Acceptance Criteria:**
        *   `BaseEntity` contains the `graphical: GraphicalProperties` field. Old visual fields are removed.
        *   `initialEntityData.ts` reflects the grouping under `graphical`.
        *   `initialEntityConverter.ts` correctly populates the `graphical` field.
        *   `Territory.scene.ts` functions related to entity visuals expect and use the `id` and `graphical` properties structure.
        *   `GameContext.tsx` passes only `id` and `graphical` data to the scene registration calls.
        *   Entities are still rendered correctly in the Phaser scene.
        *   Gathering/Respawn mechanics (using old data paths for now) remain functional.
        *   Application compiles, builds, and runs without errors or regressions.

*   **Task 2: Refactor for Runtime Mechanics (ResourceNodeStore Focus)**
    *   **Status:** complete
    *   **Goal:** Consolidate runtime mechanics within the `ResourceNodeStore` and update services to use it as the single source of truth for these properties.
    *   **Files:**
        *   `src/features/shared/types/entities.ts`
        *   `src/features/territory/ResourceNode.store.ts`
        *   `src/features/territory/initialEntityConverter.ts`
        *   `src/features/core/GameContext.tsx`
        *   `src/features/territory/GatheringService.ts`
    *   **Changes:**
        1.  **Update `ResourceNodeEntity` (`entities.ts`):** Ensure it still contains `mechanics: ResourceNodeMechanics`. (Should be unchanged from the previous refactor). Add `nodeType: ResourceNodeType` and `yields: ResourceYield[]` if they logically belong to runtime mechanics (they seem to). *Decision: Keep `nodeType` and `yields` alongside `mechanics` for now.*
        2.  **Update `ResourceNode.store.ts`:**
            *   Modify the store's state structure to hold the *full* `ResourceNodeMechanics`, `nodeType`, and `yields` per node ID.
            *   Rename the internal state slice/interface (e.g., `NodeState`) to potentially `ResourceNodeRuntimeState` or similar, and ensure it matches the required fields (`mechanics`, `nodeType`, `yields`).
            *   Update actions/selectors (`initializeNodeState`, `getNodeState`, `updateNodeCapacity`, etc.) to work with this richer state structure.
        3.  **Update `initialEntityConverter.ts`:** Ensure it continues to correctly populate the `mechanics`, `nodeType`, and `yields` fields on the `ResourceNodeEntity` object returned.
        4.  **Update `GameContext.tsx`:** Modify the part where entities are registered with the `ResourceNodeStore` (`initializeNodeState` or similar) to pass the necessary runtime data (`id`, `mechanics`, `nodeType`, `yields`) extracted from the converted entity.
        5.  **Update `GatheringService.ts`:**
            *   Remove calls fetching partial state (like just capacity) from `ResourceNodeStore`.
            *   Fetch the *complete* runtime state (`ResourceNodeRuntimeState` including `mechanics`, `yields`, `nodeType`) from `ResourceNodeStore` using the node `id`.
            *   Access *all* required runtime properties (`capacity`, `gathering duration`, `yields`, etc.) directly from this fetched state object.
            *   Remove any logic accessing runtime/mechanics properties from the `GameStateStore` version of the entity.
            *   Keep logic accessing graphical properties (like position for `moveEntityTo`) for now (to be addressed in Task 3).
    *   **Vertical Slice Behavior:** Consolidates runtime mechanics within the `ResourceNodeStore`, makes it the single source of truth for these properties, and updates the `GatheringService` to rely solely on this store for mechanics data.
    *   **Acceptance Criteria:**
        *   `ResourceNode.store.ts` stores the full `mechanics`, `nodeType`, and `yields` for each node.
        *   `GameContext.tsx` correctly initializes the `ResourceNodeStore` with this data.
        *   `GatheringService.ts` fetches the complete runtime state from `ResourceNodeStore` and uses it for all mechanics-related logic.
        *   `GatheringService.ts` no longer accesses mechanics data from the `GameStateStore`.
        *   Gathering and respawn mechanics function correctly using data sourced only from `ResourceNodeStore`.
        *   Application compiles, builds, and runs without errors or regressions.

*   **Task 3: Refactor for Lightweight Global State (GameStateStore Focus)**
    *   **Status:** complete
    *   **Goal:** Reduce the main `GameStateStore` to hold only lightweight entity representations (ID, type) and update consumers.
    *   **Files:**
        *   `src/features/shared/types/entities.ts`
        *   `src/features/shared/stores/GameState.store.ts` (Verify path/name)
        *   `src/features/territory/initialEntityConverter.ts`
        *   `src/features/core/GameContext.tsx`
        *   `src/features/territory/GatheringService.ts`
        *   `src/features/core/territory/useTerritoryAdapter.ts` (Verify path/name)
    *   **Changes:**
        1.  **Define `LightweightEntity` Interface (`entities.ts`):** Create `interface LightweightEntity { id: string; type: EntityType; }`.
        2.  **Update `GameState.store.ts`:** Modify the store's state (e.g., the `entities` map/array) to store only `LightweightEntity` objects. Update actions/selectors accordingly.
        3.  **Update `initialEntityConverter.ts`:** Modify it to return *multiple* representations if necessary, or adjust `GameContext` to create the lightweight version. *Decision: Let `GameContext` create the lightweight version after conversion to avoid converter complexity.*
        4.  **Update `GameContext.tsx`:**
            *   After calling `convertInitialEntityDataToEntity`, create a `LightweightEntity` object containing only the `id` and `type` from the converted entity.
            *   Register *this* `LightweightEntity` object with the `GameState.store.ts`.
        5.  **Update `GatheringService.ts`:**
            *   Ensure it uses the `GameStateStore` *only* to find the `id` and `type` of the target node.
            *   Remove any access to `graphical` or `mechanics` properties from the object retrieved from `GameStateStore`.
            *   Refactor movement logic: Instead of accessing position directly, call a scene service/method like `scene.moveEntityToNode(playerId, targetNodeId)` which handles the position lookup internally based on IDs. This removes the need for the service to know graphical details. (This might require changes in `Territory.scene.ts` as well).
        6.  **Update `useTerritoryAdapter.ts`:** Modify functions like `findNearestNode` to expect and work with the `LightweightEntity` structure from the `GameStateStore`.
    *   **Vertical Slice Behavior:** Reduces the global `GameStateStore` to lightweight entities, updates initialization, and modifies consumers (`GatheringService`, `useTerritoryAdapter`) to use this store only for existence/ID/type lookups. Movement logic is abstracted.
    *   **Acceptance Criteria:**
        *   `GameState.store.ts` stores only `LightweightEntity` objects.
        *   `GameContext.tsx` correctly initializes `GameStateStore` with lightweight data.
        *   `GatheringService.ts` uses `GameStateStore` only for ID/type lookup.
        *   `GatheringService.ts` uses an abstracted scene method (e.g., `moveEntityToNode`) for movement, removing its need for positional data.
        *   `useTerritoryAdapter.ts` functions correctly with `LightweightEntity` data.
        *   The overall system remains integrated and functional.
        *   Application compiles, builds, and runs without errors or regressions.

### 4. Architectural & Standards Compliance:
*   **State Separation:** Significantly improved by aligning store content with responsibility (Phaser visuals vs. Node mechanics vs. Global existence).
*   **SRP:** Enforced by splitting the monolithic entity object into `GraphicalProperties`, `RuntimeMechanics`, and `LightweightEntity` concerns. Services access only the data they need from the appropriate source.
*   **Functional Design:** Services like `GatheringService` become cleaner by relying on dedicated stores and abstracted scene interactions (like movement).
*   **Directory Structure:** Changes occur within expected features/shared areas.
*   **Development Practices:** Follows "Thin Vertical Slices" and "Inside-Out Refactoring" for manageable, verifiable changes.

### 5. Testing Guidance:
*   **Unit Tests:**
    *   Verify `initialEntityConverter.ts` still correctly populates `graphical` and `mechanics` (Tasks 1 & 2).
    *   Verify store actions/reducers in `ResourceNode.store.ts` and `GameState.store.ts` handle the new structures correctly (Tasks 2 & 3).
*   **Integration Tests:**
    *   Test data flow: initial -> conversion -> GameContext registration -> Store states.
    *   Test `GatheringService` interaction with `ResourceNodeStore` and `GameStateStore` (Tasks 2 & 3).
    *   Test Scene rendering based on `GraphicalProperties` (Task 1).
    *   Test `useTerritoryAdapter` interaction with `GameStateStore` (Task 3).
*   **Manual Verification:**
    *   **Task 1:** Confirm entities render correctly.
    *   **Task 2:** Confirm gathering/respawn mechanics work, sourcing data from `ResourceNodeStore`. Use state visualizer to confirm store content.
    *   **Task 3:** Confirm overall game loop functions. Use state visualizer to confirm `GameStateStore` holds only lightweight data. Confirm `findNearestNode` works. Confirm entity movement works via abstracted calls.

### 6. Dependencies & Integration Points:
*   **Module Dependencies:** High impact across `shared/types`, `shared/stores`, `core`, `territory` features. Affects entity definition, initialization, state management, scene rendering, services, and adapters.
*   **External Dependencies:** None.
*   **New Libraries:** None.

### 7. Complexity Estimate:
*   **Overall Complexity:** High (Significant structural refactoring impacting core data flow and multiple system layers).
*   **Estimated Effort:** Medium-Large (Requires careful, staged implementation across several files per task).