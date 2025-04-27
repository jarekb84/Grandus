**Status:** completed

**UI Panel to Monitor Application State**

**Summary**
The speaker is undertaking state refactoring involving Zustand stores and Phaser scenes. Finding current debugging methods (console logs) insufficient, they propose building a dedicated UI panel to display the application's state in real-time for improved visibility.

**Context: Refactoring State and Debugging Needs**

*   A significant amount of refactoring will be done around state management.
*   This involves determining what state resides in the Zustand stores and what is registered within the Phaser scenes.
*   Currently, debugging relies on adding debugging or console log statements to the UI.
*   There is a desire to add a more structured debugging tool.

**Proposed Solution: State Debug Panel**

*   Instead of just debugging statements, the speaker wants to add a dedicated section or panel on the screen.
*   This panel's purpose is to show the current state of every single store and the objects within them.
*   Given the current number of items is not excessively large, having this panel on the side is manageable.

**Panel Design and Location**

*   The panel is pictured as being on the right side of the screen.
*   It could be absolutely positioned on the top right or simply on the right side wherever there is free space.
*   A screenshot in a chat was referenced to illustrate the concept of a scrollable panel on the right side.

**Content - Zustand Stores**

*   The panel should include a separate section for each Zustand store.
*   Specific Zustand stores mentioned:
    *   Resource Notes store
    *   Resources store
    *   Game State store
    *   Currency store
    *   Combat store
*   Each section should display the state of that store in a formatted JSON output.
*   Each store section should be expandable and collapsible, which is helpful if a section contains a large amount of data.

**Content - Phaser Entities**

*   The panel should ideally also display the state of the entities stored on the Phaser side.
*   Currently, there are two Phaser scenes:
    *   The Territory scene
    *   The Combat scene
*   Displaying the contents of the Phaser scenes is noted as potentially less critical, partly due to uncertainty about how to access that data effectively.

**Real-time Updates**

*   A main requirement is that the panel updates every time one of the Zustand stores is updated.

**Analogy**

*   The desired functionality is described as similar to Redux DevTools, but specifically for Zustand.

---

**Acceptance Criteria**

1.  **Given** the application is running, **when** the debug panel is enabled, **then** a dedicated panel is visible on the screen (e.g., positioned on the right).
2.  **Given** the debug panel is visible, **then** it displays a distinct, labeled, and initially expanded section for the `Resource Nodes` store state.
3.  **Given** the debug panel is visible, **then** it displays a distinct, labeled, and initially expanded section for the `Resources` store state.
4.  **Given** the debug panel is visible, **then** it displays a distinct, labeled, and initially expanded section for the `Game State` store state.
5.  **Given** the debug panel is visible, **then** it displays a distinct, labeled, and initially expanded section for the `Currency` store state.
6.  **Given** the debug panel is visible, **then** it displays a distinct, labeled, and initially expanded section for the `Combat` store state.
7.  **Given** a store section is displayed, **when** the corresponding Zustand store's data is examined, **then** the panel accurately reflects this data in a readable format.
8.  **Given** the debug panel is visible, **when** data changes in any of the listed Zustand stores, **then** the corresponding section in the panel updates automatically to show the new data.
9.  **Given** the debug panel is visible, **when** a user interacts with a store section's header (e.g., clicks it), **then** that section collapses or expands accordingly.
10. **Given** the Territory scene is active, **when** the debug panel is visible, **then** it displays a section attempting to show relevant entity data from the Territory scene. *(Note: Reflects uncertainty in description)*
11. **Given** the Combat scene is active, **when** the debug panel is visible, **then** it displays a section attempting to show relevant entity data from the Combat scene. *(Note: Reflects uncertainty in description)*

---

**Notes**

*   Investigate feasible methods for accessing and displaying entity state from active Phaser scenes (Territory, Combat) within the debug panel. The initial requirement is less critical than Zustand store display due to potential technical challenges.

---

**Glossary**

*   **Zustand store:** Referred to as "Zustan store" or "store." Used consistently to refer to the state management stores.
*   **Phaser scene:** Referred to as "phasor scene." Used consistently to refer to distinct areas or levels within the Phaser framework.

---

## Technical Plan

### 1. Approved Implementation Approach
*   **Selected Option:** Single `StateVisualizer` React component.
*   **Key Characteristics:** Creates a dedicated debug panel component that imports and uses hooks from all required Zustand stores directly. Renders each store's state within a collapsible section using formatted JSON. Integrates into the main application layout. Includes placeholders for Phaser scene data.
*   **User Feedback:** N/A (Proceeding directly to plan as requested).

### 2. Required Refactoring
*   None identified.

### 3. Detailed Implementation Tasks (Thin Vertical Slices)

*   **Task 1: Create Basic State Visualizer Component & Integrate** (Status: complete)
    *   **Files:**
        *   Create `src/features/debug/StateVisualizer.tsx`
        *   Modify `src/features/core/GameWrapper.tsx`
    *   **Changes:**
        *   In `StateVisualizer.tsx`: Create a basic React functional component `StateVisualizer`. Add structure (e.g., `div` with title "State Visualizer"). Style it for visibility on the right (e.g., fixed width, background, position via flexbox in parent). Export it.
        *   In `GameWrapper.tsx`: Import `StateVisualizer`. Render `<StateVisualizer />` within the `GameUI` component's `relative flex gap-4` div, adjusting layout as needed.
    *   **Vertical Slice Behavior:** A visible, empty placeholder panel appears on the right side of the main game UI.
    *   **Integration Points:** Integrated into the main UI layout in `GameWrapper.tsx`.
    *   **Acceptance Criteria:**
        *   A new panel titled "State Visualizer" is visible on the right side.
        *   Panel does not yet display store data.
        *   Application compiles and runs without errors or regressions.

*   **Task 2: Implement Zustand Store Display (All Stores)** (Status: complete)
    *   **Files:**
        *   Modify `src/features/debug/StateVisualizer.tsx`
        *   (Requires hooks from: `src/features/territory/ResourceNode.store.ts`, `src/features/shared/stores/Resources.store.ts`, `src/features/shared/stores/GameState.store.ts`, `src/features/shared/stores/Currency.store.ts`, `src/features/combat/Combat.store.ts`)
    *   **Changes:**
        *   In `StateVisualizer.tsx`:
            *   Import hooks for each Zustand store (e.g., `useResourceNodeStore`, `useResourcesStore`, `useGameStateStore`, `useCurrencyStore`, `useCombatStore`).
            *   Call hooks to get current state.
            *   Create a reusable `StoreSection` sub-component (within the same file initially) taking `title` (string) and `data` (object) props.
            *   `StoreSection` renders:
                *   Clickable header displaying `title`.
                *   Collapsible content area (use `useState` for expansion state).
                *   Inside content: `<pre>{JSON.stringify(data, null, 2)}</pre>`.
                *   Implement expand/collapse logic.
            *   Render a `StoreSection` for each store, passing the title and state object.
    *   **Vertical Slice Behavior:** Panel displays collapsible sections for each Zustand store with live, formatted JSON data.
    *   **Integration Points:** Uses Zustand store hooks.
    *   **Acceptance Criteria:**
        *   Sections for ResourceNodes, Resources, GameState, Currency, Combat stores are displayed.
        *   Each section shows current store state as formatted JSON.
        *   Sections are collapsible/expandable via header click.
        *   State display updates automatically on store changes.
        *   Application compiles and runs without errors or regressions.

*   **Task 3: Add Phaser Entity Placeholders** (Status: complete)
    *   **Files:**
        *   Modify `src/features/debug/StateVisualizer.tsx`
    *   **Changes:**
        *   In `StateVisualizer.tsx`:
            *   Add two more `StoreSection` instances.
            *   Titles: "Territory Scene Entities", "Combat Scene Entities".
            *   Data: Placeholder object/message (e.g., `{ status: "Data access not yet implemented" }`).
            *   Ensure sections are collapsible.
    *   **Vertical Slice Behavior:** Panel includes placeholder sections for Phaser entity data.
    *   **Integration Points:** None beyond the component itself.
    *   **Acceptance Criteria:**
        *   Sections for "Territory Scene Entities" and "Combat Scene Entities" display placeholder content.
        *   Sections are collapsible.
        *   Application compiles and runs without errors or regressions.

### 4. Architectural & Standards Compliance
*   Adheres to feature-based directory structure (`06...`).
*   Component is presentational, using hooks for state (`05...`).
*   Follows naming and coding standards (`07...`).

### 5. Testing Guidance
*   **Unit Tests:** Test the `StoreSection` sub-component for rendering and collapse/expand logic. Test `StateVisualizer` by mocking store hooks to ensure sections are rendered correctly.
*   **Integration Tests:** Verify the `StateVisualizer` integrates correctly into `GameWrapper` layout.
*   **Manual Verification:** Run the application, interact with features that modify stores (e.g., gathering resources, changing game mode), and verify the panel updates correctly and remains usable. Check collapse/expand functionality.

### 6. Dependencies & Integration Points
*   **Module Dependencies:** Relies on existing React context and Zustand stores.
*   **External Dependencies:** None new.
*   **Integration:** Renders within `GameWrapper.tsx`. Reads state from multiple Zustand stores. Includes placeholders acknowledging difficulty in direct Phaser state access from React.

### 7. Complexity Estimate
*   **Overall Complexity:** Low-Medium
*   **Estimated Effort:** ~2-4 hours (Component creation, hook integration, styling, placeholder setup)