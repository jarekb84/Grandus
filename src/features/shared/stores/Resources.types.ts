import { ResourceType } from "@/features/shared/types/entities";

export interface ResourcesState {
  resources: {
    [ResourceType.STONE]: number;
    [ResourceType.WOOD]: number;
    [ResourceType.FOOD]: number;
    [ResourceType.PEBBLE]: number;
  };

  addResource: (type: ResourceType, amount: number) => void;
  removeResource: (type: ResourceType, amount: number) => void;
  getResource: (type: ResourceType) => number;
  hasResource: (type: ResourceType, amount: number) => boolean;
}
