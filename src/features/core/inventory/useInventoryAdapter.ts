import { ResourceType } from "@/features/shared/types/entities";
import { useResourcesStore } from "@/features/shared/stores/Resources.store";

interface InventoryResources {
  stoneCount: number;
  woodCount: number;
  foodCount: number;
  pebbleCount: number;
}

/**
 * Adapter hook for the core feature to access inventory data
 * Isolates the core feature from knowing the implementation details of the inventory
 */
export const useInventoryAdapter = (): InventoryResources => {
  const resourcesStore = useResourcesStore();

  return {
    stoneCount: resourcesStore.resources[ResourceType.STONE] ?? 0,
    woodCount: resourcesStore.resources[ResourceType.WOOD] ?? 0,
    foodCount: resourcesStore.resources[ResourceType.FOOD] ?? 0,
    pebbleCount: resourcesStore.resources[ResourceType.PEBBLE] ?? 0,
  };
};
