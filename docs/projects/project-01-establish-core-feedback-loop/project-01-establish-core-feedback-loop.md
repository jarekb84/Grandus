# Project: Establish Core Feedback Loop

## Overall Goal / Objective

Implement the minimum viable gameplay loop connecting the core views: Gather Stone in Territory View, initiate Expand Combat, earn persistent Coins from Combat success (e.g., clearing Wave 1), spend Coins in a minimal Management View to unlock basic Stone-to-Pebble crafting, use crafted Pebbles to conquer the first Hex (e.g., clear Wave 10), and have the conquered Hex reveal a better/new Stone node.

## Key Systems/Features Involved (High-Level)

*   **Territory View (PhaserJS):** Basic visual gathering (Stone), Hex selection/interaction, `Expand Combat` initiation.
*   **Combat Scene (PhaserJS):** Basic enemy spawning, Wave/Depth tracking, awarding persistent `Coins` upon reaching milestones (e.g., Wave 1 clear), basic player entity firing Pebbles, Hex conquest trigger (e.g., Wave 10 clear).
*   **Management View (React):** Minimal UI showing `Coin` balance, a single research/unlock option ("Learn Rock Breaking") costing Coins, basic Stone -> Pebbles crafting recipe unlocked via the research.
*   **Core Game State:** Tracking `Coin` currency, unlocked recipes, conquered Hex status, node availability/state.

## Source Context from Vision Document

> **Gameplay Pillars:** The core gameplay loop involves a cycle of planning, preparation, and execution...
> 1.  **Plan & Gather (`Territory` View):** Observe the game world, manage active resource gathering... decide on the next strategic action (`Expand` or `Enhance Hex`).
> 2.  **Prepare & Upgrade (`Management` View):** Invest accumulated resources into permanent upgrades (Workshop, Labs) and craft essential items (ammo, gear)...
> 3.  **Execute & Progress (`Combat` Scene):** Engage in active combat... Push combat depth... earn rewards, conquer new territory (`Expand`)...

> **Territory View (PhaserJS Scene):** The primary interactive map where players visually command entities to gather resources (Stone...)... serves as the strategic overlay for inspecting hex details and initiating combat actions (`Expand` / `Enhance Hex`).
> *   **Visual & Spatial:** Entities physically travel between Home Base and nodes.
> *   **Hex Interaction:** Clicking hexes provides contextual information and actions (`Expand`/`Enhance`).

> **Management View (React UI):** The central hub for permanent progression and crafting... Players spend persistent currency (Coins) etc. here.
> *   **Resource Conversion:** Craft gathered resources into essential combat items (ammo...)...
> *   **Goal Setting:** This is where players review upgrade costs and research goals, informing their resource needs...

> **Combat Scene (PhaserJS Scene):** The dedicated view for active combat engagements, triggered by actions in the Territory View. Players focus on surviving, defeating enemies, and pushing combat depth.
> *   **Depth Progression:** Success is measured by depth achieved...
> *   **Dual Rewards:** ...persistent currency (Coins) for Management Mode progression.
> *   **Territory Conquest (`Expand`):** Successfully completing an `Expand` run... changes the target hex's status to "Controlled" on the Territory map, revealing its nodes...

> **Initial Focus (MVP - Refined):**
> 1.  **`Territory View` Basics (PhaserJS):** Scene with Home Base, one gatherer entity, one resource type (Stone nodes)... Implement visual movement... Basic resource inventory tracking. Implement "Gather Stone" button...
> 2.  **Basic Hex Interaction (Territory View):** Allow clicking on the Home Base hex and one adjacent hex... Add `Expand Combat` button...
> 3.  **Basic `Combat Scene` (PhaserJS):** Triggered by `Expand Combat`. Simple scene with player entity firing basic projectiles (consuming Stone/Pebbles)... Implement a basic **Depth/Distance** counter...
> 4.  **Core Loop Link:** Successfully completing (`Expand`) the Combat run... changes the target hex status to "Controlled" in the Territory View and reveals its Stone node(s).
> 5.  **Basic `Management View` (React):** Minimal view... Implement Coin currency (awarded simply for completing a combat run). Allow purchasing one basic Workshop upgrade (e.g., +Pebble Damage) using Coins. *(Note: Plan changed to use Coin for crafting unlock first)*
> 6.  **Basic Crafting (Management View):** Implement simple Stone -> Pebbles crafting recipe. Update Territory/Combat to use Pebbles as primary ammo if available.

> *(User Context Summary):* Focus on the loop: Gather 1 Stone -> Attack Hex -> Clear Wave 1 -> Get 1 Coin -> Unlock Management -> Research Rock Breaking (costs Coin) -> Gather Stone -> Craft Pebbles -> Clear Wave 10 -> Conquer Hex -> Unlock better Stone node.

## Notes

*   This project establishes the absolute core feedback loop. Numbers (wave requirements, costs, resource amounts) are illustrative and need tuning.
*   Focus on connecting the views and ensuring the reward from Combat (Coins) enables progress in Management (Crafting), which in turn enables deeper Combat and Territory expansion.