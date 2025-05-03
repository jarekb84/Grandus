STATUS: completed
TASKS_PENDING: []
## Technical Story: Implement Event Bus & Decouple TerritoryScene Visuals

**Goal:** Introduce a basic application-wide Event Bus (Pub/Sub) system. Utilize this system to decouple `TerritoryScene` visual updates from direct knowledge of `ResourceNodeStore` state. Analyze the codebase for other immediate candidates for event-based decoupling.

**User Impact:** Primarily a technical improvement leading to a more maintainable and less coupled codebase. This facilitates future changes to both resource state logic and scene visuals independently. May potentially lead to more consistently timed visual updates.

**Acceptance Criteria:**

*   A basic, globally accessible Event Bus instance exists and is usable throughout the application (e.g., in stores, services, scenes, adapters).
*   `TerritoryScene` no longer imports or directly subscribes to `useResourceNodeStore`.
*   Visual updates for resource nodes in `TerritoryScene` (related to depletion, respawn status, etc.) are triggered by subscribing to events published via the Event Bus.
*   `ResourceNodeStore` actions (or relevant services) publish events related to node state changes that require visual updates.
*   The specific event name(s) and payload structure(s) for node visual updates are defined (even if marked for refinement).
*   An analysis is performed and documented within this story's notes identifying other potential high-priority areas for event-based decoupling based on current codebase coupling.
*   The application compiles, runs, and resource node visuals update correctly (reflecting depletion/respawn states) after the changes.

## Notes / Implementation Details

*   **Event Bus Implementation:**
    *   Implement a simple, central Event Bus class (similar to `docs/STATE_ARCHITECTURE.md` example or using a minimal library like `mitt`). Ensure it's easily accessible (e.g., singleton instance exported from a shared location like `src/features/shared/events/`).
*   **TerritoryScene/ResourceNodeStore Decoupling:**
    *   **Define Event Contract:** Define initial event name(s) (e.g., `NODE_VISUAL_STATE_CHANGED`) and payload structure.
        *   **Payload Refinement Needed:** Acknowledge that a simple enum like `'normal' | 'depleted' | 'respawning'` might be insufficient for combined visual states. The payload design should allow for conveying multiple aspects of the visual state if necessary (e.g., `{ nodeId: string, appearance: 'depleted' | 'normal', effect?: 'respawning_pulse' | null }`). This needs further definition during grooming/implementation. The key is that the publisher (Store) determines the *semantic state*, and the subscriber (Scene) translates that to visuals.
    *   **Publisher:** Modify relevant `ResourceNodeStore` actions (`decrementNodeCapacity`, `startRespawn`, `finishRespawn`) to publish the defined event(s) via the Event Bus *after* state changes.
    *   **Subscriber:** Refactor `TerritoryScene`:
        *   Remove direct store dependency.
        *   Subscribe to the relevant event(s) in `create`/`init`.
        *   Implement handler function(s) to update Phaser sprite properties (tint, alpha, potentially animations later) based on the event payload.
        *   Implement unsubscription in `shutdown`.
*   **Analysis Task:**
    *   Review the provided `repomix-output.xml` context.
    *   Identify other areas where direct cross-feature imports or direct state reading between major components (React UI <-> Phaser Scenes, different Stores/Services, different Phaser Scenes) exist.
    *   Prioritize 1-2 other candidates where introducing event-based communication *now* would provide significant decoupling benefits, especially considering planned work in Epics 01 and 02. Document findings here. *Example candidates might include CombatScene interactions, UI updates triggered by game events, etc.*
## Detailed Technical Plan: Implement Event Bus & Decouple TerritoryScene Visuals

### 1. Approved Implementation Approach:
*   **Selected Option:** Event Bus Decoupling using `mitt` library.
*   **Payload Structure:** Array of Effects (`activeEffects: NodeVisualEffect[]`).
*   **Key Characteristics:** Introduce a shared, lightweight event bus (`mitt`) instance. Modify `ResourceNodeStore` to publish events with semantic state changes (`activeEffects`). Refactor `TerritoryScene` to subscribe to these events for visual updates, removing its direct dependency on the store. This aligns with `STATE_ARCHITECTURE.md` and `EVENT_BUS_GUIDELINES.md`.
*   **User Feedback:** Confirmed use of `mitt`, Array of Effects payload, revised vertical slicing, and decoupling timing.

### 2. Required Refactoring:
*   Refactoring within `TerritoryScene.ts` to replace direct store subscription/reading with event bus subscription/handling.
*   Modifications within `ResourceNodeStore.ts` actions to add `eventBus.emit` calls with the defined payload structure.

### 3. Detailed Implementation Tasks (Vertical Slices):

*   **Task 1: Implement & Export Event Bus**
    *   **Files:** `package.json`, `src/features/shared/events/eventBus.ts` (new file), `docs/EVENT_BUS_GUIDELINES.md` (for reference)
    *   **Changes:**
        *   Add `mitt` dependency (e.g., `npm install mitt`).
        *   Create `src/features/shared/events/eventBus.ts`.
        *   Inside `eventBus.ts`, import `mitt`. Define the `NodeVisualEffect` type (e.g., `'depleted' | 'respawning_pulse' | 'fully_stocked'`). Define the `NodeVisualStatePayload` type (`{ nodeId: string; activeEffects: NodeVisualEffect[] }`). Define the main `AppEventMap` including `NODE_VISUAL_STATE_CHANGED: NodeVisualStatePayload`. Export the typed `mitt<AppEventMap>` instance as a singleton (`export const eventBus = mitt<AppEventMap>();`).
    *   **Vertical Slice Behavior:** A globally accessible, typed event bus instance, conforming to guidelines, is available for import.
    *   **Integration Points:** None yet, this task only creates the bus and defines the types.
    *   **Acceptance Criteria:** `mitt` is added as a dependency. `eventBus.ts` exists, defines types, and exports a usable `mitt` instance. Application compiles and runs without errors. Guidelines in `EVENT_BUS_GUIDELINES.md` are followed.

*   **Task 2: Wire Up *First* Visual State (Depletion/Full)**
    *   **Files:** `src/features/territory/ResourceNode.store.ts`, `src/features/territory/Territory.scene.ts`, `src/features/shared/events/eventBus.ts`
    *   **Changes:**
        *   In `ResourceNode.store.ts`: Import `eventBus`. Modify `decrementNodeCapacity` action: *after* `set()` completes successfully, determine the correct `activeEffects` array (e.g., `['depleted']` if capacity <= 0, `['fully_stocked']` otherwise) and `eventBus.emit('NODE_VISUAL_STATE_CHANGED', { nodeId, activeEffects });`.
        *   In `Territory.scene.ts`:
            *   Remove import for `useResourceNodeStore`.
            *   Import `eventBus`, `NodeVisualStatePayload`, `NodeVisualEffect` from `eventBus.ts`.
            *   Remove `storeUnsubscribe` property and `subscribeToNodeStore` method. Remove related TODO comments.
            *   Remove call to `subscribeToNodeStore` from `create()`.
            *   Add `this.handleNodeVisualUpdate = this.handleNodeVisualUpdate.bind(this);` to constructor or `create`.
            *   In `create()`: Add `eventBus.on('NODE_VISUAL_STATE_CHANGED', this.handleNodeVisualUpdate);`.
            *   In `shutdown()`: Add `eventBus.off('NODE_VISUAL_STATE_CHANGED', this.handleNodeVisualUpdate);`.
            *   Remove the `updateNodeVisuals` method entirely.
            *   Create `handleNodeVisualUpdate(payload: NodeVisualStatePayload): void`. Inside:
                *   Get sprites: `const sprites = this.entities.get(payload.nodeId); if (!sprites) return;`
                *   Reset visuals: `sprites.main.setAlpha(1.0); sprites.main.clearTint(); /* stop tweens */`
                *   Handle *only* depletion/full based on payload: `if (payload.activeEffects.includes('depleted')) { /* set alpha/tint for depleted */ } else if (payload.activeEffects.includes('fully_stocked')) { /* ensure alpha/tint for full */ }`
    *   **Vertical Slice Behavior:** Depleting a node correctly updates its visual state (depleted/full) via the event bus, demonstrating the core decoupling.
    *   **Integration Points:** Store emits depletion/full events; Scene subscribes and handles these specific events.
    *   **Acceptance Criteria:** Direct `useResourceNodeStore` dependency removed from `TerritoryScene`. Scene subscribes/unsubscribes correctly. `decrementNodeCapacity` emits event. `handleNodeVisualUpdate` correctly applies visuals *only* for 'depleted' or 'fully_stocked' effects based on the event. Application compiles, runs, and depletion visuals work end-to-end via the event bus.

*   **Task 3: Wire Up Remaining Visual States (Respawn)**
    *   **Files:** `src/features/territory/ResourceNode.store.ts`, `src/features/territory/Territory.scene.ts`, `src/features/shared/events/eventBus.ts`
    *   **Changes:**
        *   In `ResourceNode.store.ts`:
            *   Modify `startRespawn` action: *after* `set()` completes, emit `NODE_VISUAL_STATE_CHANGED` with appropriate `activeEffects` (e.g., `['depleted', 'respawning_pulse']`).
            *   Modify `finishRespawn` action: *after* `set()` completes, emit `NODE_VISUAL_STATE_CHANGED` with `activeEffects: ['fully_stocked']`.
        *   In `Territory.scene.ts`:
            *   Enhance `handleNodeVisualUpdate`: Add logic to check for and apply the `respawning_pulse` effect (e.g., `if (payload.activeEffects.includes('respawning_pulse')) { /* apply respawn visuals, potentially start tween */ }`). Ensure logic correctly handles combinations (e.g., depleted + respawning).
    *   **Vertical Slice Behavior:** Respawn-related visual states are now also handled via the event bus.
    *   **Integration Points:** Store emits respawn-related events; Scene handles these additional effects.
    *   **Acceptance Criteria:** `startRespawn` and `finishRespawn` emit correct events. `handleNodeVisualUpdate` correctly applies visuals for respawning states, including combinations. Application compiles, runs, and respawn visuals work correctly via the event bus.

*   **Task 4: Perform & Document Decoupling Analysis**
    *   **Files:** `docs/projects/project-01-establish-core-feedback-loop/epic-01-targeted-expansion-and-resource-setup/story-04a2-implement-event-bus-decoupling.md` (this file), `docs/EVENT_BUS_GUIDELINES.md` (for reference)
    *   **Changes:**
        *   Review `search_files` results (from previous steps) and `repomix-output.xml` context. Identify direct coupling points like `RespawnService`/`GatheringService` -> `ResourceNodeStore` calls, potential `CombatScene` -> Store calls.
        *   Apply litmus test from `EVENT_BUS_GUIDELINES.md` to these couplings.
        *   Prioritize 1-2 candidates for future decoupling based on risk score and upcoming Epic scope (Epic 01a QoL, Epic 02 Combat).
        *   Add findings to the `### Decoupling Analysis Findings` section below this plan, including rationale for prioritization (e.g., "Decouple RespawnService in Epic 01a to improve Territory cohesion before Combat work").
    *   **Vertical Slice Behavior:** The analysis task required by the story is completed and documented.
    *   **Integration Points:** Updates documentation.
    *   **Acceptance Criteria:** The story markdown file contains a documented analysis identifying at least 1-2 specific, prioritized candidates for further event-based decoupling, with rationale aligned with guidelines and project structure.

### 4. Recommended Post-Implementation Cleanup Tasks (Optional):
*   None recommended beyond standard code cleanup during implementation.

### 5. Architectural & Standards Compliance:
*   **Adherence:** Plan uses `mitt`, follows State Separation (`05`, `STATE_ARCHITECTURE.md`), places bus correctly (`06`), and adheres to the newly created `EVENT_BUS_GUIDELINES.md` regarding semantic events and payload structure. Vertical slicing corrected based on feedback.
*   **Deviations:** None noted.

### 6. Testing Guidance:
*   **Unit Tests:** Test the `activeEffects` array generation logic within store actions. Test the `handleNodeVisualUpdate` logic, especially combinations of effects.
*   **Integration Tests:** Verify end-to-end flow for depletion and respawn events.
*   **Manual Verification:** Run game, verify depletion visuals, respawn visuals (including combined states like depleted+respawning), and return-to-normal visuals, all driven by events.

### 7. Dependencies & Integration Points:
*   **Module Dependencies:** `ResourceNodeStore` -> `eventBus`, `TerritoryScene` -> `eventBus`.
*   **External Dependencies:** `mitt`.
*   **New Libraries:** `mitt`.

### 8. Complexity Estimate:
*   **Overall Complexity:** Medium.
*   **Estimated Effort:** ~3-5 hours.

### Decoupling Analysis Findings (Revised based on further discussion)
*   **Analysis:** Reviewed current service interactions (`GatheringService`, `RespawnService`) with `ResourceNodeStore`, direct scene calls, and potential `CombatScene` interactions based on project structure and upcoming Epics (01a QoL, 02 Combat). Applied litmus test from `EVENT_BUS_GUIDELINES.md` with refined understanding.
*   **Candidate 1 (Re-evaluated): `GatheringService`/`RespawnService` -> `ResourceNodeStore` Interaction**
    *   **Current Coupling:** Direct method calls (`store.decrementNodeCapacity()`, `store.startRespawn()`, `store.finishRespawn()`). Also, `RespawnService` subscription to the entire store.
    *   **Assessment:** Direct calls from a service (`GatheringService`) to its relevant domain store (`ResourceNodeStore`) for state updates are considered acceptable intra-domain coupling. The event bus is less suitable here.
    *   **Concerns:** The *current* `RespawnService` pattern (subscribing to the whole store, indirect triggering) is problematic due to implicit coupling and inefficiency.
    *   **Recommendation:** **DO NOT** prioritize decoupling these direct store calls via the event bus for now. Instead, create a **new technical story (`0483`)** to refactor the `RespawnService` to listen for a specific event (e.g., `NODE_DECREMENTED`, potentially emitted by the Store or Service - TBD in story `0483`) and handle the respawn lifecycle explicitly. This addresses the problematic pattern without forcing events for direct state updates.
*   **Candidate 2 (Confirmed Priority): `CombatScene` -> Global State (Currency/Game Mode)**
    *   **Current Coupling:** Likely direct store calls (`currencyStore.addCoins()`, `gameContext.setActiveScene()`). Litmus Score: 5+ (High Risk - Emitter Knowledge, Cross-Domain).
    *   **Proposed Event:** `COMBAT_ENDED { hexId: string; rewards: { coins: number; cash?: number }; outcome: 'victory' | 'defeat' }` emitted by `CombatScene` (or its orchestrator/adapter). A central orchestrator/service subscribes to update stores and manage transitions.
    *   **Benefit:** Clearly decouples combat results (Phaser domain) from global state management and mode switching (React/Core domain). Enables easier addition of post-combat effects (achievements, stats).
    *   **Recommendation:** **Maintain Priority for Epic 02 (Basic Combat).** Essential for integrating combat results cleanly using the event bus for appropriate cross-domain communication.
*   **Candidate 3 (New Consideration): Direct Scene Calls (`GatheringService` -> `TerritoryScene`)**
    *   **Current Coupling:** `GatheringService` calls `scene.moveEntityTo()` and `scene.time.delayedCall()`.
    *   **Assessment:** These are necessary imperative scene operations. The coupling is acceptable *provided it's encapsulated* (currently achieved by passing the scene instance into the service function via the adapter).
    *   **Recommendation:** No decoupling needed via event bus. Maintain encapsulation through adapters/services.