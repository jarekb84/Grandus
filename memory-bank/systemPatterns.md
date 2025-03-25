# System Patterns: Grandus Game

## System Architecture
The game is structured around a core loop of three primary modes:

1.  **Gathering Mode:** Focuses on resource collection, initially manual, evolving to automated systems.
2.  **Management Mode:** A React-based UI for managing upgrades, crafting, research, and strategic decisions. Includes systems like Workshop and Labs for progression.
3.  **Combat/Expansion Mode:** PhaserJs-based combat scenarios, involving wave-based defense against geometric enemies.

These modes are interconnected, with resources gathered in Gathering Mode used in Management and Combat modes. Progression in Management Mode enhances efficiency in both Gathering and Combat.

## Design Patterns
- **Incremental Complexity:** New features and mechanics are introduced gradually to prevent player overwhelm and maintain engagement.
- **Visual Scale and Automation:** Emphasis on visually representing progression and automation to provide satisfying feedback.
- **Stage-Based Progression:** Game progression is divided into stages (Wilderness, Town, Region, etc.), each introducing new challenges and opportunities.
- **Resource Transformation:** Early-stage resources can be transformed or upgraded into advanced resources relevant in later stages, maintaining their value throughout the game.
- **Universal Currency with Stage-Specific Resources:** Utilizes universal currencies (coins, gems) alongside stage-specific resources to ensure long-term economic balance and player progression.

## Component Relationships
- **Game Modes:** Core gameplay loop managed by distinct modes that interact and feed into each other.
- **Upgrades Systems (Workshop & Labs):** Drive player progression and enhance capabilities across all game modes.
- **Resource System:** Central to all game modes, providing the necessary inputs for crafting, upgrades, and combat.
- **Combat System:** Provides challenges and rewards that drive resource gathering and management.
- **UI (React) and Game Engine (PhaserJs):** React handles management and UI, while PhaserJs manages the visual and interactive aspects of the Combat and Gathering modes.

## Key Technical Decisions
- **React/Next.js for UI:** Chosen for rapid UI development and iteration, suitable for the Management Mode and overall game structure.
- **PhaserJs for WebGL Graphics:** Selected for handling 2D game visuals and interactive elements in Gathering and Combat modes.
- **Modular Game Modes:** Design decision to separate gameplay into distinct modes to manage complexity and allow for focused development on each aspect.
