import {
  EntityType,
  Shape,
  ResourceType,
} from "@/features/shared/types/entities";

export const COLORS = {
  GREEN: 0x00ff00,
  GRAY: 0x808080,
  BLUE: 0x0000ff,
  // TODO: Add other colors used elsewhere (e.g., Territory.scene.ts) if this is moved to a shared location
} as const;

export type ColorDefinition = typeof COLORS;
export type ColorName = keyof ColorDefinition;


export interface InitialEntityData {
  id: string;
  type: EntityType;
  hexCoords: { q: number; r: number };
  hexOffsetPixels: { x: number; y: number };
  properties: {
    graphical: {
      shape: Shape;
      color: number;
      size: number;
      depth: number;
    };
    yields?: {
      resourceType: ResourceType;
      baseAmount: number;
      chance: number;
    }[];
    nodeType?: import("@/features/shared/types/entities").ResourceNodeType;
    buildingType?: string;
    // Resource Node specific properties for conversion
    maxCapacity?: number;
    currentCapacity?: number;
    baseGatherTimeMs?: number; // Base time in ms
    gatheringSpeedMultiplier?: number; // Multiplier for speed (e.g., 1.1 = 10% faster)
    yieldMultiplier?: number; // Multiplier for resource amount
    respawnDurationMs?: number; // Time in ms for one respawn cycle
    respawnCapacityIncrement?: number; // Amount restored per cycle
  };
}

export const initialTerritoryEntitiesData: InitialEntityData[] = [
  {
    id: "base1",
    type: EntityType.BUILDING,
    hexCoords: { q: 0, r: 0 },
    hexOffsetPixels: { x: 0, y: 0 },
    properties: {
      graphical: {
        shape: Shape.SQUARE,
        color: COLORS.GREEN,
        size: 40,
        depth: 0,
      },
    },
  },
  {
    id: "stoneNode1",
    type: EntityType.RESOURCE_NODE,
    hexCoords: { q: 0, r: 0 },
    hexOffsetPixels: { x: 40, y: 30 },
    properties: {
      graphical: {
        shape: Shape.CIRCLE,
        color: COLORS.GRAY,
        size: 28,
        depth: 0,
      },
      yields: [{ resourceType: ResourceType.STONE, baseAmount: 1, chance: 1 }],
      maxCapacity: 5,
      currentCapacity: 1,
      baseGatherTimeMs: 1000, // Default gather time
      gatheringSpeedMultiplier: 1, // Default speed multiplier
      yieldMultiplier: 1, // Default yield multiplier
      respawnDurationMs: 5000, // Renamed from respawnDuration
      respawnCapacityIncrement: 1, // Default increment amount
    },
  },
  {
    id: "player1",
    type: EntityType.CHARACTER,
    hexCoords: { q: 0, r: 0 }, // Same hex as base and stone node initially
    hexOffsetPixels: { x: -30, y: -30 }, // Offset from center
    properties: {
      graphical: {
        shape: Shape.CIRCLE,
        color: COLORS.BLUE,
        size: 20,
        depth: 1,
      },
    },
  },
];
