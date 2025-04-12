# System Patterns: Grandus Game

## System Architecture: Core Views & Loop

The game is structured around a core loop involving three distinct views/modes:

1.  **Territory View (PhaserJS Scene):**
    *   **Purpose:** Primary interactive map for strategic planning, visual resource gathering management, territory assessment, and combat initiation.
    *   **Interface:** Top-down 2D scene displaying Home Base, gatherer entities, resource nodes within a hex grid, controlled/adjacent territory. Includes UI overlays for actions and status.
    *   **Functionality:** Manages visual gathering (entity movement to nodes), hex interaction (info panels, `Expand`/`Enhance` actions), node depletion/replenishment visualization. Serves as the entry point to the Combat Scene.

2.  **Management View (React UI):**
    *   **Purpose:** Central hub for permanent progression, resource transformation, and strategic goal setting. Accessed separately from the real-time scenes.
    *   **Interface:** Standard web UI with tabs/sections for different systems.
    *   **Functionality:** Houses Workshop (instant coin upgrades), Labs (timed research), Crafting (resource conversion, ammo/gear creation). Players spend persistent currency (Coins) here.

3.  **Combat Scene (PhaserJS Scene):**
    *   **Purpose:** Dedicated active gameplay phase for resolving combat initiated from the Territory View. Focuses on pushing combat depth.
    *   **Interface:** Top-down or side-view scene displaying player, enemies, projectiles, real-time stats.
    *   **Functionality:** Handles real-time combat, ammo consumption, enemy spawning based on hex context and depth, dual currency rewards ($ for in-run upgrades, Coins for persistent progress), "Clearing Speed" mechanic, and updates hex status (conquest/enhancement) upon completion.

**Interaction Flow:** Players gather resources in the Territory View -> Use resources/Coins in the Management View for upgrades/crafting -> Initiate Combat from Territory View -> Use crafted items/upgrades in Combat Scene to conquer/enhance hexes -> Improved hexes yield more resources back in Territory View.

## Design Patterns & Principles

-   **View Separation:** Clear distinction between strategic/gathering map (Territory), progression hub (Management), and active combat (Combat).
-   **Visual Scale & Automation:** Emphasize visual feedback for progression (territory expansion, gatherer movement) and the transition from manual actions to managing systems.
-   **Incremental Complexity / Progressive Disclosure:** Introduce UI elements, game mechanics (hexes, crafting, Workshop/Labs), and views gradually as the player progresses, avoiding initial overwhelm. UI designed to scale.
-   **Hex-Based Territory:** World map organized using a hex grid for clear spatial representation, interaction, and progression tracking (conquest, enhancement levels).
-   **Node Lifecycle Management:** Resource nodes have states (available, depleted, respawning) with visual indicators and defined replenishment mechanics (timer-based, combat-boosted).
-   **Workshop vs. Labs:** Distinct upgrade paths: Workshop for immediate, incremental coin-based upgrades; Labs for significant, time-gated research unlocks.
-   **Dual Currency System:** Temporary `Cash ($)` earned and spent within a single Combat run for temporary boosts; Persistent `Coins` earned via milestones/bosses for permanent upgrades in Management View.
-   **Crafting & Resource Transformation:** Raw resources gathered are transformed into necessary combat consumables (ammo) or intermediate goods via the Crafting system.
-   **Combat Depth & Clearing Speed:** Combat progression measured by depth; Clearing Speed mechanic mitigates repetitive early stages in `Enhance Hex` runs.
-   **State Separation (Phaser/React):** High-frequency game state (positions, physics) managed within Phaser scenes; lower-frequency summary data synced periodically to React/Zustand for UI display. (Ref: PERFORMANCE_PLAN.MD)
-   **Tiered Update Frequency:** Different game systems update at varying frequencies (e.g., physics@60fps, AI@20fps, UI@6fps) for performance optimization. (Ref: PERFORMANCE_PLAN.MD)
-   **Event Messaging System:** Decoupled communication between React UI and Phaser scenes using a pub/sub event bus. (Ref: STATE_ARCHITECTURE.MD)
-   **Adapter Pattern:** Standardized interfaces (Adapters) for React components to interact with game features/scenes (Territory, Combat). (Ref: STATE_ARCHITECTURE.MD)
-   **Domain-Specific Stores:** Zustand state broken down into smaller, focused stores (e.g., `CombatStore`, `ResourceNodeStore`). (Ref: STATE_ARCHITECTURE.MD)
-   **(Planned) Object Pooling:** For frequently created/destroyed objects like projectiles, particles, and potentially enemies to optimize performance. (Ref: PERFORMANCE_PLAN.MD)
-   **(Planned) Spatial Partitioning:** Grid or quadtree for optimizing collision detection and nearest-neighbor searches at high entity counts. (Ref: PERFORMANCE_PLAN.MD)

## Component Relationships

-   **Game Core:** Orchestrates the switching between Territory, Management, and Combat views/scenes.
-   **Territory View:** Manages gatherer entities, resource nodes, hex grid state. Publishes events for gathering completion, combat initiation requests. Subscribes to hex status updates from Combat.
-   **Management View:** Interacts with Workshop, Labs, and Crafting services/stores. Reads resource/currency stores. Publishes events for upgrade completion, crafting queue updates.
-   **Combat Scene:** Manages player entity, enemy entities, projectiles. Consumes ammo resources. Publishes events for currency earned ($/Coins), depth achieved, run completion (success/failure), and hex status changes. Subscribes to requests to start runs.
-   **Zustand Stores (Domain-Specific):** Hold persistent game state (currency, resources, unlocked upgrades, research progress, hex statuses). Accessed by Management View and synced periodically from Phaser scenes via Adapters/Event Bus.
-   **Adapters:** Bridge the gap between React UI components and Phaser scenes/game logic, exposing specific actions and state slices.
-   **Event Bus:** Facilitates communication between decoupled parts of the system (React <-> Phaser, System <-> System).
-   **Services (Planned):** Encapsulate core domain logic (TerritoryService, CombatService, CraftingService) used by views/scenes. (Ref: STATE_ARCHITECTURE.MD)

## Key Technical Decisions

-   **React/Next.js for UI:** Primarily for the Management View and potentially UI overlays in Phaser scenes. Chosen for component model and ecosystem.
-   **PhaserJs for Game Scenes:** Handles 2D rendering, physics, and real-time interactions in Territory and Combat views via WebGL.
-   **Zustand for State Management:** Lightweight global state management, planned to be broken into domain-specific stores.
-   **TypeScript:** For type safety and maintainability across the codebase.
-   **CSS Modules:** For component-scoped styling.
-   **Decoupled Architecture:** Emphasis on separating concerns using patterns like Adapters, Event Bus, and potentially Services to manage complexity between React and Phaser.
-   **Performance-Minded Design:** Incorporating patterns like state separation, tiered updates, and planning for object pooling/spatial partitioning from the outset.
