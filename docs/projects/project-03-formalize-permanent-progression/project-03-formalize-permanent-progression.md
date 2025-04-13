# Project: Formalize Permanent Progression

## Overall Goal / Objective

Establish the primary long-term progression systems within the Management View. Implement the full Workshop system offering multiple paths for instant, permanent upgrades using `Coins` and resources. Implement the Labs system for time-gated, resource-intensive research leading to major unlocks (new mechanics, tiers, recipes, core rule changes).

## Key Systems/Features Involved (High-Level)

*   **Management View (React):** Implement distinct Workshop and Labs tabs/sections. Design and implement UI for displaying multiple upgrade paths (Workshop) and a research tree/list (Labs). Show upgrade costs, research costs/time, and current progress.
*   **Workshop System:** Define and implement several upgrade tracks (e.g., Gatherer Speed, Gatherer Capacity, Base Combat Stats, Crafting Speed, "Clearing Speed" Effectiveness). Upgrades are purchased with `Coins` and potentially other resources, providing immediate, incremental stat boosts.
*   **Labs System:** Define and implement the core mechanics for research projects. Research costs `Coins`, potentially rare resources, and takes real time to complete. Implement a system for tracking ongoing research. Define initial research goals focusing on significant unlocks (e.g., unlocking additional gatherer units, higher tiers for Workshop upgrades, major efficiency boosts, potentially unlocking the *next* major resource type).
*   **Core Game State:** Track levels of all Workshop upgrades, available/completed/ongoing Lab research projects, associated player stats/capabilities derived from these systems.

## Source Context from Vision Document

> **Prepare & Upgrade (`Management` View):** Invest accumulated resources into permanent upgrades (Workshop, Labs) and craft essential items... to improve future capabilities...

> **Management View (React UI):** The central hub for permanent progression... Players spend persistent currency (Coins) etc. here.
> *   **Permanent Upgrades:** Invest in Workshop (instant buffs) and Labs (timed research) for lasting improvements across all game aspects.

> **Core Systems (Management View):**
> *   **Workshop:** Instant, permanent upgrades via Coins/resources (Gatherer stats, base Combat stats, Crafting speed, "Clearing Speed" effectiveness, node respawn rates, etc.)... Provides steady, incremental power gains.
> *   **Labs:** Time-and-resource-based research for major unlocks (new mechanics, higher tiers, advanced recipes, passive income, core game rule changes)... Facilitates **long-term** progression... Drives significant advancements and unlocks.
> *   **Unlock Targets (Labs):** New game mechanics... additional gatherer units, automation features, new combat abilities/unit types), higher tiers for Workshop upgrades, advanced/complex crafting recipes, passive income streams... major efficiency breakthroughs...

> **Goal Setting:** Players identify desired upgrades or research here, creating the *demand* for specific resources or higher Coin income...

## Notes

*   This project significantly expands the long-term progression vectors available to the player.
*   The specific upgrade paths in Workshop and research projects in Labs need careful design to provide meaningful choices and progression milestones.
*   The UI design for managing potentially numerous upgrades and research projects is important for clarity.
*   This lays the foundation for introducing more complex mechanics and content unlocked via Labs in subsequent projects.