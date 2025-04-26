# User Story: Tech Story: Refactor/Implement Resource Node State Management

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](./epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

---

## Story Goal

Establish state management for resource node capacity/respawn according to `STATE_ARCHITECTURE.md`. Create `ResourceNodeStore` (Zustand) and potentially a `ResourceService`. Refactor relevant components (`TerritoryScene`, `useTerritoryAdapter`, potentially `ResourceSystem`) to use this new structure, improving SRP and DI alignment.

---

## Acceptance Criteria

*   A Zustand store (`ResourceNodeStore` or similar) exists and is responsible for managing the state of individual resource nodes (e.g., capacity, respawn timers).
*   Logic related to resource node state transitions (e.g., depletion, respawn initiation/completion) is encapsulated outside of direct scene/component manipulation, likely within the `ResourceNodeStore` or an associated `ResourceService` if deemed necessary during technical planning.
*   `TerritoryScene` no longer directly manages or mutates resource node capacity or respawn state.
*   Gathering logic interacts with the new state management structure (`ResourceNodeStore` and/or `ResourceService`) to correctly update node state upon resource collection.
*   The existing `ResourceSystem`'s responsibilities related to node state are either integrated into the new structure or the system is appropriately refactored/replaced to avoid redundant state management, as determined during technical planning.
*   Relevant adapters (e.g., `useTerritoryAdapter`) interact with the new state management structure for accessing or triggering updates to node state, rather than manipulating scene objects directly for this purpose.
*   The implementation aligns with the patterns described in `STATE_ARCHITECTURE.MD`.

*(Note: The specific implementation details regarding the necessity and exact role of `ResourceService`, the final state of `ResourceSystem`, and the full scope of adapters to refactor will be finalized during the `architect-planner` phase based on code analysis.)*

---

## Notes / Context

*   This is a prerequisite technical story added based on architect feedback to improve architectural alignment before implementing node mechanics.
*   Focus is on establishing the correct state management structure (Store/Service) and refactoring interactions.
*   This story was derived from Epic '01-Targeted-Expansion-And-Resource-Setup' as part of the initial breakdown and subsequent architectural review.

## Status

status: done_grooming

---

## Embedded Epic Context for Downstream Processing

<!-- ROO CONTEXT - DO NOT MODIFY MANUALLY -->
<!--
Epic Path: ./epic-01-targeted-expansion-and-resource-setup.md
Epic Title: 01-Targeted-Expansion-And-Resource-Setup
Epic Goal Summary: Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the Expand Combat action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. (Refines existing Territory view for targeted actions and correct initial state).
Project Context (if available in Epic):
  Project Title: project-01-establish-core-feedback-loop
  Project Goal: Implement the minimum viable gameplay loop connecting the core views: Gather Stone in Territory View, initiate Expand Combat, earn persistent Coins from Combat success (e.g., clearing Wave 1), spend Coins in a minimal Management View to unlock basic Stone-to-Pebble crafting, use crafted Pebbles to conquer the first Hex (e.g., clear Wave 1), and have the conquered Hex reveal a better/new Stone node.
-->