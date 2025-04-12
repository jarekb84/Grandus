# Project Vision
- Incremental game focusing on visual scale and automation
- Start with manual resource gathering, evolve into automated systems
- Progressive complexity: introduce mechanics gradually
- Visual feedback is crucial - players should see their progress
- Future plans for multiplayer/cooperative gameplay

# Core Gameplay Loop & Architecture
*   **Primary Loop:** The game revolves around a distinct cycle involving three main views:
    1.  **Territory View (PhaserJS):** Strategic planning, visual gathering management, hex interaction, combat initiation.
    2.  **Management View (React):** Permanent progression hub (upgrades, crafting), goal setting.
    3.  **Combat Scene (PhaserJS):** Active combat execution, depth progression, reward generation.
*   **View Separation:** Maintain clear boundaries and responsibilities between these three core views/scenes.

# Key Game Mechanics & Systems
*   **Progression Systems:**
    *   **Workshop:** Provides *instant*, *permanent* upgrades purchased primarily with *Coins*. Focuses on incremental stat boosts (gathering speed, combat stats, crafting speed, etc.).
    *   **Labs:** Handles *time-gated*, *resource-intensive* research for *major unlocks* (new mechanics, tiers, advanced recipes, core rule changes).
*   **Economy:**
    *   **Dual Currency:** Differentiate between temporary `Cash ($)` (earned/spent within a single Combat run for temporary boosts) and persistent `Coins` (earned via milestones/bosses, spent in Management View for permanent upgrades/research).
*   **Territory:** Use a **hex-based grid** for map representation, node placement, and tracking control/enhancement levels.
*   **Gathering:** Emphasize **visual gathering** where entities physically move on the Territory map. Gathering is initiated globally (e.g., "Gather Stone" button), not by clicking individual nodes.
*   **Combat:** Progression measured by **Depth**. `Enhance Hex` runs should utilize a **Clearing Speed** mechanic to bypass already-mastered early depths. Ammo is a finite, crafted resource.