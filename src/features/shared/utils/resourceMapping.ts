import { ResourceType, ResourceNodeType } from '@/features/shared/types/entities'

// Map resource types to their primary node types
export const RESOURCE_TO_NODE_TYPE = {
  [ResourceType.STONE]: ResourceNodeType.STONE_DEPOSIT,
  [ResourceType.WOOD]: ResourceNodeType.FALLEN_BRANCHES,
  [ResourceType.FOOD]: ResourceNodeType.BERRY_BUSH
} 