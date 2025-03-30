# **Game Development Plan**

## **High-Level Themes**

*   **Visual Scale and Automation:**
    *   Visually experience scale and growth, not just numeric increases. Expansion and territory status represented on an interactive **Territory View**.
    *   Begin with **active visual gathering** within the Territory View, evolving gradually into more automated systems, providing visually rewarding progression (inspired by Dyson Sphere Program and Factorio).
*   **Cooperative Gameplay (Future Phase):**
    *   Collaborative progression with guilds/alliances to achieve mutual goals.
    *   Mechanisms allowing players to help each other speed up progression and enhance collective power.
*   **Progressive Complexity:**
    *   Gradually introduce new gameplay mechanics (Territory interaction/enhancement, deeper crafting, diverse upgrades) and UI elements within the Territory and Management views.
    *   Expose increasing complexity over time to maintain player engagement without initial overwhelm.
*   **Incremental Progression (Active & Passive Balance):**
    *   Clear incremental growth, both visually (territory expansion on map, gatherer movement) and numerically (stats, combat depth achieved).
    *   Meaningful offline progression (Gathering simulation, potential passive Coin income) complements focused active gameplay sessions within the **Combat Scene** (initiated from the Territory View), encouraging regular player engagement without mandating excessive active playtime.


## **Detailed Vision and Mechanics**
### **Visual Scale and Automation**

*   Players begin as a single entity **actively gathering resources by moving on screen within the Territory View**, evolving into managing larger entities (town → region → planet → solar system → galaxy → multiverse) and potentially automated gatherers/combat units also operating within this view.
*   Automation gradually reduces *manual clicks* for gathering initiation but retains visual activity (e.g., seeing multiple gatherers work on the Territory map), enhancing visual and numerical satisfaction in progression.
*   Scale visually represented through clear incremental tiers (distance units changing during combat: meters -> km -> AU) and the **expanding, interactive territory shown on the Territory View map**.

### **Progressive Complexity**

*   Initial gameplay features minimal UI complexity: the basic **Territory View** showing Home Base, nearby nodes, and a "Gather Stone" button. Management and Combat are unlocked progressively via early goals or research.
*   **Layering Mechanics:** Introduce complexity incrementally by unlocking new systems and interactions: **Territory View** reveals more hexes/zones, info panels, and combat initiation options (`Expand`/`Enhance Hex`); **Management View** unlocks tabs (Workshop, Labs, Crafting); **Combat Scene** complexity grows (new enemy types, deeper mechanics).
*   **Evolving Systems:** Introduce complexity within systems over time, such as new resource types requiring specific gathering techniques or tools, deeper crafting chains (e.g., Stone -> Pebbles -> Specialized Ammo), advanced Lab research, and more sophisticated Combat options (unit roles, abilities). *(This bullet point is reinstated from an earlier version for its concrete examples)*

### **Incremental and Offline Progression**

*   **Active Phase 1 (`Territory` View):** Players actively manage gathering (initiating via buttons, entities move visually) and make strategic decisions by interacting with the map (clicking hexes, viewing info, deciding whether to `Expand` or `Enhance Hex`). This phase accumulates resources and sets the stage for combat.
*   **Active Phase 2 (`Combat` Scene):** Triggered by choosing `Expand` or `Enhance Hex` in the Territory view. Focused sessions where the player pushes combat **depth** (distance/waves cleared) within the context of the chosen hex. Provides primary rewards (Coins, Cash, special resources) and directly improves the targeted hex (conquers it on Expand, increases its Depth Level/bonuses on Enhance).
*   **Progression Hub (`Management` View):** A separate interface (likely React-based) where players spend persistent resources (Coins etc.) on permanent upgrades (Workshop, Labs) and craft items. This is where long-term goals are set, driving the need for resources obtained via the Territory/Combat cycle.
*   **Offline Simulation:** Primarily simulates the **Gathering** aspect based on conquered territory, available nodes, and gatherer stats. May also include passive Coin generation if unlocked via Labs/special hexes. Ensures meaningful progress while away.

### **Cooperative Gameplay (Future Phase)**

*   Guild mechanics for cooperative resource management and progression:
    *   Players can submit requests for resources or assistance.
    *   Guild research increases the effectiveness of cooperative actions.
    *   Shared benefits from guild actions create a cyclical loop of mutual improvement.

## **Gameplay Pillars**

The core gameplay loop involves a cycle of planning, preparation, and execution, primarily interacting through three key interfaces/modes:

1.  **Plan & Gather (`Territory` View):** Observe the game world, manage active resource gathering, assess territory status, identify needs/opportunities, and decide on the next strategic action (`Expand` or `Enhance Hex`).
2.  **Prepare & Upgrade (`Management` View):** Invest accumulated resources into permanent upgrades (Workshop, Labs) and craft essential items (ammo, gear) to improve future capabilities based on strategic goals.
3.  **Execute & Progress (`Combat` Scene):** Engage in active combat triggered from the Territory View. Push combat depth within the targeted hex to earn rewards, conquer new territory (`Expand`), or improve existing territory (`Enhance Hex`).

### Key Interfaces & Modes

*   **1. Territory View (PhaserJS Scene):** The primary interactive map where players visually command entities to gather resources (Stone, Wood, etc.) from spatial nodes within controlled hexes. This view also serves as the strategic overlay for inspecting hex details and initiating combat actions (`Expand` / `Enhance Hex`).
    *   **Visual & Spatial:** Entities physically travel between Home Base and nodes. Map visually represents controlled/targetable territory (e.g., via hex grid).
    *   **Dual Function:** Combines active resource gathering management with strategic planning and combat initiation.
    *   **Hex Interaction:** Clicking hexes provides contextual information and actions (`Expand`/`Enhance`).
    *   **Node Lifecycle:** Nodes deplete visually and replenish over time or via game events/combat success.

*   **2. Management View (React UI):** The central hub for permanent progression and crafting, accessed separately (likely via a main UI tab). Players spend persistent currency (Coins) etc. here.
    *   **Permanent Upgrades:** Invest in Workshop (instant buffs) and Labs (timed research) for lasting improvements across all game aspects.
    *   **Resource Conversion:** Craft gathered resources into essential combat items (ammo, gear), intermediate goods, or other equipment.
    *   **Goal Setting:** This is where players review upgrade costs and research goals, informing their resource needs and strategic decisions back in the Territory View.

*   **3. Combat Scene (PhaserJS Scene):** The dedicated view for active combat engagements, triggered by actions in the Territory View. Players focus on surviving, defeating enemies, and pushing combat depth.
    *   **Active Engagement:** Real-time gameplay requires managing finite crafted ammo and potentially using abilities.
    *   **Contextual Challenge:** Difficulty and rewards are based on the specific hex being Expanded into or Enhanced.
    *   **Depth Progression:** Success is measured by depth achieved (distance/waves cleared), which improves the targeted hex's status/yield.
    *   **Dual Rewards:** Earn temporary currency ($) for in-run upgrades and persistent currency (Coins) for Management Mode progression.

## **Enemy Progression**

*   Each enemy's difficulty level represented visually by geometric complexity:
    *   **Dot:** Easiest enemy, minimal threat.
    *   **Line:** Slightly harder, increased threat.
    *   **Triangle:** More challenging, higher damage, and health.
    *   **Square (and Rectangle):** Further increased difficulty, stronger stats.
    *   **Pentagon and Beyond:** Progressively tougher enemies with more sides.
    *   **Bosses:** Larger circles (hollow), or other distinct complex shapes, representing significantly tougher encounters at major **distance milestones** providing significant rewards.
*   Enemy density, type variety, and individual strength scale based on the **distance achieved** within a Combat/Expansion run. Tougher geometric shapes become more common and appear in greater numbers the further the player progresses. Specific enemy types or modifiers might be tied to certain zones encountered (as represented on the Strategic Map).

## **Visual Style Inspiration**

*   **Clarity and Simplicity:** The UI emphasizes simplicity, clarity, and immediate feedback using clean lines and easily readable geometric shapes for entities and resources. Bright, contrasting colors enhance readability during active gameplay.
*   **Minimalist Information Display:** UI elements remain minimalist, focusing attention on the action. Key real-time metrics (Distance, Ammo, Health, Currencies) are clearly visible but unobtrusive during Combat/Gathering.
*   **Visual Feedback:** Projectiles, impacts, node depletion/replenishment, status effects, and player actions should have clear, simple visual indicators and animations.
*   **Sense of Motion (Combat):** Combat view incorporates visual cues suggesting forward motion (e.g., background parallax) to reinforce the feeling of expansion.
*   **Progressive Disclosure & UI Scalability:** This is a core principle. The game starts with a very minimal interface (e.g., just the Gathering scene and a "Gather Stone" button). New UI elements, panels, tabs (like Inventory, Management sub-tabs, Combat stats), and even entire game modes/screens are **introduced gradually only as the player unlocks the relevant mechanics** through progression or completing introductory objectives (e.g., gathering enough resources, earning first Coins). The UI architecture should be designed to **scale cleanly**, allowing new elements to be added or revealed within the existing structure without overwhelming the player or requiring complete layout redesigns at each stage. Complexity is layered in over time, not presented all at once.

## **In-Depth Mechanic**

## Stages
* Wilderness
* Town
* Region
* Country
* Continent
* Planet
* Solar System
* Quadrant
* Galaxy
* Universe

## Stage Interaction & Progression Loop
* Implement stage-crossing upgrades or research (in a laboratory system) that:
  * Enhance lower-stage efficiency when higher stages are reached (e.g., town-level upgrades significantly boost wilderness resource yield).
  * Encourage revisiting earlier stages due to meaningful, noticeable progression leaps unlocked at higher stages.

## Resource Utilization & Relevance

* Introduce resource transformations: Early-stage resources (stones/wood) can convert or upgrade into advanced resources or equipment relevant in later stages (e.g., wood → charcoal → fuel cells).
* Stage-specific resources with universal currencies (coins, gems) that persist and remain valuable throughout all stages.

## Modes within a stage
### Territory View (Formerly Gathering Mode)

*   **Purpose:** Serve as the primary interactive hub for visualizing the game world, managing active resource gathering (stone, wood, food, etc.), assessing territory status, planning strategic actions, and initiating combat encounters.
*   **Interface:** A top-down 2D **PhaserJS scene** displaying the Home Base, player-controlled gatherer entities, spatial resource nodes, and a visual representation of controlled/adjacent territory (e.g., via a hex grid overlay). Includes overlaid UI elements for action buttons and status information.
*   **Mechanics:**
    *   **Spatial Nodes & Territory Representation:** Resource nodes (e.g., Stone Piles, Trees) exist at specific coordinates within hexes/zones on the map. Controlled territory is visually distinct (e.g., colored/lit hexes). Adjacent, uncontrolled hexes might be revealed with limited detail (Fog of War, scoutable?).
    *   **Active Visual Gathering:**
        *   Initiated via **global action buttons** (e.g., "Gather Stone", "Gather Wood") – *not* by clicking individual nodes.
        *   Clicking an action button commands an available gatherer entity to automatically pathfind to the **nearest available node** of the specified type within controlled territory (logic can be refined later via research - e.g., target highest yield, closest, specific hex).
        *   The entity **visually travels** to the node's location within its hex.
        *   A brief, time-based gathering animation occurs (duration based on stats).
        *   Entity collects resources (limited by carry capacity) and **visually returns** to Home Base for deposit.
        *   Upgrades (Workshop/Labs) enhance gatherer speed, capacity, gathering time, and unlock/manage multiple concurrent gatherers.
    *   **Node Depletion & Visual Feedback:** Nodes contain a finite amount of resources per cycle. They **visually change state** (e.g., shrink, disappear, turn grey/faded) when depleted and cannot be targeted for gathering until they replenish.
    *   **Node Replenishment:** Nodes replenish via:
        *   **Baseline Respawn:** A slow default timer (improvable via upgrades) for essential nodes, providing a safety net. Replenished nodes regain normal visual appearance.
        *   **Combat-Triggered Boosts:** Successful `Enhance Hex` combat runs may grant temporary yield/respawn speed boosts to nodes within that specific hex, or potentially even adjacent/nearby hexes (cross-hex synergy?). *(Specify which runs trigger boosts and where)*
    *   **Hex Interaction & Strategic Actions:**
        *   **Clicking a Hex:** Selects the hex and displays contextual information in a dedicated UI panel (e.g., side panel).
        *   **Info Panel (Controlled Hex):** Shows resources present, node status (ready/depleted/respawning), current **Depth Level / Max Wave Cleared**, current yield/respawn bonuses resulting from that depth, potential special features. Provides an **`Enhance Hex`** button.
        *   **Info Panel (Adjacent, Uncontrolled Hex):** Shows limited scouted info (if any), potential resource types (maybe?), estimated difficulty baseline. Provides buttons to initiate combat.
        *   **Combat Initiation:** Clicking `Expand Combat` or `Enhance Hex` triggers the transition to the `Combat Scene`, passing the context of the target hex and the action type. May include a brief "Prepare/Confirm" overlay showing current ammo inventory before starting.
    *   **Node Depletion & Replenishment:** Nodes visually deplete. Replenishment occurs via baseline timers (improvable), and potential temporary boosts triggered by successful `Enhance Hex` combat runs on *other* hexes (cross-hex synergy?). Unlocking *new* nodes happens primarily via `Expand Combat` into new hexes.
    *   **Offline Simulation:** Simulates gathering actions based on controlled hexes, node states, and gatherer stats.

*   **Conceptual UI Layout (Text Mockup - Territory View):**

    ```text
    +--------------------------------------------------------------------------+
    | [Top Bar - Persistent Resources & Goal Tracker?]                         |
    | [Stone Icon] 150 | [Wood Icon] 85 | [Coin Icon] 12 | Goal: 500 Coins    |
    +--------------------------------------------------------------------------+
    | [Main Area - PhaserJS Scene]                 | [Side Panel: Hex Info]    |
    |                                              |  Selected Hex: North-1    |
    |    [Hex Grid Overlay]                        |  Status: Controlled       |
    |    [Nodes within Hexes]                      |  Resources: Stone(Rich)   |
    |    [Player Entity Moving] --- Path ---> Node |  Depth Level: 120         |
    |    [Home Base Hex]                           |  Yield Bonus: +20%        |
    |                                              |  Respawn Bonus: -5s       |
    |                                              |  [Enhance Hex Button]     |
    |                                              |  (Or shows Expand button  |
    |                                              |   for adjacent hex)       |
    +----------------------------------------------+---------------------------+
    | [Bottom Bar - Gathering Action Buttons]                                  |
    |    [Gather Stone Button] [Gather Wood Button] [Manage Gatherers?]        |
    |    [Status: 1/2 Gatherers Busy]              [Go to Management View Btn] |
    +--------------------------------------------------------------------------+
    ```

### Management View

*   **Purpose:** Central hub for **permanent progression** and **resource transformation**. This is where players invest their accumulated persistent currencies (like Coins) and resources to enhance their core capabilities across all game modes (Gathering, Combat, Crafting efficiency, etc.) and to craft essential items. Defines player goals.

*   **Interface:** Primarily a React-based UI, accessed separately from the Territory View (likely via a main UI tab or button). Suited for menus, lists, tech trees, etc. separate from the real-time action in Phaser scenes.
*   **Core Systems:**
    *   **Workshop:** Instant, permanent upgrades via Coins/resources (Gatherer stats, base Combat stats, Crafting speed, "Clearing Speed" effectiveness, node respawn rates, etc.).
        *   **Upgrade Targets:** Examples include: starting combat stats (player/unit damage, health), Gatherer stats (movement speed, gather speed, carry capacity), Crafting speed/efficiency, Combat "Clearing Speed" effectiveness, base node respawn rates. Provides steady, incremental power gains.
    *   **Labs:** Time-and-resource-based research for major unlocks (new mechanics, higher tiers, advanced recipes, passive income, core game rule changes). Facilitates **long-term** progression through research projects that cost persistent currency (Coins), potentially rare resources, and take **real-time** to complete. Drives significant advancements and unlocks.
        *   **Unlock Targets:** New game mechanics (e.g., unlocking Combat initially?, additional gatherer units, automation features, new combat abilities/unit types), higher tiers for Workshop upgrades, advanced/complex crafting recipes, passive income streams (e.g., research "Coin Geology"), major efficiency breakthroughs (e.g., global gathering speed buffs, cross-stage bonuses).
        * **Universal vs. Stage-Specific Upgrades lab** upgrades that universally enhance resource gathering, combat efficacy, or reduce resource costs, with stage-specific modifiers that tune how impactful these universal bonuses are across stages.
        * **Cross-Stage Interconnectivity**: Players invest in research at higher stages (planet/solar/galaxy) that reduces the effectiveness penalty of previous stages, reinforcing earlier-stage replayability and exponential growth loops. 
    *   **Crafting:** Convert raw resources into usable items (ammo types, gear, components). Queue-based system. Recipe discovery via Labs/progression. Includes examples like Stone -> Pebbles, Slingshot.
        *   **Outputs:** Combat consumables (various ammo types), permanent equipment (like the Slingshot), intermediate components for more complex recipes, potentially temporary buff items or building materials (future).
        *   **Recipe Unlocks:** New recipes discovered through Lab research, found in the world (future?), or via progression milestones.
        * Examples
            * Stones are broken down into multiple projectiles (small rocks) that can be thrown by hand, extending resource longevity and utility.
            * Craft a slingshot
            * Break down rocks into smeller pebbels that can be used in a slingshot
            * Slingshot does more damg (faster projectile) while increasing quantity of projectiles which can be brought to battle
            * Bring 1 stone to throw once for 100 damage
            * Bring 10 rocks (from 1 stone) which can be thrown for 10 damage each (100 total dmg)
            * Bring 100 pebbles (from 10 rocks broken up) which cna be shot for 2 damage each (200 total dmg)
*   **Goal Setting:** Players identify desired upgrades or research here, creating the *demand* for specific resources or higher Coin income, thus driving strategic decisions made back in the Territory View. Includes potential for a **Goal Tracking** system where players can pin desired upgrades/research to keep requirements visible elsewhere (e.g., in the Territory View top bar).
*   **Conceptual UI Layout (Text Mockup - Example: Workshop Tab Active):**
    *(Mockup focuses only on Management systems, Map is omitted)*
    ```text
    +--------------------------------------------------------------------------+
    | [Gathering] [Management] [Combat]  (Tabs, Management Active)             |
    +--------------------------------------------------------------------------+
    | [Top Resource Bar - Persistent Resources]                                |
    | [Stone Icon] 150 | [Wood Icon] 85 | [Food Icon] 40 | [Coin Icon] 12     |
    +--------------------------------------------------------------------------+
    | [Sub-Tabs: [WORKSHOP] [Labs] [Crafting]] (Workshop Active)              |
    +--------------------------------------------------------------------------+
    | [Main Panel: Workshop Upgrades List]                                     |
    |                                                                          |
    |   **Gathering Upgrades**                                                 |
    |    - Gatherer Speed Lv. 3 -> 4 [Cost: 50 Coins] [Upgrade Button]         |
    |    - Carry Capacity Lv. 2 -> 3 [Cost: 40 Coins, 10 Wood] [Upgrade Button]|
    |                                                                          |
    |   **Combat Upgrades**                                                    |
    |    - Pebble Damage Lv. 5 -> 6 [Cost: 75 Coins] [Upgrade Button]          |
    |    - Clearing Speed Eff. Lv 1 -> 2 [Cost: 100 Coins] [Upgrade Button]    |
    |                                                                          |
    |   **Crafting Upgrades**                                                  |
    |    - Crafting Speed Lv. 1 -> 2 [Cost: 30 Coins] [Upgrade Button]         |
    |                                                                          |
    +--------------------------------------------------------------------------+
    ```

*   **Conceptual UI Layout (Text Mockup - Example: Labs Tab Active):**
    *(Similar structure to previous Management mockup, just showing a different tab)*
    ```text
    +--------------------------------------------------------------------------+
    | [Territory] [Management] [Combat (Disabled?)] (Tabs, Management Active)  |
    +--------------------------------------------------------------------------+
    | [Top Resource Bar - Persistent Resources]                                |
    | [Stone Icon] 150 | [Wood Icon] 85 | [Food Icon] 40 | [Coin Icon] 12     |
    +--------------------------------------------------------------------------+
    | [Sub-Tabs: [Workshop] [LABS] [Crafting]] (Labs Active)                   |
    +--------------------------------------------------------------------------+
    | [Main Panel: Research Tree / Available Research]                         |
    |                                                                          |
    |   **Available Research**                                                 |
    |    - Advanced Mining Tech [Cost: 500 Coins, 50 Crystals] [Time: 4h] [Pin Goal] [Start Research] |
    |    - Automated Gathering [Cost: 1000 Coins] [Time: 8h] [Requires: Adv. Mining] [Pin Goal] [Start Research] |
    |                                                                          |
    |   **Currently Researching**                                              |
    |    - Pebble Efficiency Lv. 4 [Time Left: 1h 15m] [Speed Up?]             |
    |                                                                          |
    +--------------------------------------------------------------------------+
    ```

### Combat Scene

*   **Purpose:** The dedicated active gameplay phase for resolving `Expand Combat` or `Enhance Hex` actions initiated from the Territory View. Focus is on pushing combat **depth** to achieve objectives (conquer territory or improve hex yield/bonuses).
*   **Interface:** A top-down or side-view **PhaserJS scene**, distinct from the Territory View map. Displays player entity(ies), incoming enemies, projectiles, real-time combat stats.
*   **Gameplay Style & Progression:**
    *   **Contextual Combat:** The baseline difficulty, enemy types, scaling rate, and potential rewards are determined by the **target hex** and whether the action is `Expand` (conquering, likely lower initial difficulty but aims for a completion state) or `Enhance` (pushing depth on a controlled hex, potentially starting harder but scaling indefinitely).
    *   **Depth Metric:** Progress is measured by **depth achieved** (can be represented as distance cleared, waves survived, or a similar scaling metric). Pushing deeper in `Enhance` runs increases the target hex's Depth Level, directly boosting its yield/respawn bonuses shown in the Territory View.
    *   **Core Combat:** Inspired by tower defense/shooter hybrids. Player entity (and later, allied units) automatically targets/attacks incoming geometric enemies. May include player-activated special abilities or tactical positioning elements in later stages. Player entity attacks enemies. Uses finite crafted ammo. In-run upgrades ($) provide temporary power boosts. Clearing Speed mechanic applies when re-entering `Enhance` runs for a hex you've previously pushed deep in.
*   **Mechanics:**
    *   **Resource Consumption (Ammo):** Directly uses items crafted in Management Mode (e.g., Pebbles, specialized ammo) as finite ammunition. Running out of ammo significantly hinders progress but might not completely stop the player (e.g., revert to a very weak base attack or rely on allied units). Strategic ammo conservation could be important.
    *   **"Clearing Speed":** Applies primarily to `Enhance Hex` runs, rapidly skipping early, already-mastered depths. This phase might feature significantly reduced enemy presence or offer bonus starting Cash ($). The effectiveness (speed/percentage) of Clearing Speed is improvable via Workshop upgrades.
    *   **Dual Currency Rewards:**
        *   `Cash ($)`: Earned from defeating standard enemies during the run. Spent *only* within the current run via an accessible **in-run upgrade panel** for temporary boosts (e.g., +Damage, +Attack Speed, temporary health regen). This currency is lost when the run ends.
        *   `Coins`: The primary persistent currency. Earned from reaching significant new distance milestones, defeating bosses or special high-value enemies, and possibly completing specific run objectives. Used back in Management Mode (Workshop/Labs). Earning is skewed towards pushing *further* than before.
    *   **Hex Improvement (`Enhance`):** Reaching higher depths permanently increases the target hex's yield multiplier, reduces respawn timers, or grants other bonuses visible in the Territory View info panel.
    *   **Territory Conquest (`Expand`):** Successfully completing an `Expand` run (e.g., reaching a target distance/defeating a specific boss) changes the target hex's status to "Controlled" on the Territory map, revealing its nodes and allowing future `Enhance` runs.
    *   **Other (Potential) Rewards:**
        *   **Territory Conquest:** Reaching specific distance thresholds conquers the corresponding zone/hex on the Strategic Map, making it available for Gathering.
        *   **Special Resources:** Rare crafting materials (e.g., Leather, Crystals) might drop from specific enemy types or bosses.
        *   **(Potential):** Triggering temporary Gathering boosts in conquered zones upon successful completion.
*   **(Pre-Combat Overlay):** A potential brief overlay screen before the Combat Scene fully loads could confirm the action (`Expand`/`Enhance`), target hex, show current ammo counts, and allow final confirmation or backing out.

*   **Conceptual UI Layout (Text Mockup - During Combat):**
    ```text
    +--------------------------------------------------------------------------+
    | [Status Bar: Combat Context & Run Stats]                                 |
    | Action: Enhance Hex (North-1) | Depth: 125 | Max Depth: 180             |
    | [$ Icon]: 250 | [Coin Icon] This Run: +5                                  |
    +--------------------------------------------------------------------------+
    | [Main Gameplay View - Phaser Scene]                                      |
    |   (Enemies approaching from top/ahead)                                   |
    |   (Player entity at bottom/center firing upwards/forwards)               |
    |   (Parallax background suggesting forward motion)                        |
    +--------------------------------------------------------------------------+
    | [Bottom Bar: Player & Controls]                                          |
    | HP: [||||||||--] 80/100  | Ammo: [Pebble Icon] 1490/1500 [Toggle Use?]  |
    | Dmg: 12 | Spd: 1.2/s     | [Upgrades ($) Button] [Abilities?] [Pause]   |
    +--------------------------------------------------------------------------+
    ```
---


## Misc

* **Guild and Multiplayer Mechanics:**
  * Joint efforts for territory conquest, special events, and resource collection.  
  * Enhanced cooperative gameplay through incremental guild research.  

* **Economics and Trading:**
  * Optional trading system among players or guilds, leveraging resource rarity and strategy.

### **Initial Technical Approach**

*   **Tech Stack:**
    *   React/Next.js for UI (primarily `Management View`, potentially UI overlays).
    *   WebGL via PhaserJs for interactive gameplay visuals (`Territory View` map/gathering, `Combat Scene`).
*   **Initial Focus (MVP - Refined):**
    1.  **`Territory View` Basics (PhaserJS):** Scene with Home Base, one gatherer entity, one resource type (Stone nodes) spatially placed (maybe on simple grid/hex overlay). Implement visual movement: entity travels to node, gathers (timer), returns. Basic resource inventory tracking. Implement "Gather Stone" button triggering nearest node logic.
    2.  **Basic Hex Interaction (Territory View):** Allow clicking on the Home Base hex and one adjacent hex. Display a simple info panel for the selected hex. Add `Expand Combat` button for the adjacent hex.
    3.  **Basic `Combat Scene` (PhaserJS):** Triggered by `Expand Combat`. Simple scene with player entity firing basic projectiles (consuming Stone/Pebbles). Spawn 1-2 types of basic enemies from top. Implement a basic **Depth/Distance** counter. Run ends on player defeat.
    4.  **Core Loop Link:** Successfully completing (`Expand`) the Combat run (reaching any minimal distance) changes the target hex status to "Controlled" in the Territory View and reveals its Stone node(s).
    5.  **Basic `Management View` (React):** Minimal view with Workshop tab. Implement Coin currency (awarded simply for completing a combat run). Allow purchasing one basic Workshop upgrade (e.g., +Pebble Damage) using Coins.
    6.  **Basic Crafting (Management View):** Implement simple Stone -> Pebbles crafting recipe. Update Territory/Combat to use Pebbles as primary ammo if available.