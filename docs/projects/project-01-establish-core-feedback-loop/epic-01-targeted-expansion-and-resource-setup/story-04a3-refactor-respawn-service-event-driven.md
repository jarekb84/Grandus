STATUS: todo
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