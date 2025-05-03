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
  startRespawn: (nodeId: string) => void;
  finishRespawn: (nodeId: string) => void;
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

          const activeEffects: NodeVisualEffect[] =
            newCapacityValue <= 0 ? ["depleted"] : ["fully_stocked"];
          eventBus.emit("NODE_VISUAL_STATE_CHANGED", { nodeId, activeEffects });
        }
        return { nodeStates: newNodeStates };
      });
    },

    getNodeState: (nodeId: string): ResourceNodeState | undefined => {
      return get().nodeStates.get(nodeId);
    },

    startRespawn: (nodeId: string): void => {
      set((state) => {
        const newNodeStates = new Map(state.nodeStates);
        const node = newNodeStates.get(nodeId);
        if (node && !node.mechanics.respawn.isRespawning) {
          const duration = node.mechanics.respawn.cycleDurationMs;
          const updatedMechanics: ResourceNodeMechanics = {
            ...node.mechanics,
            respawn: {
              ...node.mechanics.respawn,
              isRespawning: true,
              respawnEndTime: Date.now() + duration,
            },
          };
          newNodeStates.set(nodeId, {
            ...node,
            mechanics: updatedMechanics,
          });

          eventBus.emit("NODE_VISUAL_STATE_CHANGED", {
            nodeId,
            activeEffects: ["depleted", "respawning_pulse"],
          });
          return { nodeStates: newNodeStates };
        }
        return {};
      });
    },

    finishRespawn: (nodeId: string): void => {
      set((state) => {
        const newNodeStates = new Map(state.nodeStates);
        const node = newNodeStates.get(nodeId);
        if (node) {
          // Reset capacity to max, sourced from mechanics
          const maxCapacity = node.mechanics.capacity.max;
          const updatedMechanics: ResourceNodeMechanics = {
            ...node.mechanics,
            capacity: {
              ...node.mechanics.capacity,
              current: maxCapacity,
            },
            respawn: {
              ...node.mechanics.respawn,
              isRespawning: false,
              respawnEndTime: null,
            },
          };
          newNodeStates.set(nodeId, {
            ...node,
            mechanics: updatedMechanics,
          });

          eventBus.emit("NODE_VISUAL_STATE_CHANGED", {
            nodeId,
            activeEffects: ["fully_stocked"],
          });
          return { nodeStates: newNodeStates };
        }
        return {};
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
