import { create } from 'zustand';
import { ResourceType } from '@/features/shared/types/entities';
import { ResourcesState } from '@/features/shared/stores/Resources.types';

export const useResourcesStore = create<ResourcesState>((set, get) => ({
  resources: {
    [ResourceType.STONE]: 20,
    [ResourceType.WOOD]: 0,
    [ResourceType.FOOD]: 0,
  },
  
  addResource: (type: ResourceType, amount: number): void => {
    set(state => ({
      ...state,
      resources: {
        ...state.resources,
        [type]: state.resources[type] + amount
      }
    }));
  },
  
  removeResource: (type: ResourceType, amount: number): void => {
    set(state => {
      const currentAmount = state.resources[type];
      const newAmount = Math.max(0, currentAmount - amount);
      
      return {
        ...state,
        resources: {
          ...state.resources,
          [type]: newAmount
        }
      };
    });
  },
  
  getResource: (type: ResourceType): number => {
    return get().resources[type];
  },
  
  hasResource: (type: ResourceType, amount: number): boolean => {
    return get().resources[type] >= amount;
  }
}));
