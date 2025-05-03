import { create } from "zustand";
import {
  ResourceNodeMechanics,
  ResourceNodeType,
} from "../shared/types/entities";
import { eventBus, NodeVisualEffect } from "../shared/events/eventBus";

interface ResourceNodeState {
  nodeId: string;
  nodeType: ResourceNodeType;
  mechanics: ResourceNodeMechanics;
}

interface ResourceNodeStoreState {
  nodeStates: Map<string, ResourceNodeState>;
  initializeNodeState: (
    nodeId: string,
    nodeType: ResourceNodeType,
    mechanics: ResourceNodeMechanics,
  ) => void;
  decrementNodeCapacity: (nodeId: string, amount: number) => void;
  getNodeState: (nodeId: string) => ResourceNodeState | undefined;
  incrementRespawnCycle: (nodeId: string) => void;
  initiateRespawnCycle: (nodeId: string) => void;
  resetStore: () => void;
  getResourceNodeIdsOfType: (resourceType: ResourceNodeType) => string[];
  hasAvailableNodeType: (resourceType: ResourceNodeType) => boolean;
}

export const useResourceNodeStore = create<ResourceNodeStoreState>(
  (set, get) => ({
    nodeStates: new Map(),

    initializeNodeState: (
      nodeId: string,
      nodeType: ResourceNodeType,
      mechanics: ResourceNodeMechanics,
    ): void => {
      set((state) => {
        const newNodeStates = new Map(state.nodeStates);
        newNodeStates.set(nodeId, {
          nodeId,
          nodeType,
          mechanics,
        });
        return { nodeStates: newNodeStates };
      });
    },

    decrementNodeCapacity: (nodeId: string, amount: number): void => {
      let activeEffects: NodeVisualEffect[] = [];
      set((state) => {
        const newNodeStates = new Map(state.nodeStates);
        const node = newNodeStates.get(nodeId);

        if (node) {
          const currentCapacity = node.mechanics.capacity.current;
          const newCapacityValue = Math.max(0, currentCapacity - amount);
          const updatedMechanics: ResourceNodeMechanics = {
            ...node.mechanics,
            capacity: {
              ...node.mechanics.capacity,
              current: newCapacityValue,
            },
          };
          newNodeStates.set(nodeId, { ...node, mechanics: updatedMechanics });

          activeEffects = newCapacityValue <= 0 ? ["depleted"] : [];
        }

        return { nodeStates: newNodeStates };
      });

      eventBus.emit("NODE_VISUAL_STATE_CHANGED", { nodeId, activeEffects });
      eventBus.emit("NODE_CAPACITY_DECREMENTED", { nodeId });
    },

    getNodeState: (nodeId: string): ResourceNodeState | undefined => {
      return get().nodeStates.get(nodeId);
    },

    incrementRespawnCycle: (nodeId: string): void => {
      let activeEffects: NodeVisualEffect[] = [];
      set((state) => {
        const newNodeStates = new Map(state.nodeStates);
        const nodeState = newNodeStates.get(nodeId);

        if (nodeState && nodeState.mechanics.respawn.isRespawning) {
          const { capacity, respawn } = nodeState.mechanics;
          const newCapacity = Math.min(
            capacity.current + respawn.amountPerCycle,
            capacity.max,
          );

          const updatedMechanics: ResourceNodeMechanics = {
            ...nodeState.mechanics,
            capacity: {
              ...capacity,
              current: newCapacity,
            },
            respawn: { ...respawn },
          };

          if (newCapacity >= capacity.max) {
            updatedMechanics.respawn.isRespawning = false;
            updatedMechanics.respawn.respawnEndTime = null;
            activeEffects = ["fully_stocked"];
          } else {
            updatedMechanics.respawn.isRespawning = true;
            updatedMechanics.respawn.respawnEndTime =
              Date.now() + respawn.cycleDurationMs;
            activeEffects = ["respawning_pulse"];
          }

          newNodeStates.set(nodeId, {
            ...nodeState,
            mechanics: updatedMechanics,
          });
        }

        return { nodeStates: newNodeStates };
      });

      eventBus.emit("NODE_VISUAL_STATE_CHANGED", { nodeId, activeEffects });
    },

    initiateRespawnCycle: (nodeId: string): void => {
      set((state) => {
        const newNodeStates = new Map(state.nodeStates);
        const nodeState = newNodeStates.get(nodeId);

        if (nodeState && !nodeState.mechanics.respawn.isRespawning) {
          const { respawn } = nodeState.mechanics;
          const firstRespawnEndTime = Date.now() + respawn.cycleDurationMs;

          const updatedMechanics: ResourceNodeMechanics = {
            ...nodeState.mechanics,
            respawn: {
              ...respawn,
              isRespawning: true,
              respawnEndTime: firstRespawnEndTime,
            },
          };

          newNodeStates.set(nodeId, {
            ...nodeState,
            mechanics: updatedMechanics,
          });
        }

        return { nodeStates: newNodeStates };
      });

      eventBus.emit("NODE_VISUAL_STATE_CHANGED", {
        nodeId,
        activeEffects: ["respawning_pulse"],
      });
    },

    resetStore: (): void => {
      set({ nodeStates: new Map() });
    },
    getResourceNodeIdsOfType: (resourceType: ResourceNodeType): string[] => {
      const matchingNodeIds: string[] = [];
      const nodeStates = get().nodeStates;

      for (const [nodeId, nodeState] of nodeStates.entries()) {
        if (nodeState.nodeType === resourceType) {
          matchingNodeIds.push(nodeId);
        }
      }
      return matchingNodeIds;
    },
    hasAvailableNodeType: (resourceType: ResourceNodeType): boolean => {
      const nodeStates = get().nodeStates;
      for (const nodeState of nodeStates.values()) {
        if (
          nodeState.nodeType === resourceType &&
          nodeState.mechanics.capacity.current > 0
        ) {
          return true; // Found at least one available node of the specified type
        }
      }
      return false; // No available nodes of the specified type found
    },
  }),
);
