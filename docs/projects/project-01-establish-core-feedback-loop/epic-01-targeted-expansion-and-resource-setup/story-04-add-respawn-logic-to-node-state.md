**Status:** complete

# User Story: Add Respawn Logic to Node State

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](./epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

---

## Story Goal

Add respawn timing and logic to the resource node system, allowing nodes with less than their maximum capacity to begin replenishing after a set duration (e.g., 1 second for the initial Stone node).

---

## Acceptance Criteria

1.  When a resource node's current capacity drops below its maximum capacity, a respawn timer begins for that node, based on a configured duration for its type (e.g., 1000ms for the initial Stone node).
2.  While a node's respawn timer is active, attempts to gather resources from it yield nothing.
3.  While a node's respawn timer is active, there is a visual indication on the node (in the Territory View) signifying that it is currently respawning/unavailable.
4.  Upon completion of the respawn timer, the node's current capacity is restored to its maximum value.
5.  Upon completion of the respawn timer, the visual respawn indication is removed, and the node can be gathered from again.

---

## Notes / Context

*   Focuses on implementing the time-based replenishment mechanic for resource nodes.
*   Depends on the basic node state management (capacity/depletion) established in Story 03.
*   Implements the "slow respawn" aspect of the Epic Goal for the initial node.
*   **Refinement:** Respawn should trigger whenever `currentCapacity < maxCapacity`, not just when `currentCapacity == 0`, to accommodate future mechanics that might increase max capacity while gathering is in progress.
*   **Note for Architect:** The specific visual indicator for respawning (AC3) should be simple initially but designed with potential future expansion in mind (e.g., showing a progress timer). The architect can determine the initial rudimentary implementation.
*   This story was derived from Epic '01-Targeted-Expansion-And-Resource-Setup'.

## Technical Plan (Option 3: Service-Managed Timers, Scene Visuals - Revised)

### 1. Approved Implementation Approach:
*   **Selected Option:** Option 3: Service-Managed Timers, Scene Visuals
*   **Key Characteristics:** Respawn state (`isRespawning`, `respawnEndTime`, `maxCapacity`, `currentCapacity`) managed in `ResourceNode.store.ts`. `GatheringService.ts` checks `currentCapacity` and triggers `startRespawn` action after depletion if needed. A new `RespawnService.ts` subscribes to the store, manages `setTimeout` timers, and calls `finishRespawn` action. `Territory.scene.ts` subscribes to the store (`isRespawning`, `currentCapacity`) and updates node visuals internally to show distinct states for "Replenishing" (gatherable) and "Depleted" (not gatherable).
*   **User Feedback:** Approved Option 3. Plan revised based on feedback clarifying that gathering should be possible while replenishing (if capacity > 0) and requiring distinct visuals for 'Replenishing' vs. 'Depleted' states.

### 2. Required Refactoring:
*   None identified as prerequisites.

### 3. Detailed Implementation Tasks (Thin Vertical Slices):

*   **[x] Task 0: Update Initial Node Data & Types for Testing (status: complete)**
    *   **Files:**
        *   `src/features/shared/types/entities.ts`
        *   `src/features/territory/initialEntityData.ts`
    *   **Changes:**
        *   In `entities.ts`: Add `respawnDuration: number;` to `ResourceNodeEntity` interface.
        *   In `initialEntityData.ts`:
            *   For `stoneNode1`:
                *   Set `properties.maxCapacity: 5`.
                *   Set `properties.currentCapacity: 1` (to start partially depleted).
                *   Add `properties.respawnDuration: 5000` (5 seconds for testing).
    *   **Vertical Slice Behavior:** Node entity type includes respawn duration. Initial stone node configured with higher capacity and longer respawn time for easier testing of different states.
    *   **Integration Points:** Affects type definitions and initial game state setup.
    *   **Acceptance Criteria:** `ResourceNodeEntity` type updated. `initialEntityData.ts` updated with new capacity/duration for `stoneNode1`. App compiles/runs.

*   [x] Task 1: Update Store State & Actions (status: complete)
    *   **Files:**
        *   `src/features/territory/ResourceNode.store.ts` (Assuming `NodeState` includes `currentCapacity` and `maxCapacity` from previous stories)
    *   **Changes:**
        *   Update `NodeState` interface (if not already done): Add `isRespawning: boolean`, `respawnEndTime: number | null`. Ensure `maxCapacity` and `currentCapacity` are present.
        *   In `ResourceNode.store.ts`:
            *   Update `initializeNodeState`: Set `isRespawning: false`, `respawnEndTime: null`. Ensure `maxCapacity` and `currentCapacity` are correctly stored from initial data.
            *   **New Action** `startRespawn(nodeId: string, duration: number)`:
                *   Get node state. If found AND `!node.isRespawning`:
                *   Set `isRespawning = true`.
                *   Set `respawnEndTime = Date.now() + duration`.
                *   Update state. *(Guard ensures timer doesn't restart if already running)*.
            *   **New Action** `finishRespawn(nodeId: string)`:
                *   Get node state. If found:
                *   Set `isRespawning = false`.
                *   Set `respawnEndTime = null`.
                *   Set `currentCapacity = node.maxCapacity`.
                *   Update state.
            *   Modify `decrementNodeCapacity`: Just decrement `currentCapacity`. *Does not* interact with respawn state directly.
    *   **Vertical Slice Behavior:** Store holds respawn state (`isRespawning`, `respawnEndTime`) alongside capacity. Actions manage the respawn lifecycle distinctly from capacity changes.
    *   **Integration Points:** Store state/actions modified/added.
    *   **Acceptance Criteria:** `NodeState` type updated. Store initializes correctly. `startRespawn` sets flags/time if not already respawning. `finishRespawn` resets flags/capacity. `decrementNodeCapacity` only affects capacity. App compiles/runs.

*   **[x] Task 2: Update Gathering Service Logic (status: complete)**
    *   **Files:**
        *   `src/features/territory/GatheringService.ts`
        *   `src/features/shared/types/entities.ts` (Ensure `ResourceNodeEntity` includes `respawnDuration`)
    *   **Changes:**
        *   Modify `orchestrateGathering`:
            *   Get node state: `const nodeState = useResourceNodeStore.getState().getNodeCapacity(targetNode.id);`
            *   **Change Check:** Check `if (!nodeState || nodeState.currentCapacity <= 0)`. If true (node doesn't exist or is fully depleted), return `{ gathered: false }` early. *(Allows gathering if `currentCapacity > 0`, even if `isRespawning` is true)*.
            *   After successfully decrementing capacity (`decrementNodeCapacity`):
                *   Get updated node state: `const updatedNodeState = useResourceNodeStore.getState().getNodeCapacity(targetNode.id);`
                *   **Check if Respawn Needed:** If `updatedNodeState && updatedNodeState.currentCapacity < updatedNodeState.maxCapacity && !updatedNodeState.isRespawning`:
                    *   Retrieve the node's configured `respawnDuration` (from `targetNode.respawnDuration`).
                    *   Call `useResourceNodeStore.getState().startRespawn(targetNode.id, targetNode.respawnDuration)`.
    *   **Vertical Slice Behavior:** Gathering blocked only if node capacity is zero. Successful gathering triggers `startRespawn` *only if* capacity is below max AND it's not already respawning.
    *   **Integration Points:** Service reads store state, calls store actions. Relies on `respawnDuration` in `ResourceNodeEntity`.
    *   **Acceptance Criteria:** Gathering blocked only if `currentCapacity <= 0`. Successful gathering calls `startRespawn` action correctly based on capacity and current respawn state. App compiles/runs.

*   **[x] Task 3: Create and Initialize Respawn Service (status: complete)**
    *   **Files:**
        *   Create `src/features/territory/RespawnService.ts`
        *   Modify `src/features/core/GameContext.tsx`
    *   **Changes (`RespawnService.ts`):** (No changes needed from previous plan - logic remains the same)
        *   Define `RespawnService` class.
        *   `activeTimers = new Map<string, NodeJS.Timeout>()`.
        *   `unsubscribe: (() => void) | null = null`.
        *   `constructor()`: Calls `this.subscribeToStore()`.
        *   `subscribeToStore()`: Subscribes to `useResourceNodeStore`. On state change, checks if `isRespawning` became true & `respawnEndTime` is set -> starts/replaces `setTimeout` to call `finishRespawn`. If `isRespawning` became false -> clears timeout.
        *   `destroy()`: Clears all timeouts and unsubscribes.
    *   **Changes (`GameContext.tsx`):** (No changes needed from previous plan)
        *   Import, instantiate `RespawnService` in `useEffect`, call `destroy` in cleanup.
    *   **Vertical Slice Behavior:** Service manages `setTimeout` lifecycle based on store state, triggering `finishRespawn`.
    *   **Integration Points:** Service interacts with `ResourceNode.store`. `GameContext` manages service instance.
    *   **Acceptance Criteria:** Service created/initialized/destroyed correctly. Service starts/clears timeouts based on store state. Service calls `finishRespawn` on timeout. App compiles/runs.

*   **[x] Task 4: Implement Distinct Scene Visual Updates (status: complete)**
    *   **Files:**
        *   `src/features/territory/Territory.scene.ts`
    *   **Changes:**
        *   Add/reuse subscription to `useResourceNodeStore`, tracking `nodeStates`.
        *   In the subscription callback or `update()`:
            *   Get `currentStates = useResourceNodeStore.getState().nodeStates;`
            *   Iterate `this.entities: Map<string, EntitySprites>`.
            *   For each `entityId`, `sprites`:
                *   `const nodeState = currentStates.get(entityId);`
                *   If `nodeState`:
                    *   **Determine Visual State:**
                        *   If `nodeState.currentCapacity <= 0`: Apply "Depleted" visual (e.g., `sprites.main.setAlpha(0.3); sprites.main.setTint(0x555555);`).
                        *   Else if `nodeState.isRespawning`: Apply "Replenishing" visual (e.g., `sprites.main.setAlpha(1.0); sprites.main.setTint(0xFFFF99);` // Slight yellow tint, maybe add subtle pulse later).
                        *   Else: Apply "Normal" visual (e.g., `sprites.main.setAlpha(1.0); sprites.main.clearTint();`).
        *   Ensure subscription cleanup in `shutdown`.
    *   **Vertical Slice Behavior:** Scene visually distinguishes between "Depleted" (inaccessible) and "Replenishing" (accessible but recharging) states based on store data.
    *   **Integration Points:** Scene reads `ResourceNode.store` state. Modifies Phaser `GameObject` properties (alpha, tint).
    *   **Acceptance Criteria:** Distinct visual applied for `currentCapacity <= 0`. Different distinct visual applied for `currentCapacity > 0 && isRespawning`. Normal visual applied otherwise. Visuals update correctly based on store changes. App compiles/runs.

### 4. Architectural & Standards Compliance:
*   (No changes from previous plan) Adheres to SRP, state/visual separation.

### 5. Testing Guidance:
*   **Unit Tests:** (Update tests for Task 2 & 4)
    *   `GatheringService.ts`: Test gathering allowed when `currentCapacity > 0 && isRespawning`. Test blocked when `currentCapacity <= 0`.
    *   Add tests for visual state logic if extracted into a helper function.
*   **Manual Verification:** (Update verification steps)
    *   Verify initial node state (Cap 1/5).
    *   Gather once: Verify capacity becomes 0/5, "Depleted" visual appears, gathering blocked.
    *   Wait 5s: Verify capacity becomes 5/5, "Normal" visual appears, gathering works.
    *   Gather twice: Verify capacity becomes 3/5, "Replenishing" visual appears, gathering *still works*.
    *   Wait 5s while gathering possible: Verify capacity becomes 5/5, "Normal" visual appears.

### 6. Dependencies & Integration Points:
*   (Update based on Task 0) Requires `respawnDuration` added to `ResourceNodeEntity` type and `initialEntityData.ts`.

### 7. Complexity Estimate:
*   (No change) Overall Complexity: Medium

---


## Embedded Epic Context for Downstream Processing

<!-- ROO CONTEXT - DO NOT MODIFY MANUALLY -->
<!--
Epic Path: ./epic-01-targeted-expansion-and-resource-setup.md
Epic Title: 01-Targeted-Expansion-And-Resource-Setup
Story Title: Add Respawn Logic to Node State
Epic Goal Summary: Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the Expand Combat action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. (Refines existing Territory view for targeted actions and correct initial state).
Project Context (if available in Epic):
  Project Title: project-01-establish-core-feedback-loop
  Project Goal: Implement the minimum viable gameplay loop connecting the core views: Gather Stone in Territory View, initiate Expand Combat, earn persistent Coins from Combat success (e.g., clearing Wave 1), spend Coins in a minimal Management View to unlock basic Stone-to-Pebble crafting, use crafted Pebbles to conquer the first Hex (e.g., clear Wave 1), and have the conquered Hex reveal a better/new Stone node.
-->