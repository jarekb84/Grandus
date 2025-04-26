# Epic: 01-Targeted-Expansion-And-Resource-Setup

## Epic Goal

*   Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

## Status

*   Proposed

## Linked Project

*   **Project File:** [`project-01-establish-core-feedback-loop.md`](../project-01-establish-core-feedback-loop.md)
*   **Overall Project Goal:** Implement the minimum viable gameplay loop connecting the core views: Gather Stone in Territory View, initiate Expand Combat, earn persistent Coins from Combat success (e.g., clearing Wave 1), spend Coins in a minimal Management View to unlock basic Stone-to-Pebble crafting, use crafted Pebbles to conquer the first Hex (e.g., clear Wave 10), and have the conquered Hex reveal a better/new Stone node.

## Scope & Key Features (for this Epic)

*   Refactor Territory View (PhaserJS) to place the Home Base entity visually centered within a designated home hex.
*   Place the initial Stone resource node visually centered within the home hex.
*   Implement logic for the initial Stone node to have a limited capacity (e.g., 1 Stone) and a slow respawn/replenish rate.
*   Implement hex selection interaction: Clicking an adjacent, uncontrolled hex highlights it and sets it as the target for the `Expand Combat` action.
*   Modify the `Expand Combat` button logic to only initiate combat against the currently selected target hex.
*   Ensure visual feedback for hex selection (e.g., highlight, outline).

## Out of Scope (for this Epic)

*   Implementing the actual Combat Scene.
*   Awarding any currency (`Coins` or `$`).
*   Handling conquest logic or revealing nodes on conquered hexes.
*   Placing nodes outside the home hex initially.
*   Gathering from nodes outside the home hex.

## Embedded Project Context

*   **Relevant Project Sections:**
    *   From Project Goal: Gather Stone in Territory View, initiate Expand Combat... conquer the first Hex... reveal a better/new Stone node.
    *   From Key Systems: Territory View (PhaserJS): Basic visual gathering (Stone), Hex selection/interaction, `Expand Combat` initiation.
    *   From Source Context (MVP Refined): `Territory View` Basics (PhaserJS): Scene with Home Base, one resource type (Stone nodes)... Basic Hex Interaction (Territory View): Allow clicking on the Home Base hex and one adjacent hex... Add `Expand Combat` button...
    *   From User Context: ...move the player base into the middle of one of these hexes and add a stone patch that depletes... select a node that I haven't really discovered before. And then I can maybe attack it... the initial stone patch near me in my home base maybe only has one stone. And it replenishes every second.

## Notes / Design Links / Dependencies (Optional)

*   Requires existing PhaserJS Territory scene setup with hex grid.
*   Requires existing basic gathering logic (to be adapted for limited node).
*   Requires existing `Expand Combat` button (logic to be modified).

## Architect Review Report (Post-Story 2 - 2025-04-26)

*(Full report embedded below, replacing previous summary)*

### Architectural Rules & Strategic Doc Analysis Summary:
*   **`05-architecture-patterns.md`:** Key principles: SRP, State Separation, Domain-Specific Stores, Adapter Pattern, **Functional Design/Testability (prioritizing pure functions, isolating side effects, simple signatures)**.
*   **`06-directory-structure.md`:** Key principles: Feature-based organization, file naming.
*   **`STATE_ARCHITECTURE.md`:** Key principles: Domain-Specific Stores, **Service Layer (for orchestration)**, Standardized Adapter Pattern, Event Bus.
*   **`PERFORMANCE_PLAN.md`:** Key principles: State Separation, Tiered Update Frequency.
*   **General Rules (`01`, `02`):** Key principles: Territory View responsibilities, Incremental Vertical Slices, combining refactoring with features.

### Code Discovery & Analysis Summary (Based on `repomix-output.xml` & User Feedback):
*   **Phase 1 (Primary Target):** `Territory.scene.ts`, `Resource.ts`, `GameState.store.ts`, `useTerritoryAdapter.ts`, `initialEntityData.ts`.
*   **Phase 2/3/4 (Code Analysis & References):**
    *   `Territory.scene.ts`: **Confirms SRP violation.** Contains rendering, sprite management, *and* complex gathering orchestration logic (`initiateGathering`) including node finding, movement calls, hardcoded waits, and event triggering. Lacks hex click input handling and node state logic.
    *   `features/territory/Resource.ts`: **Confirmed unused.** Contains duplicated/unnecessary gathering logic and a potentially useful `calculateResourceYields` function. Its class structure and potential scene coupling are undesirable.
    *   `GameState.store.ts`: Lacks node capacity/state/respawn data.
    *   `useTerritoryAdapter.ts`: Calls scene methods directly.
    *   `initialEntityData.ts`: Lacks node capacity/respawn properties.
*   **Phase 5 (Synthesis):** `Territory.scene.ts` is overloaded, specifically with gathering orchestration logic relevant to upcoming Stories 03 & 04. `Resource.ts` needs cleanup/removal. Implementing node state (Story 03) requires extracting the existing gathering orchestration first to avoid compounding complexity, aligning with SRP and the user's preference for functional separation.

### Overall Assessment:
*   **Plan Feasibility:** Goals require new systems. Implementing them without prior refactoring of `Territory.scene.ts` gathering logic is high risk.
*   **Architectural Alignment:** Current gathering logic in `Territory.scene.ts` violates SRP. `Resource.ts` is dead code. Plan must introduce refactoring technical stories first to align with SRP, Functional Design preferences, and `STATE_ARCHITECTURE.md` (Service Layer).
*   **Key Dependencies/Risks:** Story 04 depends on Story 03. Story 03 depends on Story 03b. Story 03b depends on Story 03a. The primary risk is adding state management onto the existing complex gathering logic within the scene.

### High-Level Plan Alignment & Status (`./docs/` files vs. Discovered Code):
*   **`STATE_ARCHITECTURE.md`/`05-architecture-patterns.md` Alignment:** Plan requires modification to extract orchestration logic (Service Layer) and use pure functions (Functional Design) *before* implementing domain state stores (Story 03), addressing the scene's SRP issues.
*   **Current Status & Update Suggestions:** Plan requires significant revision: Prioritize technical stories (03a, 03b) to refactor gathering orchestration out of the scene and clean up `Resource.ts` before implementing node state features (Story 03).

### Story-Specific Feedback (Relating to Final Plan):
*   **(New Story 03a): Create Pure Functions for Gathering Logic & Clean Up Resource.ts**
    *   **Assessment:** Essential refactoring.
    *   **Suggestions:** Create pure utility functions (e.g., in a new `features/territory/gatheringUtils.ts`) for `findNearestNodeOfType` and `calculateYield`. Remove unused `ResourceSystem` and dead code from `features/territory/Resource.ts`. Focus: Pure refactoring, functional extraction, dead code removal. Aligns with Functional Design preference.
*   **(New Story 03b): Extract Gathering Orchestration from Territory Scene**
    *   **Assessment:** Essential refactoring.
    *   **Suggestions:** Create a new `GatheringService` (or similar) responsible *only* for orchestrating the gathering sequence (find, move, interact, wait, move back, trigger). Modify `Territory.scene.ts::initiateGathering` and `useTerritoryAdapter` to call this service. Focus: Pure refactoring, moving orchestration logic out (SRP). Aligns with Service Layer pattern. Depends on Story 03a.
*   **(New Story 03): Implement Basic Resource Node State (Capacity/Depletion)**
    *   **Assessment:** New development, essential goal. Depends on 03a & 03b.
    *   **Suggestions:** Create `ResourceNode.store.ts` or integrate into `GameState.store.ts`. Update `initialEntityData.ts`. The `GatheringService` (from Story 03b) interacts with this store.
*   **(New Story 04): Add Respawn Logic to Node State**
    *   **Assessment:** Feasible after Story 03. Adds respawn logic.
    *   **Suggestions:** Focus on adding respawn logic and initial values to the system built in Story 03. Depends on Story 03.
*   **(New Story 05a): Implement Hex Grid Interaction & Selection State Management**
    *   **Assessment:** New development. Can be done after Story 04. Prerequisite for 05, 06, 07.
    *   **Suggestions:** Create `HexInteractionManager` (or similar), handle input, manage selection state, establish communication.
*   **(Existing Story 05): Implement Adjacent Hex Selection**
    *   **Assessment:** Feasible. Depends on Story 05a.
*   **(Existing Story 06): Add Visual Feedback for Selected Hex**
    *   **Assessment:** Feasible. Depends on Story 05a.
*   **(Existing Story 07): Target Expand Combat Action to Selected Hex**
    *   **Assessment:** Feasible. Depends on Story 05a.

### Recommended Plan Adjustments & Final Order (Reflected in Generated Stories):
1.  **Execute Story 03a:** Create pure functions, clean up `Resource.ts`.
2.  **Execute Story 03b:** Extract gathering orchestration from `Territory.scene.ts`.
3.  **Execute Story 03:** Implement Node State Store/Service (Capacity/Depletion).
4.  **Execute Story 04:** Add Respawn logic to the Node State Store/Service.
5.  **Execute Story 05a:** Implement Hex Interaction Manager.
6.  **Execute Story 05:** Implement Adjacent Hex Selection.
7.  **Execute Story 06:** Add Visual Feedback.
8.  **Execute Story 07:** Target Expand Combat.

---
*Generated by Roo `project-epic-generator` mode.*