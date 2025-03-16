import { v4 as uuidv4 } from 'uuid'
import { 
  GameEntity, 
  EntityType, 
  ResourceType,
  ResourceEntity 
} from '../entities.types'

const RESOURCE_CONFIGS = {
  [ResourceType.STONE]: {
    color: 0x94a3b8,
    size: 8
  },
  [ResourceType.WOOD]: {
    color: 0xca8a04,
    size: 15
  },
  [ResourceType.FOOD]: {
    color: 0x22c55e,
    size: 12
  }
}

export function generateInitialEntities(): GameEntity[] {
  const entities: GameEntity[] = []

  // Add player
  entities.push({
    id: 'player1',
    type: EntityType.CHARACTER,
    position: { x: 400, y: 300 },
    properties: {
      size: 20,
      color: 0x4ade80
    }
  })

  // Add base
  entities.push({
    id: 'base1',
    type: EntityType.BUILDING,
    position: { x: 400, y: 400 },
    properties: {
      size: 40,
      color: 0x60a5fa
    }
  })

  // Add resources
  const resourcePositions = {
    [ResourceType.STONE]: [
      { x: 200, y: 200 },
      { x: 600, y: 200 },
      { x: 300, y: 500 },
      { x: 500, y: 500 },
      { x: 400, y: 150 }
    ],
    [ResourceType.WOOD]: [
      { x: 150, y: 150 },
      { x: 650, y: 150 },
      { x: 250, y: 550 },
      { x: 550, y: 550 }
    ],
    [ResourceType.FOOD]: [
      { x: 100, y: 300 },
      { x: 700, y: 300 },
      { x: 400, y: 600 },
      { x: 200, y: 400 },
      { x: 600, y: 400 }
    ]
  }

  Object.entries(resourcePositions).forEach(([type, positions]) => {
    positions.forEach(position => {
      entities.push({
        id: uuidv4(),
        type: EntityType.RESOURCE,
        resourceType: type as ResourceType,
        position,
        properties: RESOURCE_CONFIGS[type as ResourceType]
      } as ResourceEntity)
    })
  })

  return entities
} 