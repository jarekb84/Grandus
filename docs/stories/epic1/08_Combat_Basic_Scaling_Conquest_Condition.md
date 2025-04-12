# Story: Combat: Basic Scaling & Conquest Condition

Define the `Expand Combat` parameters for the *first* adjacent hex: Enemies have 1 HP. Wave 1 has 1 enemy. Waves increase in enemy count (e.g., 1, 3, 5, 7...). Define a "Conquest" condition as clearing Wave 10. Player starts with base stats (e.g., 100 HP, 1 pebble = 1 damage).

## Acceptance Criteria

*   Combat initiated for the first hex follows this wave structure.
*   Reaching the start of Wave 11 triggers a "Victory/Conquered" state for the run.
*   Pebbles are consumed as ammo.