import { create } from 'zustand';

interface NodeState {
  currentCapacity: number;
  maxCapacity: number;
  nodeId: string;
}

interface ResourceNodeStoreState {
  nodeStates: Map<string, NodeState>;
  initializeNodeState: (nodeId: string, maxCapacity: number, currentCapacity: number) => void;
  decrementNodeCapacity: (nodeId: string, amount: number) => void;
  getNodeCapacity: (nodeId: string) => NodeState | undefined;
  resetStore: () => void;
}

export const useResourceNodeStore = create<ResourceNodeStoreState>((set, get) => ({
  nodeStates: new Map(),

  initializeNodeState: (nodeId: string, maxCapacity: number, currentCapacity: number): void => {
    set((state) => {
      const newNodeStates = new Map(state.nodeStates);
      newNodeStates.set(nodeId, { nodeId, maxCapacity, currentCapacity });
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

  resetStore: (): void => {
    set({ nodeStates: new Map() });
  },
}));