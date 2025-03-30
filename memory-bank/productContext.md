# Product Context: Grandus Game

## Purpose
Grandus is designed to provide a visually engaging and progressively complex gameplay experience, where players witness their actions evolve from manual tasks to managing vast automated systems. The game aims to capture the satisfaction of scale and incremental growth, inspired by games like Dyson Sphere Program and Factorio, but with a unique blend of progression mechanics and cooperative potential.

## Problems it Solves
- **Engagement through Progression:** Addresses the need for games that offer a clear sense of progression and scale, moving beyond simple numeric increases to visually impactful growth.
- **Gradual Complexity Introduction:** Solves the problem of player overwhelm by introducing new mechanics and UI elements incrementally, ensuring a smooth learning curve and sustained engagement.
- **Meaningful Offline and Cooperative Play:** Provides satisfying offline progression and lays the foundation for future cooperative gameplay, enhancing long-term player investment and community building.

## How it Should Work
- **Core Loop (Territory/Management/Combat):** Players engage in a cycle:
    - **Territory View (PhaserJS):** Plan strategy, manage visual resource gathering from nodes on a hex-based map, initiate combat (`Expand`/`Enhance Hex`).
    - **Management View (React):** Prepare for future actions by spending persistent currency (Coins) on permanent upgrades (Workshop/Labs) and crafting essential items (ammo).
    - **Combat Scene (PhaserJS):** Execute combat actions triggered from Territory View, pushing depth to conquer hexes or enhance their yields, earning temporary ($) and persistent (Coins) currency.
- **Visual Scale & Automation:** Start with manual visual gathering (entities moving on map), evolving towards managing automated systems and visually expanding territory.
- **Progressive Complexity:** Introduce mechanics incrementally: unlock Management/Combat views, reveal more hexes/nodes, introduce Workshop/Labs, deeper crafting, advanced combat mechanics.
- **Incremental & Offline Progression:** Balance active gameplay in Territory/Combat views with meaningful offline simulation (primarily Gathering based on controlled territory/nodes).
- **Cooperative Gameplay (Future):** Guild mechanics for resource sharing, cooperative research, and mutual progression.

## User Experience Goals
- **Visually Rewarding Progression:** Players should see their territory expand on the map, watch gatherers work, and witness the increasing scale of their operations and combat encounters.
- **Satisfying Automation & Management:** The transition from active gathering to managing systems and making strategic choices in the Territory and Management views should feel empowering.
- **Engaging Complexity Curve:** Introduce new views, mechanics (hex interaction, crafting, Workshop/Labs), and UI elements gradually to maintain engagement without overwhelm.
- **Meaningful Choices:** Decisions made in the Territory View (which hex to target), Management View (which upgrades/crafts to prioritize), and Combat Scene (ammo usage) should directly impact progression and efficiency.
- **Clear Feedback Loop:** The cycle of gathering resources, upgrading/crafting, and using those improvements in combat to gain more territory/resources should be clear and rewarding.
- **Community and Cooperation (Future):** Foster collaboration through guild mechanics and shared goals.
