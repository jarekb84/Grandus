STATUS: completed
TASKS_PENDING: []
# User Story: Visualize Respawn Cycle Progress (04d)

**Epic:** [../epic-01-targeted-expansion-and-resource-setup.md](../epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base/node, implement hex selection for Expand Combat, make initial node depletable/respawnable.

---

## Story Goal

Enhance the visual feedback for resource nodes by adding a dynamic progress indicator (e.g., filling border, progress bar using Phaser Tweens on an overlay sprite or mask) that visually represents the progression through a single `respawn duration` cycle (0% to 100%), providing users with a sense of time until the next capacity increment. This system will rely on targeted update events/signals from the system refactored in Story 04c.

---

## Acceptance Criteria

*   When a resource node begins a respawn cycle:
    *   A visual indicator appears on the node's representation in the Territory view.
    *   This indicator smoothly animates over the duration of the respawn cycle, clearly showing progress from 0% to 100%.
*   When the respawn cycle for a node completes:
    *   The visual progress indicator associated with that node is hidden or reset.
*   The visual representation clearly distinguishes between:
    *   A node that is fully depleted (capacity 0).
    *   A node that is at maximum capacity.
    *   A node that is currently undergoing a respawn cycle (capacity > 0 but < max).
*   The progress animation provides unambiguous feedback about the time remaining in the current respawn cycle.

---

## Notes / Context

*   This story focuses on adding the visual polish for the incremental respawn feature.
*   Critically depends on the targeted update mechanism implemented in Story 04c (Refactor Entity Update Iteration Pattern).
*   Also depends on the incremental respawn logic from Story 04b.
*   Architect Recommendation: Implement this last in the sequence (04a -> 04b -> 04c -> 04d). Use Phaser Tweens triggered by events for smooth, performant animation. Start with an overlay sprite, consider masking if needed.

## User voice Notes (note these were created before the epic architecture overview was done)
### Current Visual Behavior

*   Currently, when a node is depleted after gathering, its visual changes from a full white color to a dark (gray or black) color, representing a depleted state (capacity 0).
*   These changes seem to be static transitions, possibly updating only once per second.

### Desired Visual Behavior: Progress Indicators

*   The current static transition is not sufficient; a sense of *progress* is desired.
*   Instead of discrete, second-by-second changes, the visual should act more like a "loading indicator" or "progress meter" showing the passage of time within a single `respawn duration` cycle (e.g., 5 seconds).
*   Examples of desired visuals include:
    *   A progress bar filling up.
    *   The border around the node filling in.
    *   Some other visual element that represents the cycle time happening from 0% to 100% completion of a single respawn cycle.
*   The purpose is to show the user that the node is in a replenishing cycle and will soon receive its incremental capacity gain (as defined in Story 04a).

### Differentiating Node States Visually

*   There are terminal states that have visuals:
    *   Completely depleted (capacity 0): Currently a dark color (alpha around 0.3), looks gray or black.
    *   Max capacity (full): The node is fully white.
*   A third state that needs a distinct visual is when the node has some capacity (> 0) but is currently undergoing a `respawn duration` cycle to gain more capacity. This is the state that requires the progress visual.
*   The progress visual should indicate that replenishment is underway, but the node is not necessarily fully depleted or fully replenished.

### Technical Considerations (Phaser.js)

*   Acknowledged that entities in the Phaser scene are currently implemented as static sprites, potentially for performance reasons given the possibility of many nodes.
*   A key technical challenge is to determine if there is a performant way within Phaser JS to introduce dynamic progress visuals that update smoothly throughout the cycle duration, rather than just snapping between states.
*   The goal is to avoid updating the game visual state only once per second; a smoother transition is preferred, similar to capabilities found in CSS transitions.
*   The story needs to explore performant methods for adding transitional progress indicators to these sprite-based entities.
---

## Technical Plan (Story Planning - Mode B - Revised for Exploration v2)

### 1. Revised Goal & Approach:
*   **Goal:** Implement an infrastructure within `Territory.scene.ts` to easily test and visually compare 3-5 different animation options for representing the resource node respawn progress (0-100% over the cycle duration).
*   **Approach:** Treat this as an exploratory "spike". Phase 1 focuses on setting up the framework to manage and toggle different visualizers. Phase 2 involves implementing several distinct visual options using Phaser Tweens. Phase 3 (selection, refinement, cleanup) will be handled in a subsequent story.
*   **CRITICAL Prerequisite:** An event `NODE_RESPAWN_PROGRESS` **must be emitted** (likely from `RespawnService.ts` when it calls `initiateRespawnCycle`) via the `eventBus` with the payload: `{ nodeId: string, duration: number }`. This signals the start and total duration of the animation cycle. *This event does not currently exist in the provided codebase and needs to be implemented as part of or before this story.*
*   **Existing Event Usage:** The existing `NODE_VISUAL_STATE_CHANGED` event (with effects `depleted`, `respawning_pulse`, `fully_stocked`) will be used to control the *visibility* (`show`/`hide`) of the active progress visualizer.

### 2. Required Refactoring (Infrastructure):
*   Minor refactoring within `Territory.scene.ts`'s `handleNodeVisualUpdate` method (which listens to `NODE_VISUAL_STATE_CHANGED`) will be needed to integrate the `show()` and `hide()` calls for the active progress visualizer alongside the existing alpha/tint changes for static states.

### 3. Detailed Implementation Tasks (Phased Spike):

**Phase 1: Setup Visualizer Infrastructure**

*   **Task 1.1: Define Visualizer Interface & Manager**
    *   **Files:**
        *   Create `src/features/territory/visuals/RespawnProgressVisualizer.types.ts`
        *   Create `src/features/territory/visuals/RespawnProgressVisualizer.manager.ts`
        *   Modify `src/features/territory/Territory.scene.ts`
    *   **Changes:**
        *   **Define `IRespawnProgressVisualizer` interface** in `...types.ts`:
            ```typescript
            export interface IRespawnProgressVisualizer {
              create(scene: Phaser.Scene, nodeGameObject: Phaser.GameObjects.Sprite): void; // Create visuals as children
              update(duration: number): void; // Start 0-100% tween over duration
              show(): void; // Make visuals visible
              hide(): void; // Hide visuals, stop tween
              destroy(): void; // Clean up visuals and tweens
            }
            ```
        *   **Create `RespawnVisualizerManager` class** in `...manager.ts`:
            *   Constructor takes the `Phaser.Scene`.
            *   `registerVisualizer(type: string, visualizerClass: new () => IRespawnProgressVisualizer)`: Stores visualizer constructors.
            *   `createVisualizer(type: string, nodeId: string, nodeGameObject: Phaser.GameObjects.Sprite)`: Instantiates the selected visualizer type, calls its `create` method, and stores the instance (e.g., `Map<nodeId, IRespawnProgressVisualizer>`). Returns the instance.
            *   `getVisualizer(nodeId: string): IRespawnProgressVisualizer | undefined`.
            *   `removeVisualizer(nodeId: string)`: Calls `destroy` on the instance and removes it.
        *   **In `Territory.scene.ts`:**
            *   Instantiate `RespawnVisualizerManager`.
            *   Add a constant for testing: `ACTIVE_VISUALIZER_TYPE = 'clockwiseBorder';` (or similar default).
            *   Modify `addEntity`: When adding a node, call `visualizerManager.createVisualizer(ACTIVE_VISUALIZER_TYPE, id, sprites.main)`.
            *   Modify `removeEntity`: Call `visualizerManager.removeVisualizer(entityId)`.
            *   Register placeholder/actual visualizer classes (from Phase 2) with the manager.
    *   **Vertical Slice Behavior:** Establishes the core structure and interface for managing different visualizers. Sets up the mechanism for selecting and creating them per node.
    *   **Integration Points:** Integrates with scene's entity lifecycle methods (`addEntity`, `removeEntity`).
    *   **Acceptance Criteria:** Scene compiles and runs. Visualizer manager is instantiated. Placeholders for visualizer creation/destruction exist. Configuration constant exists. No visual change yet.

*   **Task 1.2: Connect Event Handling to Visualizer Manager**
    *   **Files:** `src/features/territory/Territory.scene.ts`.
    *   **Changes:**
        *   **Subscribe to `NODE_RESPAWN_PROGRESS` event:**
            *   Handler retrieves `nodeId` and `duration`.
            *   Gets the visualizer instance using `visualizerManager.getVisualizer(nodeId)`.
            *   If found, calls `visualizer.show()` and `visualizer.update(duration)`.
        *   **Modify `handleNodeVisualUpdate` (handler for `NODE_VISUAL_STATE_CHANGED`):**
            *   Retrieve `nodeId` and `activeEffects`.
            *   Gets the visualizer instance using `visualizerManager.getVisualizer(nodeId)`.
            *   If found:
                *   If `activeEffects` includes `depleted` or `fully_stocked`, call `visualizer.hide()`.
                *   *(Optional Refinement): If `activeEffects` includes `respawning_pulse` BUT the `NODE_RESPAWN_PROGRESS` event isn't guaranteed to fire first, might need to call `visualizer.show()` here too, but ideally the progress event handles the show.*
    *   **Vertical Slice Behavior:** Connects the required events (`NODE_RESPAWN_PROGRESS` and `NODE_VISUAL_STATE_CHANGED`) to the visualizer instances via the manager, triggering their core methods (`update`, `show`, `hide`).
    *   **Integration Points:** Connects event bus signals to the visualizer management structure.
    *   **Acceptance Criteria:** Event handlers are set up and attempt to call methods on the (not yet implemented) visualizer instances. Scene compiles and runs without visual changes.

**Phase 2: Implement Visual Options (Using Phaser Tweens)**

*   **(Template) Task 2.X: Implement [Visualizer Name] Option**
    *   **Files:** Create `src/features/territory/visuals/[VisualizerName].visualizer.ts`. Register class in `Territory.scene.ts`'s manager setup.
    *   **Changes:**
        *   Implement the `IRespawnProgressVisualizer` interface.
        *   `create()`: Create necessary Phaser GameObjects (Graphics, Sprites etc.) as children of `nodeGameObject`. Store references internally (e.g., `this.graphics`, `this.tween`). Initialize visuals as hidden.
        *   `update(duration)`:
            *   If `this.tween` exists, stop it (`this.tween.stop()`).
            *   Configure and start a *new* Phaser Tween (`scene.tweens.add({...})`) targeting properties of the created GameObjects (or a proxy value).
            *   Set the tween's `duration`.
            *   The tween should animate the visual from a 0% state to a 100% state (e.g., tweening `graphics.scaleX` from 0 to 1, or an angle property from 0 to 360).
            *   Use an `onUpdate` callback within the tween if complex drawing based on the tween's value is needed (common for `Graphics`).
            *   Store the new tween in `this.tween`.
        *   `show()`: Set visibility of internal GameObjects to `true`. Reset visual state to 0% before starting tween in `update`.
        *   `hide()`: Set visibility to `false`. If `this.tween` exists, stop it.
        *   `destroy()`: Destroy internal GameObjects and ensure tween is removed.
    *   **Vertical Slice Behavior:** Implements one specific, functional visual progress indicator option, animated via Phaser Tweens.
    *   **Integration Points:** Plugs into the infrastructure created in Phase 1. Is selectable via `ACTIVE_VISUALIZER_TYPE`.
    *   **Acceptance Criteria:** When this visualizer type is selected, it appears correctly on nodes during respawn, animates smoothly over the duration specified in the `NODE_RESPAWN_PROGRESS` event, and hides correctly based on `NODE_VISUAL_STATE_CHANGED` events.

*   **Task 2.1: Implement "Clockwise Border" Option**
    *   Follow template Task 2.X.
    *   Technique: Use `Phaser.GameObjects.Graphics`. In `create`, add a Graphics object. In `update`, tween a value from 0 to 360. In the tween's `onUpdate` callback, `graphics.clear()` and `graphics.lineStyle(...)`, then draw an arc (`graphics.arc(...)`) using the tweened value as the `endAngle`. Use a placeholder color (e.g., gold `0xFFD700`).

*   **Task 2.2: Implement "Underneath Bar" Option**
    *   Follow template Task 2.X.
    *   Technique: Use two `Phaser.GameObjects.Rectangle` (or Graphics `fillRect`). One for background, one for fill, positioned below the `nodeGameObject`. In `update`, tween the `scaleX` property of the fill rectangle from 0 to 1 over the `duration`.

*   **Task 2.3: Implement "Radial Fill" Option**
    *   Follow template Task 2.X.
    *   Technique: Use `Phaser.GameObjects.Graphics`. In `create`, add a Graphics object. In `update`, tween a value from 0 to 360. In the tween's `onUpdate` callback, `graphics.clear()` and `graphics.fillStyle(...)`, then draw a filled pie sector (`graphics.slice(...)` or `graphics.arc(...)` with fill) using the tweened value as the `endAngle`.

*   **Task 2.4: Implement "Pulsing Outline" Option**
    *   Follow template Task 2.X.
    *   Technique: Use a `Phaser.GameObjects.Sprite` with a ring texture (or `Phaser.GameObjects.Arc` with `isStroked=true`). In `update`, tween the sprite/arc's `scale` (e.g., 0.8 to 1.2 and back using `yoyo: true, repeat: -1` for the duration) and possibly `alpha`. *Note: This might not perfectly represent 0-100% progress but offers a different visual style.*

*   **Task 2.5a: Implement "Bottom-Up Border Draw**
    *   Follow template Task 2.X.
    *   Technique: Use Phaser.GameObjects.Graphics. Draw two vertical lines on the sides that grow upwards, possibly connected by arcs at the bottom/top 

*   **Task 2.5b: Implement "Bottom-Up Circle Border Draw**
    *   Follow template Task 2.X.
    *   Technique: Use Phaser.GameObjects.Graphics. Draw the border of a circle from bottom to top over time. Both left and right sides of the border should be drawn at the same time, until they connect at the top of the circle indicating the cycle is complete.

*   **Task 2.6: Implement "Color Shifting Border**
    *   Follow template Task 2.X.
    *   Technique: Use Phaser.GameObjects.Arc (as a static border). Tween its strokeColor through a gradient (e.g., Red -> Yellow -> Green) over duration seconds. 

*   **Task 2.7: Implement "Simple Scaling Indicator**
    *   Follow template Task 2.X.
    *   Technique: A small shape (dot, square) next to the node that tweens its scaleY or scaleX from 0 to 1.

*   **Task 2.8: Implement "Shader Effect**
    *   Follow template Task 2.X.
    *   Technique: Apply a custom shader to the node sprite or a dedicated graphics object. The shader can animate a border, fill, or other effect based on a uniform value (0 to 1).      

### 4. Architectural & Standards Compliance:
*   Maintains separation of concerns (visual logic encapsulated in visualizer classes within `features/territory/visuals/`).
*   Uses Event Bus for communication (assuming prerequisite event is added).
*   Leverages Phaser Tweens for animation.
*   Visual updates handled in Phaser.
*   Fits within the established feature structure.

### 5. Testing Guidance:
*   **Manual Verification:** The primary method.
    *   **Modify `ACTIVE_VISUALIZER_TYPE` constant** in `Territory.scene.ts`.
    *   Run the game.
    *   Deplete a node. Observe: Does the selected visualizer appear? Does it animate smoothly over the correct duration triggered by the (assumed) `NODE_RESPAWN_PROGRESS` event? Does it hide when the node becomes full or depleted again (triggered by `NODE_VISUAL_STATE_CHANGED`)?
    *   Repeat for each implemented visualizer type.

### 6. Dependencies & Integration Points:
*   **Internal:** `eventBus`, `RespawnService` (needs to emit `NODE_RESPAWN_PROGRESS`), `ResourceNode.store` (source of state changes), `Territory.scene.ts` (host environment).
*   **External:** None.
*   **New Libraries:** None.

### 7. Complexity Estimate:
*   **Overall Complexity:** Medium-High (Requires infrastructure setup, prerequisite event handling, and implementation of multiple distinct Phaser Tween/Graphics/Sprite animations).

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