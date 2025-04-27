# User Story: Extract Gathering Orchestration from Territory Scene

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](./epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

---

**status: completed**

---

## Story Goal

Create a new `GatheringService` (or similar logic, perhaps within the adapter) responsible solely for orchestrating the gathering sequence (find node, move player, interact with node state, handle wait, move player back, trigger gain). Modify `Territory.scene.ts` and `useTerritoryAdapter` to use this new service, removing the orchestration logic from the scene **incrementally and safely, including cleanup of related event wiring**.

---

## Acceptance Criteria

1.  A new module/service (e.g., `GatheringService`) is created to handle the gathering orchestration sequence (move, wait, move back, return result).
2.  The orchestration logic within the new module/service correctly performs the following sequence:
    a.  Initiates player movement towards the found node by calling `Territory.scene.ts::moveEntityTo`, when invoked.
    b.  Includes a logic stub or interface point for future Node State interaction.
    c.  Handles the gathering duration/wait time.
    d.  Initiates player movement back to their starting position.
    e.  Returns yield information (success/failure, type, amount) to the caller.
3.  The `initiateGathering` method within `Territory.scene.ts` is **removed** after the refactoring is complete and verified.
4.  The `useTerritoryAdapter` is updated to:
    a. Use `findNearestNodeOfType` to locate the target node.
    b. Invoke the new gathering orchestration service/module directly, passing the target node.
    c. Receive yield information back from the service.
    d. Update the resource store based on the received yield (e.g., by calling `useResourcesStore().addResource`).
5.  The `onResourceGathered` event callback mechanism (previously wired from `GameContext` to `TerritoryScene`) is removed as the adapter now handles the resource update directly.
6.  The end-to-end gathering process functions identically from the user's perspective *at each step* of the refactoring and after completion.
7.  The `Territory.scene.ts` file no longer contains any gathering orchestration logic or related event callbacks.

---

## Notes / Context

*   This is a technical prerequisite story identified during architectural review (post-Story 2).
*   **Goal:** Addresses the SRP violation in `Territory.scene.ts` by extracting the complex gathering orchestration. Creates a dedicated place for this logic, improving maintainability and preparing for the integration of node state management (Story 03).
*   Depends on the pure gathering functions created in Story 03a.
*   **Architect Feedback (Original):** Create a new `GatheringService`... *(Original plan details omitted)*
*   **User Feedback (Leading to Revised Plan v1):** Concerns about regression risk. Proposed a safer, incremental "vertical slice" approach: 1) Leverage utils in scene, verify. 2) Extract logic to service, make scene a pass-through, verify. 3) Update adapter to call service, remove scene pass-through, verify.
*   **User Feedback (Leading to Revised Plan v2):** Pointed out that plan v1 left the `onResourceGathered` event wiring from `GameContext` as dead code. Plan updated to include cleanup of this mechanism in Task 3.
*   This story was derived from Epic '01-Targeted-Expansion-And-Resource-Setup'.

---

## Technical Plan (Revised v2 based on User Feedback)

### 1. Approved Implementation Approach:
*   **Selected Option:** Option 1: Dedicated `GatheringService.ts`, implemented via incremental vertical slices, including cleanup of old event wiring.
*   **Key Characteristics:** Refactor gathering logic out of `Territory.scene.ts` into `GatheringService.ts` through small, verifiable steps. Update the adapter to call the service and handle resource updates directly. Clean up the unused `onResourceGathered` event mechanism.
*   **User Feedback:** Initial plan revised based on user feedback regarding vertical slicing and regression risk. Second revision incorporates user feedback regarding cleanup of the `onResourceGathered` event wiring.

### 2. Required Refactoring:
*   Incremental refactoring of gathering logic from `Territory.scene.ts` to `GatheringService.ts`, followed by cleanup.

### 3. Detailed Implementation Tasks (Revised v2 Vertical Slices):

*   **[x] Task 1: Leverage `findNearestNodeOfType` Utility within `Territory.scene.ts`**
    *   **Goal:** Replace the internal node-finding logic in the scene with the existing utility function, verifying this isolated change first.
    *   **Files:** Modify `src/features/territory/Territory.scene.ts`.
    *   **Changes:**
        1. Import `findNearestNodeOfType`, `ResourceNodeEntity`, `Entity`, `EntityType`.
        2. Inside `initiateGathering`, extract `allNodeData`.
        3. Replace the node-finding loop with a call to `findNearestNodeOfType`.
        4. Adjust subsequent logic to use `nearestNode` instead of `targetNodeSprite`.
        5. Keep existing move/wait/callback logic within `initiateGathering`.
    *   **Vertical Slice Behavior:** Scene orchestrates, uses utility for finding.
    *   **Integration Points:** `Territory.scene.ts` uses `gatheringUtils.ts`.
    *   **Acceptance Criteria:**
        1. Node-finding loop replaced by utility call.
        2. Manual Verification: Gathering works end-to-end (move, wait, back, resource increment).
        3. Application compiles and runs.

*   **[x] Task 2: Extract Orchestration to `GatheringService`, Scene Becomes Pass-through**
    *   **Goal:** Move core movement/wait logic to the service, make the scene method call the service, verify extraction via scene pass-through.
    *   **Files:**
        *   Create `src/features/territory/GatheringService.ts`.
        *   Modify `src/features/territory/Territory.scene.ts`.
    *   **Changes (`GatheringService.ts`):**
        1. Create file, define `orchestrateGathering`.
        2. Signature: Takes `playerId`, `resourceType`, `targetNode`, `scene`.
        3. Return type: `Promise<OrchestrationResult>` (defined as `{ gathered: true; resourceType: ResourceType; amount: number } | { gathered: false }`).
        4. Implementation: `moveEntityTo` node, `TODO` for state check, `delayedCall`, `moveEntityTo` home.
        5. **Crucially, still call `scene.sceneEvents.onResourceGathered?.(resourceType, yieldAmount);` in this step.**
        6. Return `{ gathered: true, resourceType: resourceType, amount: yieldAmount }` on success, `{ gathered: false }` on failure/error.
    *   **Changes (`Territory.scene.ts`):**
        1. Import `orchestrateGathering`.
        2. Modify `initiateGathering`: Keep node finding logic, replace move/wait/callback logic with a call `void orchestrateGathering({ ..., scene: this });`.
    *   **Vertical Slice Behavior:** Scene finds node, calls service for orchestration. Scene's event *still* handles resource update. Adapter still calls scene.
    *   **Integration Points:** Scene calls GatheringService.
    *   **Acceptance Criteria:**
        1. `GatheringService.ts` contains orchestration logic, including the scene event call.
        2. `Territory.scene.ts::initiateGathering` calls the service.
        3. Manual Verification: Gathering works end-to-end identically to Task 1.
        4. Application compiles and runs.

*   **[x] Task 3: Update Adapter to Call Service Directly, Handle Update, Remove Scene Method & Cleanup Wiring**
    *   **Goal:** Change entry point to Adapter -> Service. Adapter handles resource update. Remove scene method *and* the unused `onResourceGathered` event wiring.
    *   **Files:**
        *   Modify `src/features/core/territory/useTerritoryAdapter.ts`.
        *   Modify `src/features/territory/GatheringService.ts`.
        *   Modify `src/features/territory/Territory.scene.ts`.
        *   Modify `src/features/core/GameContext.tsx`.
    *   **Changes (`GatheringService.ts`):**
        1.  Modify `orchestrateGathering`: **Remove** the line `scene.sceneEvents.onResourceGathered?.(resourceType, yieldAmount);`. The service now only returns the result.
    *   **Changes (`useTerritoryAdapter.ts`):**
        1.  Import `orchestrateGathering`, `useResources`, `findNearestNodeOfType`, types.
        2.  Get `addResource`.
        3.  Modify `gatherResource`:
            *   Remove call to `scene.initiateGathering`.
            *   Define `handleResourceGathered` callback using `addResource`.
            *   Inside `try` block: Get player pos, extract `allNodeData`, call `findNearestNodeOfType`.
            *   If `nearestNode`: Call `const result = await orchestrateGathering(...)`.
            *   If `result.gathered`: Call `handleResourceGathered(result.resourceType, result.amount)`.
            *   Handle `!nearestNode` and `!result.gathered` cases.
            *   Manage `isGathering` state with `finally`.
    *   **Changes (`Territory.scene.ts`):**
        1.  Delete the entire `initiateGathering` method.
        2.  In `MainSceneEvents` interface (line ~2995): Remove the `onResourceGathered?: (resourceType: ResourceType, amount: number) => void;` line.
        3.  In constructor (line ~3019): Verify if `onEntityInteraction` or `onPlayerHealthChanged` are still needed. If other events ARE used, keep `this.sceneEvents = events` but the `onResourceGathered` property will simply be ignored. Otherwise, consider removing the assignment/parameter.
        4.  Remove imports only used by the deleted `initiateGathering`.
    *   **Changes (`GameContext.tsx`):**
        1.  Remove the `handleResourceGathered` function definition (lines ~1694-1700).
        2.  In the `ConfiguredTerritoryScene` constructor call (line ~1741), remove the `onResourceGathered: handleResourceGathered,` property from the passed event object.
    *   **Vertical Slice Behavior:** Adapter finds node, calls service, handles update via store hook. Scene method is gone. Unused event wiring is removed.
    *   **Integration Points:** Adapter -> Utils, Adapter -> Service -> Scene Methods, Adapter -> Resource Store. `GameContext` no longer wires `onResourceGathered` to `TerritoryScene`.
    *   **Acceptance Criteria:**
        1. Adapter correctly calls service and updates store.
        2. `TerritoryScene::initiateGathering` is removed.
        3. `onResourceGathered` callback and associated wiring in `Territory.scene.ts` (`MainSceneEvents`, constructor usage) and `GameContext.tsx` (function definition, constructor argument) are removed.
        4. Manual Verification: Gathering works end-to-end via Adapter -> Service path.
        5. Application compiles and runs without errors.

### 4. Architectural & Standards Compliance:
*   **Adherence:** Follows incremental "vertical slice" refactoring, improves SRP, adheres to directory structure, incorporates user feedback, includes cleanup of unused code/wiring.
*   **Deviations:** None noted.

### 5. Testing Guidance:
*   **Unit Tests:** Focus on `GatheringService.ts` (mocking scene) and `gatheringUtils.ts`.
*   **Integration Tests:** Not applicable.
*   **Manual Verification:** CRITICAL at *each* task completion step.

### 6. Dependencies & Integration Points:
*   **Task 1:** Scene -> gatheringUtils
*   **Task 2:** Scene -> GatheringService -> Scene Methods & Events
*   **Task 3:** Adapter -> gatheringUtils, Adapter -> GatheringService -> Scene Methods, Adapter -> Resource Store. `GameContext` link removed.
*   **External Dependencies:** None new.
*   **New Libraries:** None.

### 7. Complexity Estimate:
*   **Overall Complexity:** Medium
*   **Estimated Effort:** Small-Medium

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