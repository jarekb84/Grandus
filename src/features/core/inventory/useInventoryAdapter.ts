import { ResourceType } from '@/features/shared/types/entities'
import { useResourcesStore } from '@/features/shared/stores/Resources.store'

interface InventoryResources {
  stoneCount: number
  woodCount: number
  foodCount: number
}

/**
 * Adapter hook for the core feature to access inventory data
 * Isolates the core feature from knowing the implementation details of the inventory
 */
export const useInventoryAdapter = (): InventoryResources => {
  const resourcesStore = useResourcesStore()
  
  return {
    stoneCount: resourcesStore.resources[ResourceType.STONE],
    woodCount: resourcesStore.resources[ResourceType.WOOD],
    foodCount: resourcesStore.resources[ResourceType.FOOD]
  }
} 