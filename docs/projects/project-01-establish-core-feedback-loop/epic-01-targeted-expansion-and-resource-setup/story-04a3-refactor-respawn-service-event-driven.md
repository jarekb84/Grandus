STATUS: completed
TASKS_PENDING: []
## Technical Story: Refactor RespawnService to be Event-Driven

**Goal:** Decouple `RespawnService` from direct subscription to `ResourceNodeStore`, making it react explicitly to node capacity changes via the Event Bus. Improve clarity and efficiency of the respawn initiation logic.

**User Impact:** Technical improvement leading to a more maintainable and understandable respawn system. Reduces implicit coupling and potential performance issues associated with subscribing to the entire store state.

**Problem:**
*   The current `RespawnService` subscribes to the entire `ResourceNodeStore` state.
*   It indirectly detects when respawn should start by comparing previous/current states after *any* change, often triggered by `GatheringService` calling `ResourceNodeStore.startRespawn`.
*   This indirect linkage is hard to trace and relies on convention.
*   The subscription mechanism requires iterating through all nodes on every store update, which is inefficient.

**Proposed Solution:**

1.  **Define New Event:**
    *   In `src/features/shared/events/eventBus.ts`:
        *   Define a new payload type: `NodeCapacityDecrementedPayload { nodeId: string; previousCapacity: number; newCapacity: number; maxCapacity: number; }`.
        *   Add a new event to `AppEventMap`: `NODE_CAPACITY_DECREMENTED: NodeCapacityDecrementedPayload;`.
2.  **Modify Emitter (`ResourceNodeStore`):**
    *   In `src/features/territory/ResourceNode.store.ts`:
        *   Modify the `decrementNodeCapacity` action:
            *   *After* successfully updating the state (`set((state) => { ... })`), emit the new `NODE_CAPACITY_DECREMENTED` event via the `eventBus`.
            *   The payload should include the `nodeId`, the capacity *before* decrementing, the capacity *after* decrementing, and the node's `maxCapacity`.
            *   Continue emitting the `NODE_VISUAL_STATE_CHANGED` event as before for visual updates.
3.  **Refactor Subscriber (`RespawnService`):**
    *   In `src/features/territory/RespawnService.ts`:
        *   Remove the direct Zustand store subscription logic (remove `unsubscribe`, `previousStates`, and the `useResourceNodeStore.subscribe` call in the constructor).
        *   In the constructor, subscribe to the new `NODE_CAPACITY_DECREMENTED` event using `eventBus.on()`. Store the handler reference for later unsubscribing.
        *   Implement the event handler function (`handleNodeCapacityDecremented(payload: NodeCapacityDecrementedPayload)`):
            *   Check if the node needs to start respawning based on the payload: `if (payload.newCapacity < payload.maxCapacity)`.
            *   Retrieve the *current* full node state using `useResourceNodeStore.getState().getNodeState(payload.nodeId)` to check if it's *already* respawning (`!nodeState.mechanics.respawn.isRespawning`).
            *   If respawn should start (capacity below max AND not already respawning):
                *   Call `useResourceNodeStore.getState().startRespawn(payload.nodeId)`. This action within the store should set `isRespawning` to true and calculate/set `respawnEndTime`.
                *   The `RespawnService` *may still need* its timer logic, but now it should react to changes in `respawnEndTime` (perhaps via another event or a more targeted store subscription if necessary) to schedule the `finishRespawn` call, rather than initiating the start itself. Re-evaluate the timer logic placement during implementation. The primary goal here is removing the full store subscription and triggering via the specific event.
        *   In the `destroy` method, ensure `eventBus.off()` is called with the stored handler reference.
4.  **(Cleanup)** Remove the direct call to `useResourceNodeStore.getState().startRespawn(targetNodeId)` from `src/features/territory/GatheringService.ts`.

**Acceptance Criteria:**

*   `RespawnService` no longer contains `useResourceNodeStore.subscribe`.
*   `ResourceNodeStore.decrementNodeCapacity` emits a `NODE_CAPACITY_DECREMENTED` event with the correct payload.
*   `RespawnService` subscribes to `NODE_CAPACITY_DECREMENTED`.
*   When a node's capacity is decremented below its maximum and it's not already respawning, the `RespawnService` handler correctly triggers the `ResourceNodeStore.startRespawn` action for that specific node.
*   The respawn timer logic (likely still residing in `RespawnService` but potentially reacting differently) correctly schedules the call to `ResourceNodeStore.finishRespawn`.
*   The application compiles, runs, and resource nodes correctly start and complete their respawn cycle based on capacity reduction, driven by the new event mechanism.
*   The direct call to `startRespawn` is removed from `GatheringService.ts`.

**Notes:**

*   This refactoring makes the `RespawnService` a dedicated handler for the *side effect* (timing the respawn completion) triggered by a state change event.
*   This story is a prerequisite for further work on respawn mechanics (like incremental respawn cycles).

## Technical Plan (Revised based on feedback)

### 1. Approved Implementation Approach:
*   **Selected Option:** Event-Driven Refactoring (Simplified Payload).
*   **Key Characteristics:** Decouple `RespawnService` from `ResourceNodeStore` subscription, using a new `NODE_CAPACITY_DECREMENTED` event (containing only `nodeId`) via the central `eventBus`. The `RespawnService` handler will fetch the current node state from the store to check conditions (`isRespawning`, `currentCapacity < maxCapacity`) before triggering `startRespawn`. `RespawnService` remains responsible for scheduling the `finishRespawn` timer using the `respawnEndTime` from the store state set by `startRespawn`.
*   **Rationale for Payload Change:** Based on feedback, passing capacity details in the event is redundant and potentially unsafe due to concurrency. The handler must fetch the live state from the store to reliably check `isRespawning`. Therefore, only the `nodeId` is needed in the event payload.
*   **User Feedback Incorporation:** Plan revised to simplify event payload and restructure tasks based on user feedback regarding payload redundancy and vertical slice adherence.

### 2. Required Refactoring:
*   None identified *prior* to this story's tasks; this story *is* the refactoring.

### 3. Detailed Implementation Tasks (Revised Structure):

*   **Task 1: Implement Event-Driven Respawn Trigger (Define, Emit, Listen)**
    *   **Goal:** Implement the complete new event flow: define the simplified event, emit it from the store, and refactor `RespawnService` to listen and react.
    *   **Files:**
        *   `src/features/shared/events/eventBus.ts`
        *   `src/features/territory/ResourceNode.store.ts`
        *   `src/features/territory/RespawnService.ts`
    *   **Changes:**
        *   **`eventBus.ts`:**
            *   Define `NodeCapacityDecrementedPayload` interface: `{ nodeId: string; }`. (Removed previous/new/max capacity).
            *   Add `NODE_CAPACITY_DECREMENTED: NodeCapacityDecrementedPayload;` to `AppEventMap`.
        *   **`ResourceNode.store.ts`:**
            *   Import `eventBus`.
            *   In `decrementNodeCapacity` action, *after* the state is updated via `set`, emit `eventBus.emit('NODE_CAPACITY_DECREMENTED', { nodeId });`. (Simplified payload).
        *   **`RespawnService.ts`:**
            *   Remove `unsubscribe` property, `previousStates` property, and the `subscribeToStore` method/call.
            *   Import `eventBus`, `NodeCapacityDecrementedPayload`, and `useResourceNodeStore`.
            *   Add property to store event handler reference (e.g., `private capacityDecrementHandler = this.handleNodeCapacityDecremented.bind(this);`).
            *   In constructor, call `eventBus.on('NODE_CAPACITY_DECREMENTED', this.capacityDecrementHandler);`.
            *   Implement `handleNodeCapacityDecremented(payload: NodeCapacityDecrementedPayload)`:
                *   Fetch current node state: `const nodeState = useResourceNodeStore.getState().getNodeState(payload.nodeId);`.
                *   Check if node exists: `if (!nodeState) return;`.
                *   Check conditions using *fetched state*: `if (nodeState.mechanics.capacity.current < nodeState.mechanics.capacity.max && !nodeState.mechanics.respawn.isRespawning)`. (Using fetched state values).
                *   Inside, call `useResourceNodeStore.getState().startRespawn(payload.nodeId);`.
                *   Immediately after calling `startRespawn`, re-fetch the node state to get the updated `respawnEndTime`: `const updatedNodeState = useResourceNodeStore.getState().getNodeState(payload.nodeId);`.
                *   If `updatedNodeState?.mechanics.respawn.respawnEndTime`, use existing timer logic (`activeTimers`, `setTimeout`, call to `finishRespawn`) to schedule completion based on the new `respawnEndTime`. Ensure existing timers for the node are cleared.
            *   In `destroy`, call `eventBus.off('NODE_CAPACITY_DECREMENTED', this.capacityDecrementHandler);` and clear `activeTimers`.
    *   **Vertical Slice Behavior:** The complete event-driven mechanism for triggering respawn initiation is implemented. `RespawnService` now reacts to the new event and correctly schedules the `finishRespawn` timer. (Note: The old trigger in `GatheringService` still exists at this point but will be removed in Task 2).
    *   **Acceptance Criteria:** Store subscription logic is removed from `RespawnService`. Simplified `NODE_CAPACITY_DECREMENTED` event is defined. Store emits the event with only `nodeId`. `RespawnService` listener is added. Handler fetches current state, correctly checks conditions (`isRespawning`, `current < max`), calls `startRespawn`, and schedules `finishRespawn` using the resulting `respawnEndTime`. Timers are managed correctly. Application compiles and runs without errors or regressions. Respawn cycle functions correctly via the new event mechanism.

*   **Task 2: Cleanup Old Trigger Mechanism**
    *   **Goal:** Remove the redundant direct call to `startRespawn` from `GatheringService`.
    *   **Files:** `src/features/territory/GatheringService.ts`
    *   **Changes:**
        *   Remove the block of code (approx lines 66-78 in previous analysis) that re-fetches node state and directly calls `useResourceNodeStore.getState().startRespawn(targetNodeId)`.
    *   **Vertical Slice Behavior:** The old, direct respawn trigger mechanism is removed, leaving only the event-driven flow implemented in Task 1.
    *   **Integration Points:** N/A (removal).
    *   **Acceptance Criteria:** Direct call to `startRespawn` is removed from `GatheringService`. Respawn *only* triggers via the event flow after gathering depletes capacity below max. Application compiles and runs without errors or regressions.

### 4. Recommended Post-Implementation Cleanup Tasks (Optional):
*   None recommended at this stage beyond the tasks defined above.

### 5. Architectural & Standards Compliance:
*   **Alignment:** The revised plan adheres to architectural principles (`05-architecture-patterns.md`):
    *   Improves **SRP** for `RespawnService`.
    *   Utilizes the **Event Bus** for decoupling.
    *   Helps **Isolate Side Effects**.
*   **Directory Structure:** Changes occur within appropriate directories (`06-directory-structure.md`).
*   **Development Practices:** Task structure revised based on feedback to better align with vertical slice principles (`02-development-practices.md`, `03-story-planning-process.md`), reducing "dead code" duration and ensuring cleaner separation of concerns between the refactoring and cleanup.

### 6. Testing Guidance:
*   **Unit Tests:**
    *   Verify `ResourceNodeStore.decrementNodeCapacity` emits `NODE_CAPACITY_DECREMENTED` with only `{ nodeId }`.
    *   Test `RespawnService.handleNodeCapacityDecremented` logic, mocking `eventBus`, store actions/state (`getNodeState`, `startRespawn`, `finishRespawn`), and timers. Ensure it correctly fetches state, checks conditions, calls `startRespawn`, and schedules `finishRespawn`.
*   **Integration/Manual Verification:**
    *   Perform end-to-end test (as described previously), verifying respawn triggers correctly *only* via the event mechanism after Task 2 is complete.
    *   Verify `GatheringService` no longer contains the direct `startRespawn` call after Task 2.

### 7. Dependencies & Integration Points:
*   **Internal:** `eventBus`, `useResourceNodeStore`.
*   **External:** None.
*   **New Libraries:** None.

### 8. Complexity Estimate:
*   **Overall Complexity:** Medium (No change from previous estimate)
*   **Rationale:** While the payload is simplified, the core logic and coordination across files remain. Ensuring the handler correctly fetches and uses live state and manages timers is key. The revised task structure improves flow but doesn't significantly alter the inherent complexity.