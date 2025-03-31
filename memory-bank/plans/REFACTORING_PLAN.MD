# Refactoring Plan: Prototype to GAMEPLAN.MD Vision

This document outlines the incremental steps to refactor the existing prototype towards the refined vision described in `docs/GAMEPLAN.MD` and the updated Memory Bank. Each step aims to be a committable vertical slice.

## Phase 1: Territory View Foundation & Renaming

**1. Rename Gathering -> Territory:**
    *   **Goal:** Establish the new naming convention across the codebase.
    *   **Actions:** Rename files (`Gathering.tsx` -> `Territory.tsx`, `Gathering.scene.ts` -> `Territory.scene.ts`, etc.), update `GameMode` enum, update component imports and usage (`ModeSelector`, `GameContent`, `GameCanvas`), rename adapter (`useGatheringAdapter` -> `useTerritoryAdapter`).
    *   **Vertical Slice:** The application remains functionally identical but uses the new terminology.
    *   **Status:** `[x]` (Completed 2025-03-30)

**2. Basic Hex Grid Overlay (Visual Only):**
    *   **Goal:** Introduce the visual concept of the hex grid.
    *   **Actions:** Modify `Territory.scene.ts` (`create` method) to draw a static, visual hex grid overlay onto the scene background.
    *   **Vertical Slice:** The Territory view now displays a hex grid; gathering mechanics remain unchanged.
    *   **Status:** `[x]` (Completed 2025-03-30)

**3. Basic Hex Interaction (Click & Log):**
    *   **Goal:** Implement the basic mechanism for interacting with hexes.
    *   **Actions:** In `Territory.scene.ts`, add input listeners (e.g., `this.input.on('pointerdown', ...)`). On click, calculate the logical hex coordinates based on the click position and the grid layout. Log the identified hex coordinates/ID to the console.
    *   **Vertical Slice:** Users can click on the map, and the corresponding hex is identified (visible in console logs).
    *   **Status:** `[x]` (Completed 2025-03-30)

## Phase 2: Connecting Territory & Combat

**4. Combat Initiation Button & Mode Change:**
    *   **Goal:** Shift combat initiation from a tab/mode switch to an action within the Territory view.
    *   **Actions:**
        *   Add a temporary "Expand Combat (Test Hex)" button to `TerritoryActions.tsx`.
        *   Wire this button through `Territory.tsx` and `useTerritoryAdapter` to call a new method (e.g., `requestCombatStart`) on the adapter/`GameCanvasHandle`.
        *   Implement `requestCombatStart` in `GameCanvas.tsx` to stop the `TerritoryScene` and start the `CombatScene`.
        *   Remove the "Combat" tab/button from `ModeSelector.tsx`.
    *   **Vertical Slice:** Combat is now started via a button in the Territory view, reflecting the new game flow.
    *   **Status:** `[x]` (Completed 2025-03-30)

**5. Basic Hex Context Passing (Placeholder):**
    *   **Goal:** Establish the pattern of passing context (the target hex) from Territory to Combat.
    *   **Actions:**
        *   Modify `requestCombatStart` to accept and pass a dummy hex ID (e.g., `"test-hex-1"`).
        *   Modify `CombatScene`'s `init` method (Phaser scenes have an `init` method that receives data) to accept this data object `{ hexId: string }`. Log the received `hexId` in the `CombatScene`'s `create` method.
    *   **Vertical Slice:** The Combat scene now receives (and logs) context about which hex is being targeted, even if it's just placeholder data for now.
    *   **Status:** `[x]` (Completed 2025-03-30)

## Phase 3: Introducing Basic Management & Crafting

**6. Basic Management View UI & Crafting Button:**
    *   **Goal:** Create the initial structure for the Management view and the first crafting interaction.
    *   **Actions:**
        *   In `Management.tsx`, replace placeholder text with distinct sections/divs for "Workshop" and "Crafting".
        *   Add a button within the "Crafting" section: "Craft 10 Pebbles (Cost: 1 Stone)".
    *   **Vertical Slice:** The Management tab now shows basic sections and a functional (though not yet wired) crafting button.
    *   **Status:** `[x]` (Completed 2025-03-30)

**7. Implement Basic Crafting Logic (Stone -> Pebbles):**
    *   **Goal:** Implement the core logic for the first crafting recipe.
    *   **Actions:**
        *   Add `PEBBLE` to the `ResourceType` enum (`src/features/shared/types/entities.ts`).
        *   Update the `ResourcesState` interface (`src/features/shared/stores/Resources.types.ts`) and the initial state in `Resources.store.ts` to include `PEBBLE: 0`.
        *   Wire the "Craft Pebbles" button in `Management.tsx` to call a function.
        *   This function will interact with `useResourcesStore`:
            *   Check `hasResource(ResourceType.STONE, 1)`.
            *   If true, call `removeResource(ResourceType.STONE, 1)`.
            *   Call `addResource(ResourceType.PEBBLE, 10)`.
        *   Update `Inventory.tsx` (likely requires updating `useInventoryAdapter`) to display the Pebble count.
    *   **Vertical Slice:** Players can now convert Stone into Pebbles via the Management view, and the inventory UI reflects this.
    *   **Status:** `[x]` (Completed 2025-03-30)

**8. Use Pebbles as Ammo:**
    *   **Goal:** Connect the crafting output (Pebbles) to the Combat system's input (ammo).
    *   **Actions:**
        *   Modify `Combat.system.ts` (`update` method's shooting logic) to check for and consume `ResourceType.PEBBLE` instead of `ResourceType.STONE`. Use `hasResource` and `removeResource` from `useResourcesStore`.
        *   Update the ammo count synchronization logic in `Combat.system.ts`, `CombatScene.ts`, and `useCombatGame.ts` to read/update based on the `PEBBLE` count in `ResourcesStore`.
        *   Update the UI display (`GameControls.tsx`, potentially `Combat.tsx`) to show "Pebbles: X" instead of "Ammo: X".
    *   **Vertical Slice:** The full loop is complete for the MVP's core resource: Gather Stone (Territory) -> Craft Pebbles (Management) -> Use Pebbles in Combat.
    *   **Status:** `[ ]`

## Phase 4: UI/UX Refinements (Post-MVP Core Loop)

**9. Hex Hover Visual Feedback:**
    *   **Goal:** Provide visual indication when the mouse is over a hex.
    *   **Actions:** Implement `pointermove` listener in `TerritoryScene.ts`. Calculate hovered hex coordinates. Apply/remove a visual effect (e.g., tint, scale change, highlight graphic) to the hovered hex.
    *   **Vertical Slice:** Hovering over hexes provides immediate visual feedback in the Phaser scene.
    *   **Status:** `[ ]`

**10. Selected Hex Visual Feedback:**
    *   **Goal:** Keep the last clicked hex visually distinct.
    *   **Actions:** In `TerritoryScene.ts`, store the coordinates of the last clicked hex. Apply/remove a persistent visual effect (different from hover) to the selected hex.
    *   **Vertical Slice:** Clicking a hex makes it visually distinct until another hex is clicked.
    *   **Status:** `[ ]`

**11. Basic Hex Info Panel (React):**
    *   **Goal:** Display basic information about the selected hex in the React UI.
    *   **Actions:**
        *   Create a new React component `HexInfoPanel.tsx`.
        *   Modify `TerritoryScene.ts`'s click handler to emit an event (`hex:selected`, via adapter/event bus) with the clicked hex coordinates.
        *   Modify `useTerritoryAdapter` to listen for `hex:selected`, store the selected coordinates in React state.
        *   `HexInfoPanel` reads the selected coordinates, fetches basic hex data (e.g., coordinates, maybe terrain type later) from Zustand (requires state setup), and displays it.
    *   **Vertical Slice:** Clicking a hex displays its basic info in a dedicated React panel.
    *   **Status:** `[ ]`

## Future Phases (Further Post-MVP Refinement)

*   Integrate architectural patterns (Event Bus, Domain Stores, etc.) more deeply.
*   Implement detailed hex interactions (info panels, `Enhance Hex`).
*   Flesh out Management View (Workshop/Labs upgrades).
*   Refine Combat Scene (Depth, Clearing Speed, Dual Currency).
*   Consolidate instruction files (`.clinerules`, `.cursorrules`).
*   Implement performance optimizations as needed.
