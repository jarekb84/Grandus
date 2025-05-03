# Event Bus Communication Guidelines

## 1. Purpose

This document outlines architectural principles and best practices for using the application-wide Event Bus. The goal is to facilitate decoupled communication between different system components (e.g., Zustand Stores, Phaser Scenes, React UI, Services) while maintaining clear boundaries and avoiding unintended coupling. Adhering to these guidelines helps ensure maintainability, testability, and extensibility.

## 2. Core Principles

*   **Semantic Events:** Emitters should publish events describing ***semantic state changes*** or ***meaningful domain occurrences*** within their own context. They should communicate *what* happened, not *how* subscribers should react.
*   **Data Payloads:** Event payloads should carry the minimal, essential ***data*** required for subscribers to understand the state change or occurrence. This data should be relevant to the domain event itself.
*   **Subscriber Interpretation:** Subscribers are responsible for interpreting the received event and data ***within their own context*** (e.g., graphics rendering, UI state update, triggering another service). They translate the semantic event into concrete actions specific to their domain.
*   **Boundary Respect:** The event bus acts as a mediator. Emitters should not have knowledge of subscriber implementation details, and subscribers should not need to know the internal workings of the emitter beyond the event contract.

## 2a. When to Use Which Pattern (Event Bus vs. Direct Calls)

Choosing the right communication method is crucial for maintainability. Here’s a guide:

### Use the Event Bus When:

*   **Communicating Across Domains/Layers:** The primary use case. Examples:
    *   A **Store** emitting a semantic state change (`NODE_DEPLETED`) for a **Phaser Scene** or **React UI** to react to independently.
    *   A **Phaser Scene** emitting a significant domain event (`COMBAT_ENDED`) for a **Core Service** or **React UI** to handle (e.g., updating global state, changing UI modes).
    *   A **React Component** emitting a request (`GATHER_RESOURCE_REQUESTED`) for a **Service** to fulfill, avoiding direct component-to-service coupling.
    *   A **Service A** emitting an event (`PROCESS_A_COMPLETE`) that **Service B** needs to react to, without Service A needing direct knowledge of Service B.
*   **Decoupling Emitter from Subscribers:** You want the emitter to simply announce *what happened* without knowing *who* is listening or *how* they will react.
*   **One-to-Many Communication:** A single event needs to trigger actions in multiple, independent subscribers.

**Avoid Using the Event Bus When:**

*   **Simple Intra-Domain State Updates:** A service or component within a specific feature domain needs to update the state managed by that same domain's store (e.g., `GatheringService` updating `ResourceNodeStore`). Use direct store action calls instead.
*   **Complex, Sequential Orchestration with Waits:** Your logic requires a specific sequence of actions across systems where each step must complete before the next begins, especially involving `async/await` or specific timings (like the `GatheringService` orchestrating movement, waiting, updating state, moving back). Direct calls (potentially orchestrated by a Service or Adapter) are usually clearer and more manageable for this. `mitt` is fire-and-forget and not suited for this.
*   **Replacing Direct Function Calls Unnecessarily:** If a clear, direct function call within a logical boundary achieves the goal simply, introducing an event adds unnecessary indirection.

### Use Direct Zustand Store Calls When:

*   **Updating/Reading State Within the Same Domain:** A Service, React Hook, or Component belonging to a specific feature (e.g., Territory) needs to directly interact with the state managed by that feature's store (e.g., `ResourceNodeStore`).
    *   *Example:* `GatheringService` calling `useResourceNodeStore.getState().decrementNodeCapacity()`.
*   **Encapsulated State Logic:** The store provides the primary API for modifying its managed state according to defined actions.

### Use Direct Phaser Scene Calls When:

*   **Imperative Scene Operations:** You need to command a specific Phaser scene to perform actions inherent to its responsibilities (graphics, physics, timers, particles, scene-specific logic).
    *   *Examples:* `scene.moveEntityTo()`, `scene.time.delayedCall()`, `scene.add.particles()`.
*   **Encapsulation:** These direct calls should ideally be *encapsulated* within a responsible Service (like `GatheringService`) or an Adapter (`useTerritoryAdapter`) that holds a reference to the scene instance. This hides the raw scene API from higher-level UI components or less related services. The Adapter/Service provides a domain-specific interface that internally interacts with the scene.

**In Summary:** Use the **Event Bus** for decoupling across boundaries. Use **Direct Store Calls** for state management within a domain. Use **Direct Scene Calls** (via Adapters/Services) for imperative scene control.
## 3. Emitter & Subscriber Responsibilities

*   **Emitter (e.g., Store, Service):**
    *   Identifies significant state changes or domain events within its scope.
    *   Defines a clear event contract (event name + payload type) representing the semantic meaning.
    *   Populates the payload with necessary identifiers (`nodeId`, `userId`, etc.) and relevant state attributes (`newStatus`, `currentValue`, `activeEffects`).
    *   Emits the event via the shared `eventBus`.
    *   **Avoid:** Including UI-specific details (colors, CSS classes, animation names), rendering instructions, or assumptions about how the event will be handled.

*   **Subscriber (e.g., Scene, React Component, Service):**
    *   Subscribes to relevant events using `eventBus.on()`.
    *   Implements handler functions that receive the strongly-typed payload.
    *   Interprets the semantic meaning of the event and payload data based on its *own* responsibilities (e.g., updating graphics, setting React state, calling another service).
    *   Contains all logic for *how* a specific state is represented or acted upon within its domain.
    *   Unsubscribes using `eventBus.off()` when appropriate (e.g., component unmount, scene shutdown) to prevent memory leaks.
    *   **Avoid:** Calling back to the emitter for more information based on the event, making assumptions about the emitter's internal state beyond the payload, or handling logic outside its core responsibility.

## 4. Payload Design

*   **Focus on State/Occurrence:** Payloads should describe the resulting state or the event that occurred.
    *   *Good:* `{ nodeId: string; activeEffects: ('depleted' | 'respawning' | 'full')[]; }` (Describes node state)
    *   *Good:* `{ userId: string; achievementId: string; unlockedAt: number; }` (Describes an occurrence)
    *   *Bad:* `{ nodeId: string; operation: 'setTint'; value: 0xff0000; }` (Describes a visual instruction)
*   **Use Primitive Types or Simple DTOs:** Prefer standard data types (string, number, boolean, arrays/objects of these) for payloads. Avoid passing complex class instances or functions.
*   **Extensibility:** Design payloads with future additions in mind. Using objects or arrays (like `activeEffects`) can be more extensible than numerous boolean flags.
*   **Minimal Data:** Only include data essential for understanding the event. Subscribers needing more contextual data should typically get it from their own state sources or dedicated query functions/stores, not by requesting it back from the emitter based on the event.

## 5. Handling Compound States/Effects

Subscribers are responsible for handling scenarios where multiple states are active simultaneously (e.g., a node is both 'depleted' and 'respawning').

*   **Recommended Pattern (in Subscriber):**
    1.  Reset relevant state/visuals to a default/base state.
    2.  Check for the presence of different relevant states/effects in the payload (e.g., using `payload.activeEffects.includes('effect_name')` or `if (payload.isDepleted)`).
    3.  Apply the corresponding actions/visuals for each active state.
    4.  Optionally, include specific logic for handling *combinations* of states if a unique representation is required (e.g., `if (isDepleted && isRespawning) { /* apply special combined visual */ }`). This combination logic resides *only* within the subscriber.

## 6. Litmus Test for Coupling Risk (Heuristics)

Use these questions to evaluate the design of new events and assess potential coupling risks. Assign conceptual points (e.g., 1 point for minor concern, 3 for moderate, 5 for high) for "Yes" answers.

1.  **Payload Content:** Does the payload contain specific UI implementation details (hex colors, CSS classes, animation names, specific pixel values) or direct rendering/action instructions?
    *   _(High Risk - 5 points)_
2.  **Emitter Knowledge:** Does the *emitter* need to know *how* any specific subscriber will react visually or functionally to implement the event correctly? (e.g., Does the Store need to know the Scene uses tints vs. alpha?)
    *   _(High Risk - 5 points)_
3.  **Subscriber Callback:** Does the *subscriber*, upon receiving the event, need to immediately call back to the emitter or query another unrelated system *just* to get the necessary data to process the event? (Note: Querying its *own* relevant state store is often fine).
    *   _(High Risk - 5 points)_
4.  **Event Specificity:** Is the event name or payload structure tailored *very* specifically to the needs of only one known subscriber, rather than representing a more general domain concept?
    *   _(Moderate Risk - 3 points)_
5.  **Payload Size:** Is the payload excessively large, potentially pushing significant amounts of state instead of just signaling a change and providing key identifiers/deltas?
    *   _(Moderate Risk - 3 points)_
6.  **Source of Truth:** Does the event attempt to establish a *new* source of truth for data that properly belongs in a state store? (Events signal changes; stores hold state).
    *   _(Moderate Risk - 3 points)_

**Interpreting the Score (Conceptual Thresholds):**

*   **0-5 Points (Green):** Likely well-decoupled. Good design following principles.
*   **6-10 Points (Yellow):** Moderate coupling risk. Re-evaluate the event name, payload, and responsibilities. Is there a simpler, more semantic way? Can the subscriber derive necessary info from its own sources? Is the payload too large?
*   **11+ Points (Red):** High coupling risk. Strongly indicates a violation of boundary principles. Redesign is likely needed. The emitter might be dictating implementation, the subscriber might be missing context, or the event itself might represent the wrong abstraction.

## 7. Examples

*   **Scenario:** Updating resource count display in React UI when gathered in Phaser Scene.
    *   **Good:** `ResourceNodeStore` (after being updated by `GatheringService`) emits `RESOURCE_STORE_UPDATED` with payload `{ updatedResources: { [ResourceType.STONE]: 10 } }`. A React hook `useInventoryAdapter` subscribes, reads the payload, and updates its local state derived from `useResourcesStore`.
    *   **Bad:** `GatheringService` emits `UPDATE_INVENTORY_UI` with payload `{ stoneCount: 10 }`. Couples the service directly to the UI's needs.
    *   **Worse:** `GatheringService` emits `SET_STONE_TEXT` with payload `{ text: 'Stone: 10' }`.

*   **Scenario:** Combat scene ending.
    *   **Good:** `CombatScene` emits `COMBAT_ENDED` with payload `{ finalWave: number; rewards: { coins: number; cash?: number }; hexId: string; }`. `GameContext` or a dedicated service listens, triggers currency updates via store actions, and potentially triggers a game mode switch.
    *   **Bad:** `CombatScene` calls `useCurrencyStore.getState().addCoins(100)` and `useGameContext().setActiveScene(GameMode.TERRITORY)` directly within its own logic.

## 8. Evolution

These guidelines provide a starting point. As the application grows, review and refine these principles based on observed patterns and challenges. If a particular event pattern consistently feels awkward or leads to coupling issues, consider refactoring the event contract or the responsibilities of the involved components.