STATUS: completed
TASKS_PENDING: []
# User Story: Introduce Resource Node Incremental Respawn Cycles (04b)

**Epic:** [../epic-01-targeted-expansion-and-resource-setup.md](../epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base/node, implement hex selection for Expand Combat, make initial node depletable/respawnable.

---

## Story Goal

Modify the resource node respawn mechanism so that capacity increases incrementally by a configurable amount (`respawn capacity increment`) at the end of each `respawn duration` cycle, continuing until max capacity is reached, instead of instantly setting to max capacity. The "respawning" state should begin as soon as `currentCapacity` is below `maxCapacity` and persist until `maxCapacity` is reached.

---

## Acceptance Criteria

1.  **Configuration:** The amount of resource capacity gained per respawn cycle (`respawnCapacityIncrement`) and the duration of each cycle (`respawnDuration`) are configurable for resource nodes.
2.  **Continuous Respawn State:** A node enters and remains in a "respawning" state whenever its `currentCapacity` is less than its `maxCapacity`.
3.  **Incremental Gain Cycle:** While a node is in the "respawning" state, a timer corresponding to `respawnDuration` runs. Upon completion of this timer:
    *   The node's `currentCapacity` increases by the configured `respawnCapacityIncrement`.
    *   If `currentCapacity` is still less than `maxCapacity`, another `respawnDuration` timer immediately begins for the next increment.
4.  **Interaction During Respawn:** Players can initiate gathering from a node even while it is in the "respawning" state.
5.  **Interaction Effect on Respawn Cycle:** Gathering from a node while it is respawning does *not* directly affect or restart the current `respawnDuration` timer. The timer continues independently.
6.  **Capacity Capping:** When a capacity increment causes the node's `currentCapacity` to meet or exceed its `maxCapacity`, the `currentCapacity` is set exactly to `maxCapacity`.
7.  **Completion of Respawn State:** When `currentCapacity` reaches `maxCapacity`, the node exits the "respawning" state (any associated visuals managed by Story 04d would cease).

---

## Notes / Context

*   This story introduces the core logic for incremental respawning.
*   Depends on the data structure refactoring completed in Story 04a.
*   Architect Recommendation: Implement this story after 04a and before 04c.
*   Configuration values (`respawnCapacityIncrement`, `respawnDuration`) must be positive numbers. Renaming `respawnCapacityIncrement` to `amountPerCycle` is part of Task 1.
*   Handling game state persistence (saving/loading) during respawn cycles is out of scope for this story.


---

## Technical Plan: Introduce Resource Node Incremental Respawn Cycles (04b)

### 1. Approved Implementation Approach:
*   **Selected Option:** Option 1: RespawnService Timer Loop
*   **Key Characteristics:** `RespawnService` uses `setTimeout` to schedule calls to a new `ResourceNode.store` action (`incrementRespawnCycle`). This action handles both incrementing capacity and checking for/handling cycle completion (setting `isRespawning=false`). The service reads the store state after each increment to determine if the next timer needs to be scheduled.
*   **User Feedback:** Approved Approach A (single store action handles completion logic). Agreed to rename `respawnCapacityIncrement` -> `amountPerCycle` immediately and defer abstraction layer refactoring.

### 2. Required Refactoring:
*   Rename `respawnCapacityIncrement` field to `amountPerCycle` in `initialEntityData.ts` and update `initialEntityConverter.ts`.
*   Replace store actions `startRespawn` and `finishRespawn` with `initiateRespawnCycle` and `incrementRespawnCycle`.
*   Refactor timer logic in `RespawnService`.

### 3. Detailed Implementation Tasks (Thin Vertical Slices):

*   **Task 1: Standardize Configuration Naming & Update Types**
    *   **Files:**
        *   `src/features/territory/initialEntityData.ts`
        *   `src/features/territory/initialEntityConverter.ts`
    *   **Changes:**
        *   In `initialEntityData.ts`: Rename property `respawnCapacityIncrement?` to `amountPerCycle?` in `InitialEntityData` interface. Update `stoneNode1` example data field name.
        *   In `initialEntityConverter.ts`: Update variable `respawnInc` assignment to read from `initialData.properties.amountPerCycle`. Update mapping to `respawn: { amountPerCycle: respawnInc, ... }`.
    *   **Vertical Slice Behavior:** Configuration data structure uses consistent naming. Converter logic updated. No runtime behavior change yet.
    *   **Integration Points:** None.
    *   **Acceptance Criteria:** Code compiles. `initialEntityData.ts` uses `amountPerCycle`. `initialEntityConverter.ts` reads and maps `amountPerCycle` correctly. Application compiles and runs without errors or regressions.

*   **Task 2: Implement `incrementRespawnCycle` Store Action**
    *   **Files:** `src/features/territory/ResourceNode.store.ts`
    *   **Changes:**
        *   Add `incrementRespawnCycle(nodeId: string)` to `ResourceNodeStoreState` interface and implementation.
        *   Inside `incrementRespawnCycle(nodeId)`:
            *   Get `nodeState`. If valid and `isRespawning`:
                *   Calculate `newCapacity = nodeState.mechanics.capacity.current + nodeState.mechanics.respawn.amountPerCycle`.
                *   Clamp `newCapacity = Math.min(newCapacity, nodeState.mechanics.capacity.max)`.
                *   Prepare `updatedMechanics` based on `nodeState.mechanics`.
                *   Set `updatedMechanics.capacity.current = newCapacity`.
                *   **If `newCapacity >= nodeState.mechanics.capacity.max` (Cycle Complete):**
                    *   Set `updatedMechanics.respawn.isRespawning = false`.
                    *   Set `updatedMechanics.respawn.respawnEndTime = null`.
                    *   Emit `NODE_VISUAL_STATE_CHANGED` event (e.g., `['fully_stocked']`).
                *   **Else (Cycle Continues):**
                    *   Set `updatedMechanics.respawn.isRespawning = true`.
                    *   Calculate next end time: `updatedMechanics.respawn.respawnEndTime = Date.now() + nodeState.mechanics.respawn.cycleDurationMs`.
                    *   Emit `NODE_VISUAL_STATE_CHANGED` event (e.g., `['respawning_pulse']`).
            *   Update `nodeStates` map with the node containing `updatedMechanics`.
    *   **Vertical Slice Behavior:** Store can now handle incremental capacity updates and cycle completion logic via this single action.
    *   **Integration Points:** Will be called by `RespawnService`. Emits events for UI/visuals.
    *   **Acceptance Criteria:** New action exists. Calling it updates state (`currentCapacity`, `isRespawning`, `respawnEndTime`) correctly based on completion status. Emits correct events. Application compiles and runs. Existing respawn remains unchanged.

*   **Task 3: Implement `initiateRespawnCycle` Store Action & Refactor Service Trigger**
    *   **Files:**
        *   `src/features/territory/ResourceNode.store.ts`
        *   `src/features/territory/RespawnService.ts`
    *   **Changes:**
        *   **In Store:**
            *   Add `initiateRespawnCycle(nodeId: string)` action.
            *   Inside `initiateRespawnCycle`: Get `nodeState`. If valid and not already respawning: Calculate first `respawnEndTime = Date.now() + cycleDurationMs`. Update state setting `isRespawning = true` and `respawnEndTime`. Emit initial `NODE_VISUAL_STATE_CHANGED` (e.g., `['depleted', 'respawning_pulse']`).
        *   **In Service:**
            *   Rename `scheduleRespawnCompletion` method to `scheduleNextRespawnIncrement`.
            *   Modify `handleNodeCapacityDecremented`: If respawn needed, call `useResourceNodeStore.getState().initiateRespawnCycle(nodeId)`. **After** this call, read the `respawnEndTime` from the updated store state. If valid, call `this.scheduleNextRespawnIncrement(nodeId, respawnEndTime)`.
            *   Modify `scheduleNextRespawnIncrement(nodeId, nextIncrementTime)`: Clear existing timer. Calculate delay. If `delay > 0`, use `setTimeout` to call `useResourceNodeStore.getState().incrementRespawnCycle(nodeId)` after delay. Store timer ID. If `delay <= 0`, call `incrementRespawnCycle` immediately. **Crucially, remove the old logic that checked state *after* the timeout - that moves to Task 4.**
            *   Remove references/calls to old `startRespawn` / `finishRespawn` from the service.
    *   **Vertical Slice Behavior:** Service now correctly triggers the *start* of the respawn cycle using the new store action and schedules the *first* increment timer.
    *   **Integration Points:** Service calls `initiateRespawnCycle` and schedules first `incrementRespawnCycle`.
    *   **Acceptance Criteria:** New `initiateRespawnCycle` action works. Service calls `initiateRespawnCycle` on decrement. Service schedules the first `incrementRespawnCycle` call correctly using `scheduleNextRespawnIncrement`. Application compiles and runs. Nodes enter respawn state, and the first increment occurs. Loop does not continue yet.

*   **Task 4: Implement Respawn Cycle Loop Continuation in Service**
    *   **Files:** `src/features/territory/RespawnService.ts`
    *   **Changes:**
        *   Modify the `setTimeout` callback within `scheduleNextRespawnIncrement`:
            *   **BEFORE** the existing `incrementRespawnCycle` call, clear the timer ID from `activeTimers` map for the completed timer.
            *   Call `useResourceNodeStore.getState().incrementRespawnCycle(nodeId)`.
            *   **AFTER** the call returns: Read the *updated* node state `updatedNodeState = useResourceNodeStore.getState().getNodeState(nodeId);`.
            *   Check if `updatedNodeState?.mechanics.respawn.isRespawning` is **TRUE**.
                *   If **TRUE:** Get `nextEndTime = updatedNodeState.mechanics.respawn.respawnEndTime`. If valid, call `this.scheduleNextRespawnIncrement(nodeId, nextEndTime)` to schedule the next cycle.
                *   If **FALSE:** Do nothing further (cycle completed).
        *   Modify the immediate call logic (if `delay <= 0`): After calling `incrementRespawnCycle`, perform the same state check and potentially schedule the next increment if needed.
    *   **Vertical Slice Behavior:** Full incremental respawn loop implemented.
    *   **Integration Points:** Service reads store state *after* the increment action to decide loop continuation.
    *   **Acceptance Criteria:** After `incrementRespawnCycle` runs (via timer or immediate call), the service checks `isRespawning`. If true, it schedules the next timer using the new `respawnEndTime`. If false, no further timer is scheduled. Timer IDs are correctly managed in `activeTimers`. Application compiles and runs. Nodes fully respawn incrementally.

*   **Task 5: Cleanup Old Store Actions**
    *   **Files:** `src/features/territory/ResourceNode.store.ts`
    *   **Changes:** Remove the (now unused) `startRespawn` and `finishRespawn` actions from the interface and implementation.
    *   **Vertical Slice Behavior:** Code cleanup.
    *   **Integration Points:** None.
    *   **Acceptance Criteria:** Old actions removed. Application compiles, runs, and respawn logic functions correctly.

### 4. Recommended Post-Implementation Cleanup Tasks (Optional):
*   None recommended specifically for this story beyond Task 5.

### 5. Architectural & Standards Compliance:
*   Adheres to State Separation: Store manages state, Service manages timer side-effects.
*   Uses Event Bus for initial trigger (`NODE_CAPACITY_DECREMENTED`).
*   Store actions are reasonably focused.

### 6. Testing Guidance:
*   **Unit Tests:**
    *   Verify `incrementRespawnCycle` store action correctly updates capacity, `isRespawning`, and `respawnEndTime` for both intermediate and final cycles.
    *   Verify `initiateRespawnCycle` store action correctly sets initial state.
*   **Integration Tests:**
    *   Test the `RespawnService` interaction: Ensure decrement triggers `initiateRespawnCycle`, schedules first timer, timer calls `incrementRespawnCycle`, state check occurs, and subsequent timers are scheduled correctly until completion.
    *   Verify timer cleanup in `RespawnService` when cycles complete or `destroy()` is called.
*   **Manual Verification:** Observe nodes in-game. Verify they enter respawning state when depleted, capacity increases visually/in state over time, and they return to full state correctly. Test gathering during respawn.

### 7. Dependencies & Integration Points:
*   **Module Dependencies:** `ResourceNode.store`, `RespawnService`, `eventBus`.
*   **External Dependencies:** None new.
*   **New Libraries:** None.

### 8. Complexity Estimate:
*   **Overall Complexity:** Medium
*   **Estimated Effort:** Requires careful handling of asynchronous timers and state checking between the service and store.

---

## User voice Notes (note these were created before the epic architecture overview was done)

### Summary

This story introduces a new behavior for resource node respawning where capacity increases incrementally over time via defined respawn cycles, rather than jumping directly to max capacity upon finishing respawning.

### Current vs. Desired Respawn Behavior

*   **Current:** On finishing respawn, the node's capacity goes from its current value (e.g., zero or one) directly to max capacity.
*   **Desired:** The respawn behavior should be incremental. For every `respawn duration` that elapses, the node should gain a specific, configurable amount of capacity.

### Respawn Cycles Concept

*   Introduce the concept of "respawn cycles".
*   A new configurable value is needed: `respawn capacity increment`. This value determines how much capacity is added per cycle. (Note: Renamed to `amountPerCycle` in technical plan Task 1).
*   Each respawn cycle lasts for the defined `respawn duration`.
*   At the end of a `respawn duration` cycle, the node's current capacity should increase by the `respawn capacity increment`.
*   These cycles should continue until the node reaches its `max capacity`.

### Handling `isRespawning` State and Timers

*   The `isRespawning` state/timer should *not* be wiped out or reset to false after each increment of capacity.
*   It should only be reset to false when the node reaches `max capacity`.
*   Instead of a single `finish respawn` event that sets to max, the system should initiate a process where upon completion of a `respawn duration` cycle, capacity is incremented, and if not yet at max capacity, the process effectively starts another timer or continues the existing one for the next increment cycle. The architect should determine the best technical implementation for this cycle management. (Note: Approved plan uses `RespawnService` with timers calling a single store action `incrementRespawnCycle` which handles completion check).

### New Configuration

*   A new configurable field is required to define the amount of capacity added per cycle.
*   Suggested names: `respawn capacity increment`, `respawn duration increment`, or `respawn duration capacity increment value`. Consider the existing naming convention for clarity. (Note: Standardized to `amountPerCycle` in technical plan Task 1).

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