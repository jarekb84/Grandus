# Story: Combat: Introduce Persistent Currency (Coins)

Modify the Combat Scene to award a small amount of persistent `Coins` (separate from temporary `$`) upon defeating the *first* enemy wave (or even just the first enemy) in an `Expand Combat` attempt.

## Acceptance Criteria

*   Killing the first wave/enemy in an `Expand Combat` run adds 1 Coin to a persistent inventory (visible somewhere, maybe top bar eventually).
*   This happens even if the player dies shortly after.
*   `$`/Cash can remain for now but is still unused.