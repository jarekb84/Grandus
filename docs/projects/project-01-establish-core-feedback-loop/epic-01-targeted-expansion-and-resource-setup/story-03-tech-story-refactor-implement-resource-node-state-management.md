# User Story: Tech Story: Refactor/Implement Resource Node State Management

**Epic:** [`epic-01-targeted-expansion-and-resource-setup.md`](./epic-01-targeted-expansion-and-resource-setup.md)
**Epic Goal:** Align home base and initial Stone node within specific hexes in Territory View. Implement hex selection to target the `Expand Combat` action specifically at an adjacent hex. Set up the initial home Stone node to be depletable/limited (e.g., 1 Stone capacity, slow respawn) as per the loop requirements. *(Refines existing Territory view for targeted actions and correct initial state).*

---

## Story Goal

Establish state management for resource node capacity/respawn according to `STATE_ARCHITECTURE.md`. Create `ResourceNodeStore` (Zustand) and optionally a `ResourceService`. Refactor relevant components (`TerritoryScene`, `useTerritoryAdapter`, potentially `ResourceSystem`) to use this new structure, improving SRP and DI alignment.

---

## Initial Acceptance Criteria (Optional Placeholder)

*   [Placeholder: A Zustand store (`ResourceNodeStore` or similar) exists to manage the state of individual resource nodes (capacity, respawn timers, etc.).]
*   [Placeholder: A Service layer (`ResourceService` or similar) potentially exists to encapsulate complex logic related to node state updates, if needed.]
*   [Placeholder: `TerritoryScene` no longer directly manages node capacity/respawn state.]
*   [Placeholder: Gathering logic interacts with the new store/service to update node state.]
*   [Placeholder: Existing `ResourceSystem` is refactored or replaced to align with the new architecture.]
*   [Placeholder: Relevant adapters (`useTerritoryAdapter`) interact with the new store/service instead of direct scene manipulation for node state.]

---

## Notes / Context

*   This is a prerequisite technical story added based on architect feedback to improve architectural alignment before implementing node mechanics.
*   Focus is on establishing the correct state management structure (Store/Service) and refactoring interactions.
*   This story was derived from Epic '01-Targeted-Expansion-And-Resource-Setup' as part of the initial breakdown and subsequent architectural review.

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