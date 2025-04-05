import {
  ResourceType,
  ResourceNodeType,
} from "@/features/shared/types/entities";

export const RESOURCE_TO_NODE_TYPE = {
  [ResourceType.STONE]: ResourceNodeType.STONE_DEPOSIT,
  [ResourceType.WOOD]: ResourceNodeType.FALLEN_BRANCHES,
  [ResourceType.FOOD]: ResourceNodeType.BERRY_BUSH,
};
