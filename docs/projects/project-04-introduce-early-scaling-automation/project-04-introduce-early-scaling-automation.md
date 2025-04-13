# Project: Introduce Early Scaling & Automation

## Overall Goal / Objective

Introduce initial elements related to the core themes of visual scale and automation. Implement the "Clearing Speed" mechanic to streamline repetitive `Enhance Hex` runs. Add basic visual cues for scale progression (e.g., distance units changing in combat). Potentially allow unlocking and managing multiple gatherer entities via Labs/Workshop.

## Key Systems/Features Involved (High-Level)

*   **Combat Scene (PhaserJS):** Implement the "Clearing Speed" mechanic for `Enhance Hex` runs, allowing players to rapidly skip previously cleared depths. Add simple visual indicators of scale (e.g., text showing distance units changing like meters -> km).
*   **Territory View (PhaserJS):** If multiple gatherers are implemented, update the view to visually represent and manage them (e.g., status indicators, potentially basic assignment logic).
*   **Management View (React):** Add Workshop upgrades specifically for improving "Clearing Speed" effectiveness. Potentially add Lab research or Workshop upgrades to unlock additional gatherer units. Update UI to reflect multiple gatherer management if applicable.
*   **Core Game State:** Track the maximum depth cleared per hex (for Clearing Speed calculation), number of owned gatherers, Clearing Speed effectiveness level.

## Source Context from Vision Document

> **Visual Scale and Automation:**
> *   Visually experience scale and growth... Expansion and territory status represented on an interactive **Territory View**.
> *   Begin with **active visual gathering**... evolving gradually into more automated systems...
> *   Scale visually represented through clear incremental tiers (distance units changing during combat: meters -> km -> AU)...

> **Automation gradually reduces *manual clicks* for gathering initiation but retains visual activity (e.g., seeing multiple gatherers work on the Territory map)...**

> **Workshop:** Instant, permanent upgrades via Coins/resources (... "Clearing Speed" effectiveness...).
> **Labs:** Time-and-resource-based research for major unlocks (... additional gatherer units, automation features...).

> **Combat Scene (PhaserJS Scene):** ... Clearing Speed mechanic applies when re-entering `Enhance` runs for a hex you've previously pushed deep in.
> *   **"Clearing Speed":** Applies primarily to `Enhance Hex` runs, rapidly skipping early, already-mastered depths... The effectiveness (speed/percentage) of Clearing Speed is improvable via Workshop upgrades.

> **Sense of Motion (Combat):** Combat view incorporates visual cues suggesting forward motion (e.g., background parallax) to reinforce the feeling of expansion. *(Related to visual scale)*

## Notes

*   This project introduces quality-of-life improvements (Clearing Speed) and starts delivering on the core visual scale/automation themes.
*   The implementation of multiple gatherers adds complexity to the Territory View and resource management logic. Decide if this fits within the scope or should be deferred/split.
*   Visual scale cues should be simple at this stage, laying groundwork for more elaborate representations later.