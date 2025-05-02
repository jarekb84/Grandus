STATUS: completed
TASKS_PENDING: []
## Technical Story: Refactor Gathering Logic & Decouple Scene Visuals

**Goal:** Stabilize the resource gathering functionality, fix identified bugs and hardcoded values, and decouple the TerritoryScene's visual updates from direct store knowledge, addressing SRP violations.

**User Impact:** Gathering buttons will correctly reflect resource availability. Gathering different resource types (beyond stone) will function correctly. Visual inconsistencies (colors/tints) on resource nodes should be resolved.

**Acceptance Criteria:**

*   Gathering buttons in the Territory UI are disabled if no suitable, available nodes exist for the corresponding resource type.
*   Clicking an enabled "Gather" button successfully initiates gathering for the *correct* resource type by targeting the nearest available node that yields that resource.
*   Visual states (e.g., normal, depleted, respawning) for resource nodes are correctly displayed according to their actual state, and these visuals do not interfere with the node's base appearance (e.g., color).
*   The application compiles and runs without errors or regressions related to resource gathering or node visualization after each task in the plan.

## Notes / Implementation Details (Updated based on Plan)

*   The `TerritoryScene` should no longer directly subscribe to or read internal state from `ResourceNodeStore`. **(DEFERRED - Marked with TODO in Task G)**
*   Update `GatheringService`:
    *   Replace hardcoded `homeBaseId`. **(DEFERRED - Marked with TODO in Task H)**
    *   Extract yield calculation logic. **(INCLUDE - Task E)**
*   Update `ResourceNode.store.ts`:
    *   Replace hardcoded `playerId`. **(DEFERRED - Marked with TODO in Task H for `useTerritoryAdapter.ts`)**
    *   Implement `hasAvailableNodeType` check. **(INCLUDE - Task F)**
*   Refactor state management:
    *   Move `isRespawning` and `respawnEndTime` into `mechanics.respawn`. **(INCLUDE - Task A)**
    *   Move `yields` data into `mechanics.gathering`. **(INCLUDE - Task B)**
    *   Separate `currentCapacity` from `maxCapacity`. **(INCLUDE - Task C)**
*   Improve `InitialEntityData`: Use named constants/enums for colors. **(INCLUDE - Task D)**
*   Update `convertInitialEntityDataToEntity` for new structure. **(INCLUDE - Tasks A, B, C, D modify this)**
*   Verify `gatheringUtils`. **(INCLUDE - Task E modifies this)**

## Detailed Technical Plan: Technical Story: Refactor Gathering Logic & Decouple Scene Visuals (Revised Post-Repomix)

### 1. Approved Implementation Approach:
*   **Selected Option:** Concept-Based Data Structure Refactoring (Based on User Feedback & Repomix Review).
*   **Key Characteristics:** This plan focuses on refactoring specific data concepts (`respawn`, `yields`, `capacity`, `colors`) one at a time. Each task modifies the data structure definition AND updates *all* known usages of that specific structure across the codebase (`store`, `services`, `converter`, `scene`, `adapter`) to ensure the application compiles and runs after each task. Major decoupling and resolution of hardcoded IDs are deferred and marked with TODOs.
*   **User Feedback:** Plan revised based on user feedback requiring tasks to be structured around single data concepts, ensuring each task is complete and leaves the application in a verifiable state.
*   **Repomix Confirmation:** Full codebase review confirmed the affected files and interactions, validating the concept-based task structure.

### 2. Required Refactoring (Conceptual Breakdown):
*   Move respawn-related properties (`isRespawning`, `respawnEndTime`) into `mechanics.respawn`.
*   Move yield-related properties (`yields`) into `mechanics.gathering` (or similar).
*   Separate dynamic capacity (`currentCapacity`) from static capacity (`mechanics.capacity.max`).
*   Replace hardcoded colors with constants/enums.
*   Extract pure yield calculation logic.
*   Implement UI availability check.
*   Mark deferred items (scene coupling, hardcoded IDs) with TODOs.

### 3. Detailed Implementation Tasks (Concept-Based Vertical Slices):

*   **Task A: Refactor Respawn Properties (`isRespawning`, `respawnEndTime`)**
    *   **Concept:** Consolidate respawn state into `mechanics.respawn`.
    *   **Files:**
        *   `src/features/shared/types/entities.ts`
        *   `src/features/territory/ResourceNode.store.ts`
        *   `src/features/territory/initialEntityConverter.ts`
        *   `src/features/territory/GatheringService.ts`
        *   `src/features/territory/RespawnService.ts`
        *   `src/features/territory/Territory.scene.ts`
    *   **Changes:**
        1.  **Interfaces (`entities.ts`):** Move `isRespawning: boolean`, `respawnEndTime: number | null` from the main node state interface definition into `NodeRespawnMechanics`.
        2.  **Store Definition (`ResourceNode.store.ts`):** Update the `ResourceNodeState` interface (previously `ResourceNodeRuntimeState`) to remove root-level respawn props and update the type of the `nodeStates` map. Rename interface to `ResourceNodeState`.
        3.  **Converter (`initialEntityConverter.ts`):** Update logic to populate `mechanics.respawn.isRespawning = false` and `mechanics.respawn.respawnEndTime = null` during conversion.
        4.  **Store Actions (`ResourceNode.store.ts`):** Update `startRespawn` and `finishRespawn` actions to read/write `isRespawning` and `respawnEndTime` within `mechanics.respawn`.
        5.  **Gathering Service (`GatheringService.ts`):** Update logic checking `isRespawning` to read from `nodeState.mechanics.respawn.isRespawning`.
        6.  **Respawn Service (`RespawnService.ts`):** Update store subscription logic to read `isRespawning` and `respawnEndTime` from `nodeState.mechanics.respawn`.
        7.  **Territory Scene (`Territory.scene.ts`):** Update `updateNodeVisuals` to read `isRespawning` from `nodeState.mechanics.respawn.isRespawning` when determining visual state.
    *   **Vertical Slice Behavior:** All code related to respawn status now consistently uses the nested `mechanics.respawn` structure.
    *   **Acceptance Criteria:** Application compiles and runs. Respawn logic (timing, state changes) functions correctly. Node visuals correctly reflect respawning state based on the new data location. All references to `isRespawning`/`respawnEndTime` point to `mechanics.respawn`.

*   **Task B: Refactor Yield Properties (`yields`)**
    *   **Concept:** Consolidate yield definition into `mechanics.gathering`.
    *   **Files:**
        *   `src/features/shared/types/entities.ts`
        *   `src/features/territory/ResourceNode.store.ts`
        *   `src/features/territory/initialEntityConverter.ts`
        *   `src/features/territory/GatheringService.ts`
    *   **Changes:**
        1.  **Interfaces (`entities.ts`):** Move `yields: ResourceYield[]` from the main node state interface definition into `NodeGatheringMechanics` (or a new `NodeYieldMechanics` within `ResourceNodeMechanics`).
        2.  **Store Definition (`ResourceNode.store.ts`):** Update `ResourceNodeState` interface to remove root-level `yields` and update the type of the `nodeStates` map.
        3.  **Converter (`initialEntityConverter.ts`):** Update logic to populate `mechanics.gathering.yields` (or similar) during conversion.
        4.  **Gathering Service (`GatheringService.ts`):** Update logic to read `yields` from `nodeState.mechanics.gathering.yields` (or similar) for calculations.
    *   **Vertical Slice Behavior:** All code related to node yields now consistently uses the nested `mechanics.gathering` (or similar) structure.
    *   **Acceptance Criteria:** Application compiles and runs. Gathering yield calculations use the correct yield data from the new location.

*   **Task D: Refactor Initial Colors (`initialEntityData.ts`)**
    *   **Concept:** Use constants/enums for colors instead of raw values.
    *   **Files:**
        *   `src/features/territory/initialEntityData.ts`
        *   `src/features/territory/initialEntityConverter.ts`
    *   **Changes:**
        1.  **Initial Data (`initialEntityData.ts`):** Define constants/enums (e.g., `NODE_COLORS.STONE = 0x...`) and replace raw hex codes in the data array with these constants/enums.
        2.  **Converter (`initialEntityConverter.ts`):** Update logic to use the new color constants/enums when setting `graphical.color`.
    *   **Vertical Slice Behavior:** Color definitions are centralized and consistently referenced.
    *   **Acceptance Criteria:** Application compiles and runs. Nodes are initialized with the correct colors defined by the constants/enums.

*   **Task E: Extract Yield Calculation Logic**
    *   **Concept:** Isolate yield calculation into pure functions.
    *   **Files:**
        *   `src/features/territory/GatheringService.ts`
        *   `src/features/territory/gatheringUtils.ts` (or new `yieldUtils.ts`)
    *   **Changes:**
        1.  **Utils (`gatheringUtils.ts` or new):** Create pure function(s) like `calculateYieldAmount(yields: ResourceYield[], resourceType: ResourceType, yieldMultiplier: number): number`.
        2.  **Gathering Service (`GatheringService.ts`):** Remove the inline yield calculation logic within `orchestrateGathering` and replace it with a call to the new utility function. Ensure the necessary data (yields array, type, multiplier) is passed correctly (reading `yields` from its location determined by Task B).
    *   **Vertical Slice Behavior:** Yield calculation logic is now encapsulated in a testable, reusable function.
    *   **Acceptance Criteria:** Application compiles and runs. Gathering yields the correct amount, calculated by the extracted function.

*   **Task F: Implement Node Availability Check**
    *   **Concept:** Provide a way for the UI layer to check if gathering is possible for a resource type.
    *   **Files:**
        *   `src/features/territory/ResourceNode.store.ts`
        *   `src/features/core/territory/useTerritoryAdapter.ts`
        *   `src/features/territory/TerritoryActions.tsx`
    *   **Changes:**
        1.  **Store (`ResourceNode.store.ts`):** Add a new selector function, e.g., `hasAvailableNodeType(resourceType: ResourceNodeType): boolean`. This function iterates through `get().nodeStates` and returns `true` if it finds at least one node where `nodeState.nodeType === resourceType` AND `nodeState.currentCapacity > 0` (reading `currentCapacity` from its location determined by Task C).
        2.  **Adapter (`useTerritoryAdapter.ts`):** Expose the new `hasAvailableNodeType` selector. Remove the TODO comment regarding this.
        3.  **UI Layer (`TerritoryActions.tsx`):** Use the adapter's `hasAvailableNodeType` function (passed as prop) to dynamically set the `disabled` prop on gathering buttons. *Self-correction: The prop is already passed but needs to be used.* Update the `disabled` logic for buttons.
    *   **Vertical Slice Behavior:** UI gathering buttons accurately reflect whether gathering is possible based on node type and current capacity.
    *   **Acceptance Criteria:** Application compiles and runs. Gathering buttons are correctly enabled/disabled based on the availability logic implemented in the store selector and used in the UI component.

*   **Task G: Mark Scene Coupling Deferral**
    *   **Concept:** Explicitly mark the known technical debt regarding scene/store coupling.
    *   **Files:** `src/features/territory/Territory.scene.ts`
    *   **Changes:** Add a prominent `// TODO: Decouple scene from direct ResourceNodeStore access (Deferred from story-04a1)` comment near the `subscribeToNodeStore` and `updateNodeVisuals` methods if not already present.
    *   **Vertical Slice Behavior:** Technical debt is documented in the code.
    *   **Acceptance Criteria:** Application compiles and runs. The specified TODO comment exists in `Territory.scene.ts`.

*   **Task H: Mark Hardcoded ID Deferral**
    *   **Concept:** Explicitly mark the known technical debt regarding hardcoded IDs.
    *   **Files:** `src/features/territory/GatheringService.ts`, `src/features/core/territory/useTerritoryAdapter.ts`
    *   **Changes:**
        *   In `GatheringService.ts`: Add `// TODO: Resolve hardcoded homeBaseId 'base1' (Deferred from story-04a1)` near the final `moveEntityTo` call if not already present.
        *   In `useTerritoryAdapter.ts`: Add `// TODO: Resolve hardcoded playerId 'player1' (Deferred from story-04a1)` near the `const playerId = "player1";` line if not already present.
    *   **Vertical Slice Behavior:** Technical debt is documented in the code.
    *   **Acceptance Criteria:** Application compiles and runs. The specified TODO comments exist in `GatheringService.ts` and `useTerritoryAdapter.ts`.

### 4. Architectural & Standards Compliance:
*   Aligns with user feedback for concept-based, verifiable tasks.
*   Improves data structure clarity and grouping (indirectly supporting SRP).
*   Follows incremental change principles (`.roo/rules/02-development-practices.md`), ensuring each task results in a working state.
*   Extracts pure calculation logic (`calculateYieldAmount`) improving testability (`05-architecture-patterns.md` - Functional Design).
*   Explicitly marks deferred technical debt (coupling, hardcoding).

### 5. Testing Guidance:
*   **Unit Tests:** Test the extracted `calculateYieldAmount` function and the `hasAvailableNodeType` store selector. Update any affected store/service unit tests after each relevant task.
*   **Manual Verification (After EACH task):**
    *   Confirm the application compiles and runs without errors.
    *   Briefly verify the specific functionality related to the completed task (e.g., after Task A, check respawn visuals/timing; after Task C, check depleted visuals/gathering stop; after Task F, check button states).
    *   Perform more thorough end-to-end testing after all tasks are complete (gathering different types, full respawn cycles, visual states).

### 6. Dependencies & Integration Points:
*   Changes are mostly contained within `territory` feature and `shared/types`, but each task requires careful identification of *all* usage points for the specific concept being refactored. UI adapter/components are affected by Task F.

### 7. Complexity Estimate:
*   **Overall Complexity:** Medium (Risk lowered due to safer task breakdown). Requires diligence in finding all references for each task but avoids complex pattern changes.