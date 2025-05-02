STATUS: grooming_needed
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