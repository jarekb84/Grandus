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
    const initialNodeState = useResourceNodeStore
      .getState()
      .getNodeState(nodeId);

    if (!initialNodeState) {
      console.warn(
        `RespawnService: Received capacity decrement event for unknown node ID: ${nodeId}`,
      );
      return;
    }

    const { capacity, respawn } = initialNodeState.mechanics;

    if (capacity.current < capacity.max && !respawn.isRespawning) {
      useResourceNodeStore.getState().initiateRespawnCycle(nodeId);

      const updatedNodeState = useResourceNodeStore
        .getState()
        .getNodeState(nodeId);

      if (
        updatedNodeState?.mechanics.respawn.isRespawning &&
        updatedNodeState.mechanics.respawn.respawnEndTime
      ) {
        this.scheduleNextRespawnIncrement(
          nodeId,
          updatedNodeState.mechanics.respawn.respawnEndTime,
        );
      } else {
        console.warn(
          `RespawnService: Node ${nodeId} did not enter respawning state or has no respawnEndTime after initiateRespawnCycle call.`,
        );
      }
    }
  }

  private scheduleNextRespawnIncrement(
    nodeId: string,
    nextIncrementTime: number,
  ): void {
    const delay = nextIncrementTime - Date.now();
    const timerId = setTimeout(() => {
      if (this.activeTimers.has(nodeId)) {
        clearTimeout(this.activeTimers.get(nodeId));
        this.activeTimers.delete(nodeId);
      }

      useResourceNodeStore.getState().incrementRespawnCycle(nodeId);

      const { respawn } =
        useResourceNodeStore.getState().getNodeState(nodeId)?.mechanics || {};

      if (respawn?.isRespawning && respawn?.respawnEndTime) {
        this.scheduleNextRespawnIncrement(nodeId, respawn?.respawnEndTime);
      }
    }, delay);
    this.activeTimers.set(nodeId, timerId);
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
