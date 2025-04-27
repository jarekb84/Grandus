import { create } from 'zustand';

interface NodeState {
  currentCapacity: number;
  maxCapacity: number;
  nodeId: string;
  isRespawning: boolean;
  respawnEndTime: number | null;
}

interface ResourceNodeStoreState {
  nodeStates: Map<string, NodeState>;
  initializeNodeState: (nodeId: string, maxCapacity: number, currentCapacity: number) => void;
  decrementNodeCapacity: (nodeId: string, amount: number) => void;
  getNodeCapacity: (nodeId: string) => NodeState | undefined;
  startRespawn: (nodeId: string, duration: number) => void;
  finishRespawn: (nodeId: string) => void;
  resetStore: () => void;
}

export const useResourceNodeStore = create<ResourceNodeStoreState>((set, get) => ({
  nodeStates: new Map(),

  initializeNodeState: (nodeId: string, maxCapacity: number, currentCapacity: number): void => {
    set((state) => {
      const newNodeStates = new Map(state.nodeStates);
      newNodeStates.set(nodeId, {
        nodeId,
        maxCapacity,
        currentCapacity,
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
        const newCapacity = Math.max(0, node.currentCapacity - amount);
        newNodeStates.set(nodeId, { ...node, currentCapacity: newCapacity });
      }
      return { nodeStates: newNodeStates };
    });
  },

  getNodeCapacity: (nodeId: string): NodeState | undefined => {
    return get().nodeStates.get(nodeId);
  },

  startRespawn: (nodeId: string, duration: number): void => {
    set((state) => {
      const newNodeStates = new Map(state.nodeStates);
      const node = newNodeStates.get(nodeId);      
      if (node && !node.isRespawning) {
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
        newNodeStates.set(nodeId, {
          ...node,
          isRespawning: false,
          respawnEndTime: null,
          currentCapacity: node.maxCapacity // this is a place holder, value should come from node
        });

        return { nodeStates: newNodeStates };
      }
      return {};
    });
  },

  resetStore: (): void => {
    set({ nodeStates: new Map() });
  },
}));