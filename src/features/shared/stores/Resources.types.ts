import { ResourceType } from '@/game/entities.types';

export interface ResourcesState {
  resources: {
    [ResourceType.STONE]: number;
    [ResourceType.WOOD]: number;
    [ResourceType.FOOD]: number;
  };
  
  // Resource operations
  addResource: (type: ResourceType, amount: number) => void;
  removeResource: (type: ResourceType, amount: number) => void;
  getResource: (type: ResourceType) => number;
  hasResource: (type: ResourceType, amount: number) => boolean;
} 