import { useResourceNodeStore } from "./ResourceNode.store";
import {
  eventBus,
  NodeCapacityDecrementedPayload,
} from "../shared/events/eventBus";

export class RespawnService {
  private activeTimers = new Map<string, NodeJS.Timeout>();
  private capacityDecrementHandler =
    this.handleNodeCapacityDecremented.bind(this);

  constructor() {
    eventBus.on("NODE_CAPACITY_DECREMENTED", this.capacityDecrementHandler);
  }

  private handleNodeCapacityDecremented(
    payload: NodeCapacityDecrementedPayload,
  ): void {
    const { nodeId } = payload;
    const nodeState = useResourceNodeStore.getState().getNodeState(nodeId);

    if (!nodeState) {
      console.warn(
        `RespawnService: Received capacity decrement event for unknown node ID: ${nodeId}`,
      );
      return;
    }

    if (
      nodeState.mechanics.capacity.current < nodeState.mechanics.capacity.max &&
      !nodeState.mechanics.respawn.isRespawning
    ) {
      useResourceNodeStore.getState().startRespawn(nodeId);

      const updatedNodeState = useResourceNodeStore
        .getState()
        .getNodeState(nodeId);

      if (
        updatedNodeState?.mechanics.respawn.isRespawning &&
        updatedNodeState.mechanics.respawn.respawnEndTime
      ) {
        this.scheduleRespawnCompletion(
          nodeId,
          updatedNodeState.mechanics.respawn.respawnEndTime,
        );
      } else {
        console.warn(
          `RespawnService: Node ${nodeId} did not enter respawning state or has no respawnEndTime after startRespawn call.`,
        );
      }
    }
  }

  private scheduleRespawnCompletion(
    nodeId: string,
    respawnEndTime: number,
  ): void {
    // Clear existing timer for this node if it exists (e.g., if triggered rapidly)
    if (this.activeTimers.has(nodeId)) {
      clearTimeout(this.activeTimers.get(nodeId));
      this.activeTimers.delete(nodeId);
    }

    const delay = respawnEndTime - Date.now();

    if (delay > 0) {
      const timerId = setTimeout(() => {
        useResourceNodeStore.getState().finishRespawn(nodeId);
        this.activeTimers.delete(nodeId); // Remove timer after execution
      }, delay);
      this.activeTimers.set(nodeId, timerId);
    } else {
      // If respawnEndTime is somehow in the past, finish immediately
      console.warn(
        `RespawnService: Respawn end time for node ${nodeId} is in the past. Finishing immediately.`,
      );
      useResourceNodeStore.getState().finishRespawn(nodeId);
      // Ensure timer is removed if it existed
      if (this.activeTimers.has(nodeId)) {
        this.activeTimers.delete(nodeId);
      }
    }
  }

  public destroy(): void {
    // Clear all active timeouts
    this.activeTimers.forEach((timerId) => {
      clearTimeout(timerId);
    });
    this.activeTimers.clear();

    // Unsubscribe from the event bus
    eventBus.off("NODE_CAPACITY_DECREMENTED", this.capacityDecrementHandler);
  }
}
