# Project: Content Expansion - Wilderness Stage

## Overall Goal / Objective

Flesh out the initial "Wilderness" stage with more diverse content to provide richer gameplay within the established loop. Introduce new basic resource types (e.g., Food), more complex crafting recipes (e.g., Slingshot requiring Wood and Stone derivatives), new enemy types with varied behaviors or stats, and potentially the first significant boss encounter marking a major progression milestone within the stage.

## Key Systems/Features Involved (High-Level)

*   **Territory View (PhaserJS):** Add new resource nodes (e.g., Food source) to be discovered in conquered hexes. Potentially introduce hexes with unique characteristics or resource combinations.
*   **Management View (React):** Implement new crafting recipes unlocked via Labs/progression (e.g., Slingshot, potentially requiring intermediate components). Update resource displays.
*   **Combat Scene (PhaserJS):** Introduce new enemy types (e.g., faster "Line" enemies, tougher "Triangle" enemies) with distinct visual representations and potentially different stats/behaviors. Design and implement a first boss encounter triggered at a specific depth or via a special `Expand`/`Enhance` action, offering significant rewards (`Coins`, rare resources, recipe unlocks?).
*   **Core Game State:** Track inventory for new resources, unlocked recipes, potentially boss defeat status.

## Source Context from Vision Document

> **Evolving Systems:** Introduce complexity within systems over time, such as new resource types... deeper crafting chains (e.g., Stone -> Pebbles -> Specialized Ammo)... advanced Lab research, and more sophisticated Combat options...

> **Crafting:** Convert raw resources into usable items (ammo types, gear, components)... Recipe discovery via Labs/progression. Includes examples like Stone -> Pebbles, Slingshot.
> *   **Outputs:** Combat consumables (various ammo types), permanent equipment (like the Slingshot)...
> *   **Recipe Unlocks:** New recipes discovered through Lab research...

> **Enemy Progression:**
> *   Each enemy's difficulty level represented visually by geometric complexity: Dot -> Line -> Triangle -> Square...
> *   **Bosses:** Larger circles (hollow), or other distinct complex shapes, representing significantly tougher encounters at major **distance milestones** providing significant rewards.
> *   Enemy density, type variety, and individual strength scale based on the **distance achieved**...

> **Stages:**
> * Wilderness
> * Town
> * ... *(Implies content should be somewhat stage-specific)*

> **Special Resources:** Rare crafting materials (e.g., Leather, Crystals) might drop from specific enemy types or bosses. *(Relevant for boss rewards)*

## Notes

*   This project focuses on adding breadth and depth to the existing mechanics within the first defined stage ("Wilderness").
*   Introduction of the Slingshot provides a tangible equipment upgrade beyond basic pebble throwing.
*   The first boss serves as a key challenge and progression gate, reinforcing the loop by providing substantial rewards upon defeat.
*   Balancing new resources, recipes, and enemy difficulty is crucial.