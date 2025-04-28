## Technical Story: Refactor Gathering Logic & Decouple Scene Visuals

**Goal:** Stabilize the resource gathering functionality, fix identified bugs and hardcoded values, and decouple the TerritoryScene's visual updates from direct store knowledge, addressing SRP violations.

**User Impact:** Gathering buttons will correctly reflect resource availability. Gathering different resource types (beyond stone) will function correctly. Visual inconsistencies (colors/tints) on resource nodes should be resolved.

**Acceptance Criteria:**

*   Gathering buttons in `TerritoryActions` are disabled if no suitable, available nodes exist for the corresponding `ResourceType`.
*   Clicking a "Gather" button successfully initiates gathering for the *correct* resource type by finding the nearest available node that yields that resource.
*   The `TerritoryScene` no longer directly subscribes to or reads internal state from `ResourceNodeStore`.
*   Visual states (normal, depleted, respawning) for resource nodes are correctly displayed based on events or simplified state updates, without conflicting with base entity colors.
*   Update `GatheringService`
    *   Hardcoded `homeBaseId` is replaced with a dynamic lookup.
    *   Yield calculation functions are extracted (duration, yield type, amount)
*   Update ResourceNode.store.ts 
    *   Hardcoded `playerId` is replaced with a dynamic lookup.
    *   The `useCallback` dependency array  is corrected.
    *   The `hasAvailableNodeType` check is reintroduced (somehow to prevent the user from clicking on a resource type that can't be gathered from)
*   Change lightweightNodes type definition to a better name, more indicative of what its intent is
    *   Alternatively, revisit the purpose of GameStateStore tracking nodes
*   Update ResourceNode.store.ts 
    *  to move isRespawning and respawnEndTime to NodeRespawnMechanics
    *  move yields to NodeCapacity (potentially, maybe see if this belongs in another NodeGatheringMechanics property)
    * revisit implementation of getResourceNodeIdsOfType, instead of iterating through all nodes, should we keep track of nodes by Type or nodeIds by type, then do a get of the nodes data by id
*   Verify gatheringUtils comments and types look valid (comments not stale, correct use of type defs)
*   Revisit intent of convertInitialEntityDataToEntity, do we still need it or should we reconsider this abstraction.
*   InitialEntityData add named color values for the hex codes
*   Application compiles and runs without errors or regressions related to these changes.