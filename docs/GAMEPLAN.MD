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

The core loop cycles through Gathering -> Management -> Combat/Expansion:
1.  **Gather** resources needed for crafting and initiating combat.
2.  **Manage** resources via Crafting (ammo/gear), Workshop/Labs (permanent upgrades), and plan the next move on the Strategic Map.
3.  **Expand** via Combat runs, consuming resources to push distance, defeat enemies, earn rewards, and unlock new territory/gathering potential on the Strategic Map.

### **Core Gameplay Loop (Prototype)**
1.  **Resource Gathering Mode:** Players visually command entities in a 2D scene (PhaserJS) to gather resources (Stone, Wood, etc.) from spatial nodes. Gathering takes time and resources are carried back; this mode fuels Crafting/Expansion and improves with upgrades.
    *   **Visual & Spatial:** Entities physically travel between Home Base and nodes on the map.
    *   **Direct Action:** Simple commands initiate gathering from targeted or nearest available nodes.
    *   **Node Lifecycle:** Nodes deplete visually and replenish over time or via game events.
    *   **Offline Simulation:** Progress continues passively based on active gathering efficiency.    

2.  **Management Mode:** Players utilize this central hub (primarily React UI) for permanent progression by spending resources in systems like the Workshop (instant upgrades), Labs (timed research), and Crafting (item creation).
    *   **Permanent Upgrades:** Spend persistent currency (Coins) etc. for lasting improvements to Gathering, Combat, and other systems.
    *   **Resource Conversion:** Craft gathered resources into essential combat items (ammo, gear), intermediate goods, or other useful equipment.
    *   **Progression Hub:** Serves as the primary interface for long-term character/capability development outside of active Gathering/Combat loops.    

3.  **Combat/Expansion Mode:** Players engage in active combat within a 2D scene (PhaserJS) to push deeper into territory, measured by distance, using crafted ammo and earning rewards.
    *   **Active Engagement:** Real-time gameplay inspired by tower defense/shooter, requiring resource management (ammo).
    *   **Distance Progression:** Success is measured by how far (distance) the player pushes, not fixed waves, unlocking map territory.
    *   **Resource Consumption:** Directly uses finite ammo crafted from gathered resources.
    *   **Dual Rewards:** Earn temporary currency ($) for in-run upgrades and persistent currency (Coins) for permanent progression (idle/incremental hybrids like "The Tower").

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
### Resource Gathering Mode

*   **Purpose:** Accumulate raw resources (stone, wood, food, etc.) through direct, visually represented actions within a spatial game environment, providing the fuel for crafting and expansion.
*   **Mechanics:**
    *   **Primary Interface:** A top-down 2D **PhaserJS scene** serves as the main interaction space. It displays a central **Home Base**, the player's controllable entity(ies), and resource nodes positioned spatially on the map.
    *   **Spatial Nodes & Territory Representation:** Resource nodes (e.g., Stone Piles, Trees) exist at specific coordinates on the map. The map area might feature a subtle visual overlay (e.g., a **hex grid**) where grid cells correspond to conquered territory zones. New resource nodes appear within newly revealed/conquered hex grid cells following successful Combat/Expansion runs, visually representing the expanding access to resources.
    *   **Active Visual Gathering:**
        *   Interaction occurs via simple **action buttons** (e.g., "Gather Stone").
        *   Clicking an action button commands the primary player entity (or an available automated gatherer entity later) to automatically pathfind to the **nearest available node** of the specified type within the accessible/conquered territory.
        *   The entity **visually travels** across the scene to the node location.
        *   Upon reaching the node, a brief, time-based gathering animation plays (duration influenced by gather speed stats).
        *   The entity collects resources (amount limited by carry capacity stats) and then **visually travels back** to the Home Base to deposit the resources into the main inventory.
        *   Upgrades (via Workshop/Labs) directly enhance this visual loop: increasing movement speed, gathering speed, carry capacity, and eventually unlocking/managing multiple concurrent gathering entities.
    *   **Node Depletion & Visual Feedback:** Nodes contain a finite amount of resources per cycle. They **visually change state** (e.g., shrink, disappear, turn grey/faded) when depleted and cannot be targeted for gathering until they replenish.
    *   **Node Replenishment:** (The underlying mechanics remain, but presentation is spatial)
        *   **Combat-Triggered Boost:** Successful Expansion runs can grant temporary boosts (e.g., faster respawn, increased yield) to existing, non-depleted nodes within the **visible, conquered hexes/area**.
        *   **Unlocking New Potential:** Reaching new distance milestones in Expansion reveals/unlocks **new hexes/areas** on the map, causing new instances of resource nodes to appear within them. This is the primary method for long-term resource growth.
        *   **Baseline Respawn:** Essential resource nodes (especially those accessible early near the Home Base) have a slow default respawn timer (improvable via upgrades) providing a safety net against deadlocks. Replenished nodes regain their normal visual appearance.
    *   **Offline Simulation:** Calculates resources gathered while offline by simulating the actions of available gatherers targeting available/respawned nodes within the player's conquered territory (visible hexes/map area), considering their stats (speed, capacity). Presents a summary of offline gains upon the player's return.

*   **Conceptual UI Layout (Text Mockup - Focusing on Screen Elements):**
    *(This describes elements visible within/overlaying the main Phaser scene)*

    ```text
    +--------------------------------------------------------------------------+
    | [Top Bar - Persistent Resources Overlay]                                 |
    | [Stone Icon] 150 | [Wood Icon] 85 | [Food Icon] 40 | [Coin Icon] 12     |
    +--------------------------------------------------------------------------+
    |                                                                          |
    | [Main Area - PhaserJS Scene]                                             |
    |                                                                          |
    |    [Grey Square Node - Stone Pile]   [Faded Grey Square - Depleted Stone]|
    |                                                                          |
    |              [Path Line?] ---> [Green Square - Player Entity]            |
    |                                ^                                         |
    |                                |                                         |
    |                         [Blue Circle - Home Base]                        |
    |                                                                          |
    |   [Subtle Hex Grid Lines Overlaying the Scene?]                          |
    |                                                                          |
    |    [Orange Circle Node - Wood]      [Another Grey Square - Stone Pile]   |
    |                                                                          |
    +--------------------------------------------------------------------------+
    | [Bottom/Side Bar - Action Buttons Overlay]                               |
    |    [Gather Stone Button]                                                 |
    |    [Gather Wood Button (Greyed Out?)]                                    |
    |    [Gather Food Button (Greyed Out?)]                                    |
    |    [Maybe minimal Gatherer Status: Idle / Gathering Stone / Returning]   |
    +--------------------------------------------------------------------------+
    ```
---
### Management Mode

*   **Purpose:** Central hub for **permanent progression** and **resource transformation**. This is where players invest their accumulated persistent currencies (like Coins) and resources to enhance their core capabilities across all game modes (Gathering, Combat, Crafting efficiency, etc.) and to craft essential items.
*   **Interface:** Primarily a React-based UI, suited for managing lists, tech trees, upgrade buttons, and crafting queues, separate from the real-time action in Phaser scenes.
*   **Core Systems:**
    *   **Workshop:**
        *   **Function:** Spend persistent currency (Coins) and possibly other resources for **instant**, permanent upgrades to baseline stats and efficiencies.
        *   **Upgrade Targets:** Examples include: starting combat stats (player/unit damage, health), Gatherer stats (movement speed, gather speed, carry capacity), Crafting speed/efficiency, Combat "Clearing Speed" effectiveness, base node respawn rates. Provides steady, incremental power gains.
    *   **Labs:**
        *   **Function:** Facilitates **long-term** progression through research projects that cost persistent currency (Coins), potentially rare resources, and take **real-time** to complete. Drives significant advancements and unlocks.
        *   **Unlock Targets:** New game mechanics (e.g., unlocking Combat initially?, additional gatherer units, automation features, new combat abilities/unit types), higher tiers for Workshop upgrades, advanced/complex crafting recipes, passive income streams (e.g., research "Coin Geology"), major efficiency breakthroughs (e.g., global gathering speed buffs, cross-stage bonuses).
        * **Universal vs. Stage-Specific Upgrades lab** upgrades that universally enhance resource gathering, combat efficacy, or reduce resource costs, with stage-specific modifiers that tune how impactful these universal bonuses are across stages.
        * **Cross-Stage Interconnectivity**: Players invest in research at higher stages (planet/solar/galaxy) that reduces the effectiveness penalty of previous stages, reinforcing earlier-stage replayability and exponential growth loops. 
    *   **Crafting:**
        *   **Function:** Interface for transforming raw gathered resources into more useful items. Displays available recipes, required ingredients, and allows players to queue production.
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

*   **(Strategic Map Removed):** *Note: The Strategic Map for visualizing territory and choosing expansion targets is a crucial element but its optimal UI placement (pre-Combat, integrated Gathering view, dedicated screen) is TBD and handled separately from the core Management systems.*

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

### Combat/Expansion Mode

*   **Purpose:** The primary active gameplay phase where players expend gathered/crafted resources (ammo) to **push into new territory**, defeat enemies, earn currencies, and achieve **distance milestones**. Success in this mode directly enables further Gathering by unlocking new areas on the (separate) Strategic Map.
*   **Interface:** A top-down or side-view **PhaserJS scene** displaying the player entity(ies), incoming enemies, projectiles, and relevant real-time stats.
*   **Gameplay Style & Progression:**
    *   **Proactive Expansion Focus:** Framed as pushing *forward* into territory, not just defending a fixed point. Visual cues like background parallax scrolling reinforce this.
    *   **Distance Metric:** Progress is tracked continuously via a **distance** counter (meters -> km -> AU etc.). Enemy difficulty, density, and types scale dynamically based on the distance achieved within the run. Replaces discrete wave counts.
    *   **Core Combat:** Inspired by tower defense/shooter hybrids. Player entity (and later, allied units) automatically targets/attacks incoming geometric enemies. May include player-activated special abilities or tactical positioning elements in later stages.
*   **Mechanics:**
    *   **Resource Consumption (Ammo):** Directly uses items crafted in Management Mode (e.g., Pebbles, specialized ammo) as finite ammunition. Running out of ammo significantly hinders progress but might not completely stop the player (e.g., revert to a very weak base attack or rely on allied units). Strategic ammo conservation could be important.
    *   **"Clearing Speed" Mechanic:** To mitigate the grind of replaying early sections, when initiating a run into previously explored territory, the game rapidly advances the distance counter (e.g., to 80-90% of the previous max distance). This "fast travel" phase might feature significantly reduced enemy presence or offer bonus starting Cash ($). The effectiveness (speed/percentage) of Clearing Speed is improvable via Workshop upgrades.
    *   **Dual Currency Rewards:**
        *   `Cash ($)`: Earned from defeating standard enemies during the run. Spent *only* within the current run via an accessible **in-run upgrade panel** for temporary boosts (e.g., +Damage, +Attack Speed, temporary health regen). This currency is lost when the run ends.
        *   `Coins`: The primary persistent currency. Earned from reaching significant new distance milestones, defeating bosses or special high-value enemies, and possibly completing specific run objectives. Used back in Management Mode (Workshop/Labs). Earning is skewed towards pushing *further* than before.
    *   **Other Rewards:**
        *   **Territory Conquest:** Reaching specific distance thresholds conquers the corresponding zone/hex on the Strategic Map, making it available for Gathering.
        *   **Special Resources:** Rare crafting materials (e.g., Leather, Crystals) might drop from specific enemy types or bosses.
        *   **(Potential):** Triggering temporary Gathering boosts in conquered zones upon successful completion.
*   **(Strategic Map Interaction):** *Note: While Combat/Expansion runs are initiated based on selections potentially made viewing the Strategic Map, the map itself is not typically displayed during the active combat phase. The link is sequential: Plan/Select Target (potentially via Map) -> Enter Combat Mode -> Achieve Distance -> Conquered Territory updates on Map.*

*   **Conceptual UI Layout (Text Mockup - During Combat):**

    ```text
    +--------------------------------------------------------------------------+
    | [Gathering] [Management] [Combat]  (Tabs, Combat Active - or Mode Name)  |
    +--------------------------------------------------------------------------+
    | [Top Bar: Combat Run Stats]                                              |
    | Distance: 175m | Max: 210m | [$ Icon]: 250 | [Coin Icon] This Run: +3    |
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

* **Laboratory and Workshop Systems:**
  * Laboratory offers passive, long-term incremental improvements.  
  * Workshop provides immediate upgrade benefits upon resource investment.  

* **Resource and Territory Management:**
  * Territory management following successful combat phases, unlocking strategic resources.  
  * Incremental complexity in resource types, rarity, and management.  

* **Guild and Multiplayer Mechanics:**
  * Joint efforts for territory conquest, special events, and resource collection.  
  * Enhanced cooperative gameplay through incremental guild research.  

* **Economics and Trading:**
  * Optional trading system among players or guilds, leveraging resource rarity and strategy.

### **Initial Technical Approach**

* **Tech Stack:** React/Next.js for rapid UI iteration.  
* **Graphics:** WebGL via PhaserJs for interactive gameplay visuals.  
* **Initial Focus:**  
  * Core MVP: basic resource collection, initial combat mechanics, and essential upgrades managed via React.
