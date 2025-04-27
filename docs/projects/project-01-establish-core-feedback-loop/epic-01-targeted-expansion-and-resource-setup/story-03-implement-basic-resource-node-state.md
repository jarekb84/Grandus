# User Story: Implement Basic Resource Node State (Capacity/Depletion)

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](./epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*
**Status:** completed

---

## Story Goal

Implement the basic state management for resource nodes, specifically handling capacity and depletion states, integrating with the `GatheringService` (from Story 03b). This forms the foundation for detailed mechanics like respawn.

---

## Acceptance Criteria

1.  A dedicated state management solution (e.g., `ResourceNode.store.ts` using Zustand, or integrated into `GameState.store.ts`) is implemented to track the state of individual resource nodes.
2.  Each resource node entity defined in `initialEntityData.ts` includes properties for `maxCapacity` and `currentCapacity`.
3.  The state management solution accurately tracks the `currentCapacity` for each active resource node instance, initialized from `initialEntityData.ts`.
4.  The `GatheringService` includes logic to query the node state management solution to retrieve the `currentCapacity` of a specified resource node before initiating a gather action.
5.  Upon successful completion of a gather action for a specific node, the `GatheringService` updates the node's `currentCapacity` in the state management solution, decrementing it by the gathered amount (typically 1).
6.  The `GatheringService` prevents gathering attempts on nodes whose `currentCapacity` is 0, returning an appropriate status or preventing the action dispatch.

---

## Notes / Context

*   Focuses on establishing the core state management for node capacity and depletion.
*   Depends on the pure gathering functions (Story 03a) and the extracted `GatheringService` (Story 03b).
*   Establishes the core state before respawn logic (Story 04) is added.
*   Architect Feedback: Create `ResourceNode.store.ts` (Zustand) or integrate into `GameState.store.ts` (if simple enough initially). Update `initialEntityData.ts`. The `GatheringService` (from Tech Debt 2/Story 03b) will interact with this store to check/update state during orchestration.
*   This story was derived from Epic '01-Targeted-Expansion-And-Resource-Setup'.

---

## Technical Plan

### 1. Approved Implementation Approach:
*   **Selected Option:** Option 1: Dedicated `ResourceNode.store.ts`
*   **Key Characteristics:** Create a new Zustand store (`ResourceNode.store.ts`) within `src/features/territory/` to manage the capacity state (`currentCapacity`, `maxCapacity`) for individual resource nodes, keyed by their `entityId`.
*   **User Feedback:** Approved Option 1. Analysis confirmed key interaction points. Acknowledged user feedback regarding the "code smell" of mixing graphical and runtime properties in `entities.ts` and `initialEntityData.ts`; this plan proceeds pragmatically for the current story, with type refactoring noted as future work.

### 2. Required Refactoring:
*   None identified *for this story's scope*. (See Architectural Compliance note regarding future type refactoring).

### 3. Detailed Implementation Tasks (Thin Vertical Slices):

*   **Task 1: Define Node Capacity Types and Initial Data (status: complete)**
    *   **Files:**
        *   `src/features/shared/types/entities.ts`
        *   `src/features/territory/initialEntityData.ts`
    *   **Changes:**
        *   In `entities.ts`: Add `maxCapacity: number;` and `currentCapacity: number;` to the `ResourceNodeEntity` interface.
        *   In `initialEntityData.ts`:
            *   Add `maxCapacity?: number;` and `currentCapacity?: number;` to the `InitialEntityData['properties']` interface definition (optional as they only apply to nodes).
            *   For the `stoneNode1` object (and any other initial resource nodes), add `maxCapacity: 1` and `currentCapacity: 1` within its `properties` field. (Adjust values based on game design if needed, e.g., `maxCapacity: 5`).
    *   **Vertical Slice Behavior:** Type definitions and initial static data are updated to include node capacity.
    *   **Integration Points:** These changes prepare the data structures for the state store and converter.
    *   **Acceptance Criteria:** Code compiles. `ResourceNodeEntity` and `InitialEntityData` types include capacity. `stoneNode1` data includes `maxCapacity` and `currentCapacity`.

*   **Task 2: Create and Initialize ResourceNode Store (status: complete)**
    *   **Files:**
        *   `src/features/territory/ResourceNode.store.ts` (New File)
        *   `src/features/territory/initialEntityConverter.ts`
        *   `src/features/core/GameContext.tsx`
    *   **Changes:**
        *   **Create `ResourceNode.store.ts`:**
            *   Define a Zustand store (`useResourceNodeStore`).
            *   State structure: `nodeStates: Map<string, { currentCapacity: number; maxCapacity: number; nodeId: string }>`
            *   Actions:
                *   `initializeNodeState(nodeId: string, maxCapacity: number, currentCapacity: number)`: Adds/updates a node's state in the map.
                *   `decrementNodeCapacity(nodeId: string, amount: number)`: Decrements `currentCapacity` for the node, ensuring it doesn't go below 0.
                *   `getNodeCapacity(nodeId: string): { currentCapacity: number; maxCapacity: number } | undefined`: Returns the capacity state for a given node ID.
                *   `resetStore()`: Clears the `nodeStates` map.
        *   **Update `initialEntityConverter.ts`:**
            *   In `convertInitialEntityDataToEntity` (handling `EntityType.RESOURCE_NODE`):
                *   Read `maxCapacity` and `currentCapacity` from `initialData.properties` (provide defaults if needed).
                *   Add these `maxCapacity` and `currentCapacity` properties to the returned `ResourceNodeEntity` object.
        *   **Update `GameContext.tsx` (Integration):**
            *   Import `useResourceNodeStore` and `EntityType`, `ResourceNodeEntity`.
            *   Inside `initPhaser`, after `addEntity(sceneEntity)` (line ~1751 in repomix):
                ```typescript
                if (sceneEntity.type === EntityType.RESOURCE_NODE) {
                  const { initializeNodeState } = useResourceNodeStore.getState();
                  const maxCap = (sceneEntity as ResourceNodeEntity).maxCapacity ?? 1; // Default if missing
                  const currentCap = (sceneEntity as ResourceNodeEntity).currentCapacity ?? maxCap; // Default to max if missing
                  initializeNodeState(sceneEntity.id, maxCap, currentCap);
                }
                ```
            *   Add `useResourceNodeStore.getState().resetStore();` in the `useEffect` cleanup function (around line 1803 in repomix).
    *   **Vertical Slice Behavior:** The resource node state store is created and correctly initialized with capacity data derived from `initialEntityData` when the game starts.
    *   **Integration Points:** Store integrated into game initialization via `GameContext.tsx` using data from `initialEntityConverter.ts`.
    *   **Acceptance Criteria:** `ResourceNode.store.ts` exists and exports `useResourceNodeStore`. `initialEntityConverter` includes capacity. `GameContext` calls `initializeNodeState`. Store state reflects initial capacities. Application compiles and runs.

*   **Task 3: Integrate Store into Gathering Service (status: complete)**
    *   **Files:**
        *   `src/features/territory/GatheringService.ts`
    *   **Changes:**
        *   Import `useResourceNodeStore`.
        *   In `orchestrateGathering`, before the `try` block (around line 2857 in repomix):
            *   Get state: `const nodeState = useResourceNodeStore.getState().getNodeCapacity(targetNode.id);`
            *   Check capacity: `if (!nodeState || nodeState.currentCapacity <= 0) { console.log(\`Node ${targetNode.id} is depleted.\`); return { gathered: false }; }`
        *   Inside `try`, after gathering delay (around line 2870 in repomix), before moving back:
            *   Decrement capacity: `const yieldAmount = nodeYield ? nodeYield.baseAmount : 1; useResourceNodeStore.getState().decrementNodeCapacity(targetNode.id, yieldAmount);` // Ensure yieldAmount is defined here
    *   **Vertical Slice Behavior:** Gathering checks capacity and updates state, preventing gathering from depleted nodes.
    *   **Integration Points:** `GatheringService` reads/writes to `ResourceNode.store`.
    *   **Acceptance Criteria:** Gathering from depleted nodes is prevented. Successful gathering decrements capacity in the store. Application compiles and runs.

### 4. Architectural & Standards Compliance:
*   Adheres to domain-specific store principle (`05-architecture-patterns.md`).
*   Follows directory structure (`06-directory-structure.md`).
*   Tasks defined as thin vertical slices (`02-development-practices.md`).
*   **Future Refactoring Note:** The current `Entity` type definition (`entities.ts`) and `initialEntityData.ts` mix graphical properties (for Phaser) and runtime state properties (for Zustand). This "code smell" should be addressed in a future refactoring task to bifurcate type definitions and clarify intent.

### 5. Testing Guidance:
*   **Unit Tests:** Test `ResourceNode.store` actions, test `initialEntityConverter` for capacity propagation.
*   **Integration Tests:** Test `GatheringService` integration (capacity check, decrement).
*   **Manual Verification:** Verify initial store state, successful gathering decrement, prevention of gathering from depleted nodes.

### 6. Dependencies & Integration Points:
*   **Module Dependencies:** `zustand`.
*   **Internal Dependencies:** `initialEntityData`, `initialEntityConverter`, `entities.ts`, `GameContext`, `GatheringService`.
*   **External Dependencies:** None.
*   **New Libraries:** None.

### 7. Complexity Estimate:
*   **Overall Complexity:** Low-Medium.
*   **Estimated Effort:** Small.

---

## Embedded Epic Context for Downstream Processing

<!-- ROO CONTEXT - DO NOT MODIFY MANUALLY -->
<!--
Epic Path: ./epic-01-targeted-expansion-and-resource-setup.md
Epic Title: 01-Targeted-Expansion-And-Resource-Setup
Story Title: Implement Basic Resource Node State (Capacity/Depletion)
Epic Goal Summary: Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the Expand Combat action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. (Refines existing Territory view for targeted actions and correct initial state).
Project Context (if available in Epic):
  Project Title: project-01-establish-core-feedback-loop
  Project Goal: Implement the minimum viable gameplay loop connecting the core views: Gather Stone in Territory View, initiate Expand Combat, earn persistent Coins from Combat success (e.g., clearing Wave 1), spend Coins in a minimal Management View to unlock basic Stone-to-Pebble crafting, use crafted Pebbles to conquer the first Hex (e.g., clear Wave 1), and have the conquered Hex reveal a better/new Stone node.
-->