# Story: Foundation: Node Depletion & Respawn

Implement basic node lifecycle: The initial Stone node depletes visually/functionally after being gathered. It should respawn its resources after a cooldown period (e.g., 10-30 seconds).

## Acceptance Criteria

*   Gathering Stone reduces node amount.
*   A depleted node cannot be gathered from.
*   Node visually indicates depletion.
*   Node resources reappear after the timer.
*   `Gather Stone` button might disable if no available node exists.