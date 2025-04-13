# Project: Territory Deepening & Combat Rewards

## Overall Goal / Objective

Introduce more depth to the Territory View and Combat Scene. Implement the `Enhance Hex` action, allowing players to improve controlled hexes by pushing combat depth. Link combat depth achieved to tangible bonuses (yield/respawn rate) on the hex. Introduce the second core resource (Wood) and the temporary `Cash ($)` currency earned during combat runs, used for immediate in-run upgrades.

## Key Systems/Features Involved (High-Level)

*   **Territory View (PhaserJS):** Add Wood resource nodes. Display Hex Depth level and associated bonuses in the info panel for controlled hexes. Implement `Enhance Hex` button/action for controlled hexes. Visual feedback for node replenishment/enhanced state.
*   **Combat Scene (PhaserJS):** Handle `Enhance Hex` context (potentially different scaling or starting point than `Expand`). Track and display `Cash ($)` earned during the run. Implement a basic in-run upgrade panel accessible during combat, allowing players to spend `Cash ($)` on temporary stat boosts (e.g., damage, attack speed). Link max depth achieved in `Enhance` runs back to the Territory View to update Hex status/bonuses.
*   **Management View (React):** Update resource displays to include Wood. (No major functional changes needed in this project, focus is on Territory/Combat).
*   **Core Game State:** Track Hex Depth levels, associated bonuses, Wood inventory, `Cash ($)` balance (reset per run).

## Source Context from Vision Document

> **Plan & Gather (`Territory` View):** ...assess territory status, identify needs/opportunities, and decide on the next strategic action (`Expand` or `Enhance Hex`).
> **Execute & Progress (`Combat` Scene):** Engage in active combat... Push combat depth within the targeted hex to earn rewards... or improve existing territory (`Enhance Hex`).

> **Territory View (PhaserJS Scene):** ...visually command entities to gather resources (Stone, Wood, etc.)... strategic overlay for inspecting hex details and initiating combat actions (`Expand` / `Enhance Hex`).
> *   **Hex Interaction:** Clicking hexes provides contextual information and actions (`Expand`/`Enhance`).
> *   **Info Panel (Controlled Hex):** Shows resources present... current **Depth Level / Max Wave Cleared**, current yield/respawn bonuses resulting from that depth... Provides an **`Enhance Hex`** button.

> **Combat Scene (PhaserJS Scene):** ...pushing combat **depth** to achieve objectives (...improve hex yield/bonuses).
> *   **Depth Metric:** Progress is measured by **depth achieved**... Pushing deeper in `Enhance` runs increases the target hex's Depth Level, directly boosting its yield/respawn bonuses shown in the Territory View.
> *   **Dual Currency Rewards:**
>     *   `Cash ($)`: Earned from defeating standard enemies during the run. Spent *only* within the current run via an accessible **in-run upgrade panel** for temporary boosts... This currency is lost when the run ends.
>     *   `Coins`: The primary persistent currency... Used back in Management Mode...
> *   **Hex Improvement (`Enhance`):** Reaching higher depths permanently increases the target hex's yield multiplier, reduces respawn timers, or grants other bonuses visible in the Territory View info panel.

> **Node Replenishment:** Nodes replenish via... **Combat-Triggered Boosts:** Successful `Enhance Hex` combat runs may grant temporary yield/respawn speed boosts to nodes within that specific hex...

## Notes

*   This project adds crucial layers to the core loop: making controlled territory improvable (`Enhance Hex`) and introducing immediate, tactical rewards within combat (`Cash ($)`).
*   The exact nature of hex bonuses (yield %, respawn time reduction) and in-run upgrades needs definition and balancing.
*   Introduction of Wood provides a second resource vector, paving the way for more complex crafting/upgrades later.