import {
  EntityType,
  Shape,
  ResourceType,
} from "@/features/shared/types/entities";

export interface InitialEntityData {
  id: string;
  type: EntityType;
  hexCoords: { q: number; r: number };
  hexOffsetPixels: { x: number; y: number };
  properties: {
    shape: Shape;
    color: number;
    size: number;
    yields?: {
      resourceType: ResourceType;
      baseAmount: number;
      chance: number;
    }[];
    nodeType?: import("@/features/shared/types/entities").ResourceNodeType;
    buildingType?: string;
  };
}

export const initialTerritoryEntitiesData: InitialEntityData[] = [
  {
    id: "base1",
    type: EntityType.BUILDING,
    hexCoords: { q: 0, r: 0 },
    hexOffsetPixels: { x: 0, y: 0 },
    properties: {
      shape: Shape.SQUARE,
      color: 0x00ff00,
      size: 40,
    },
  },
  {
    id: "stoneNode1",
    type: EntityType.RESOURCE_NODE,
    hexCoords: { q: 0, r: 0 },
    hexOffsetPixels: { x: 40, y: 30 },
    properties: {
      shape: Shape.CIRCLE,
      color: 0x808080, // Grayish color for stone
      size: 28,
      yields: [{ resourceType: ResourceType.STONE, baseAmount: 1, chance: 1 }], // Updated yields structure
    },
  },
  {
    id: "player1",
    type: EntityType.CHARACTER,
    hexCoords: { q: 0, r: 0 }, // Same hex as base and stone node initially
    hexOffsetPixels: { x: -30, y: -30 }, // Offset from center
    properties: {
      shape: Shape.CIRCLE,
      color: 0x0000ff, // Blue color for player
      size: 20,
    },
  },
];
