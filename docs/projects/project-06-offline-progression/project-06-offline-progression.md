# Project: Offline Progression

## Overall Goal / Objective

Implement the offline progression system to provide meaningful progress while the player is away. Primarily focus on simulating the resource gathering process based on the player's controlled territory, available nodes, and gatherer stats (speed, capacity, number of gatherers). Potentially include passive Coin generation if unlocked via specific Lab research or special hex bonuses.

## Key Systems/Features Involved (High-Level)

*   **Offline Simulation Logic:** Develop the core logic to calculate resources gathered over a period of inactivity. This needs to consider:
    *   Number and stats of available gatherers.
    *   Number, type, and yield/respawn rate of resource nodes in controlled hexes.
    *   Potentially gatherer carry capacity and travel time estimations.
    *   Maximum offline time cap (e.g., 8 hours, 24 hours).
*   **Game State Loading:** Upon game load, check the time elapsed since the last session. If significant time has passed, run the offline simulation logic and update the player's resource inventory accordingly.
*   **User Interface:** Display a summary of offline gains upon login (e.g., "Welcome back! While you were away, you gathered: 1500 Stone, 800 Wood...").
*   **(Optional) Passive Coin Generation:** If implemented via Labs/Hexes in previous projects, include this calculation in the offline simulation.
*   **Management View (React):** Potentially add Lab research or Workshop upgrades that improve offline gathering efficiency or increase the maximum offline time.

## Source Context from Vision Document

> **Incremental Progression (Active & Passive Balance):**
> *   Meaningful offline progression (Gathering simulation, potential passive Coin income) complements focused active gameplay sessions... encouraging regular player engagement without mandating excessive active playtime.

> **Offline Simulation:** Primarily simulates the **Gathering** aspect based on conquered territory, available nodes, and gatherer stats. May also include passive Coin generation if unlocked via Labs/special hexes. Ensures meaningful progress while away.

> **Territory View (PhaserJS Scene):** ...
> *   **Offline Simulation:** Simulates gathering actions based on controlled hexes, node states, and gatherer stats.

> **Labs:** Time-and-resource-based research for major unlocks (... passive income...). *(Implies offline Coin generation might be unlocked here)*

## Notes

*   This project adds a significant quality-of-life feature, making the game less demanding of constant active play.
*   The simulation logic needs to be reasonably accurate but doesn't need to be a perfect real-time replication. Focus on believable gains based on player progress.
*   Clear communication of offline gains to the player upon return is important.
*   Balancing offline gains against active play rewards is crucial to ensure both feel valuable.