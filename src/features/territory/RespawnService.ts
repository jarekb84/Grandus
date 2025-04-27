import { useResourceNodeStore } from "./ResourceNode.store";

export class RespawnService {
  private activeTimers = new Map<string, NodeJS.Timeout>();
  private unsubscribe: (() => void) | null = null;
  private previousStates = new Map(useResourceNodeStore.getState().nodeStates);

  constructor() {
    this.subscribeToStore();
  }

  private subscribeToStore(): void {
    this.unsubscribe = useResourceNodeStore.subscribe(
      (newState) => {
        const currentStates = newState.nodeStates;

        currentStates.forEach((nodeState, nodeId) => {
          const previousState = this.previousStates.get(nodeId);

          // Check if respawn just started or end time changed
          if (
            nodeState.isRespawning &&
            nodeState.respawnEndTime !== null &&
            (!previousState ||
              !previousState.isRespawning ||
              previousState.respawnEndTime !== nodeState.respawnEndTime)
          ) {
            // Clear existing timer for this node if it exists
            if (this.activeTimers.has(nodeId)) {
              clearTimeout(this.activeTimers.get(nodeId));
              this.activeTimers.delete(nodeId);
            }

            const delay = nodeState.respawnEndTime - Date.now();

            if (delay > 0) {
              const timerId = setTimeout(() => {
                useResourceNodeStore.getState().finishRespawn(nodeId);
                this.activeTimers.delete(nodeId); // Remove timer after execution
              }, delay);
              this.activeTimers.set(nodeId, timerId);
            } else {
              // If respawnEndTime is in the past, finish immediately
              useResourceNodeStore.getState().finishRespawn(nodeId);
            }
          }
          // Check if respawn just finished or was cancelled externally
          else if (
            !nodeState.isRespawning &&
            previousState?.isRespawning &&
            this.activeTimers.has(nodeId)
          ) {
            clearTimeout(this.activeTimers.get(nodeId));
            this.activeTimers.delete(nodeId);
          }
        });

        // Clean up timers for nodes that might have been removed from the store
        this.activeTimers.forEach((_timer, nodeId) => {
          if (!currentStates.has(nodeId)) {
            clearTimeout(this.activeTimers.get(nodeId));
            this.activeTimers.delete(nodeId);
          }
        });


        // Update previousStates for the next comparison
        this.previousStates = new Map(currentStates);
      },
    );
  }

  public destroy(): void {
    // Clear all active timeouts
    this.activeTimers.forEach((timerId) => {
      clearTimeout(timerId);
    });
    this.activeTimers.clear();

    // Unsubscribe from the store
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}