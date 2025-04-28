import { create } from 'zustand';
import { ResourceNodeMechanics, ResourceNodeType, ResourceYield } from '../shared/types/entities';

// TODO FIX This should be updated, isRespawning and respawnEndTime should be inside mechanics.respawnSettings
// TODO FIX This interface name and methods that use the same term probably doesn't need an explicit "RunTimeState" suffix
//      Because this is defined within the zustand store and should be obvious from usage.
interface ResourceNodeRuntimeState {
  nodeId: string;
  nodeType: ResourceNodeType;
  yields: ResourceYield[];
  mechanics: ResourceNodeMechanics;
  isRespawning: boolean;
  respawnEndTime: number | null;
}

interface ResourceNodeStoreState {
  nodeStates: Map<string, ResourceNodeRuntimeState>;
  initializeNodeState: (
    nodeId: string,
    nodeType: ResourceNodeType,
    yields: ResourceYield[],
    mechanics: ResourceNodeMechanics,
  ) => void;
  decrementNodeCapacity: (nodeId: string, amount: number) => void;
  getNodeRuntimeState: (nodeId: string) => ResourceNodeRuntimeState | undefined;
  startRespawn: (nodeId: string) => void;
  finishRespawn: (nodeId: string) => void;
  resetStore: () => void;
  getResourceNodeIdsOfType: (resourceType: ResourceNodeType) => string[];
}

export const useResourceNodeStore = create<ResourceNodeStoreState>((set, get) => ({
  nodeStates: new Map(),

  initializeNodeState: (
    nodeId: string,
    nodeType: ResourceNodeType,
    yields: ResourceYield[],
    mechanics: ResourceNodeMechanics,
  ): void => {
    set((state) => {
      const newNodeStates = new Map(state.nodeStates);
      newNodeStates.set(nodeId, {
        nodeId,
        nodeType,
        yields,
        mechanics,
        isRespawning: false,
        respawnEndTime: null,
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
      }
      return { nodeStates: newNodeStates };
    });
  },

  getNodeRuntimeState: (nodeId: string): ResourceNodeRuntimeState | undefined => {
    return get().nodeStates.get(nodeId);
  },

  startRespawn: (nodeId: string): void => {
    set((state) => {
      const newNodeStates = new Map(state.nodeStates);
      const node = newNodeStates.get(nodeId);
      if (node && !node.isRespawning) {
        const duration = node.mechanics.respawn.cycleDurationMs;
        newNodeStates.set(nodeId, {
          ...node,
          isRespawning: true,
          respawnEndTime: Date.now() + duration,
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
        };
        newNodeStates.set(nodeId, {
          ...node,
          mechanics: updatedMechanics,
          isRespawning: false,
          respawnEndTime: null,
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
}));