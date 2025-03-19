import { create } from 'zustand';
import { ResourceType } from '@/game/entities.types';
import { ResourcesState } from './resourcesStore.types';

export const useResourcesStore = create<ResourcesState>((set, get) => ({
  resources: {
    [ResourceType.STONE]: 100,
    [ResourceType.WOOD]: 0,
    [ResourceType.FOOD]: 0,
  },
  
  addResource: (type: ResourceType, amount: number) => {
    set(state => ({
      ...state,
      resources: {
        ...state.resources,
        [type]: state.resources[type] + amount
      }
    }));
  },
  
  removeResource: (type: ResourceType, amount: number) => {
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
  
  getResource: (type: ResourceType) => {
    return get().resources[type];
  },
  
  hasResource: (type: ResourceType, amount: number) => {
    return get().resources[type] >= amount;
  }
})); 