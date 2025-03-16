import { create } from 'zustand'
import { EntityType, ResourceType, Entity, ResourceEntity } from '../entities.types'

interface EntityCollections {
  byId: Map<string, Entity>
  byType: Map<EntityType, Set<string>>
  resourcesByType: Map<ResourceType, Set<string>>
}

interface GameState {
  // Entity Collections
  entities: EntityCollections
  inventory: {
    stone: number
    wood: number
    food: number
  }

  // Computed state (cached values)
  availableResources: Map<ResourceType, boolean>

  // Entity Operations
  addEntity: (entity: Entity) => void
  removeEntity: (entityId: string) => void
  updateEntity: (entityId: string, updates: Partial<Entity>) => void
  
  // Resource Operations
  incrementResource: (type: ResourceType) => void

  // Query Methods
  getEntitiesByType: (type: EntityType) => Entity[]
  getResourceEntitiesByType: (type: ResourceType) => ResourceEntity[]
  hasAvailableResource: (type: ResourceType) => boolean
}

const createEntityCollections = (): EntityCollections => ({
  byId: new Map<string, Entity>(),
  byType: new Map<EntityType, Set<string>>(),
  resourcesByType: new Map<ResourceType, Set<string>>()
})

export const useGameState = create<GameState>((set, get) => ({
  entities: createEntityCollections(),
  inventory: {
    stone: 0,
    wood: 0,
    food: 0
  },
  availableResources: new Map([
    [ResourceType.STONE, false],
    [ResourceType.WOOD, false],
    [ResourceType.FOOD, false]
  ]),

  addEntity: (entity: Entity) => {
    set(state => {
      const newState = { ...state }
      const { entities } = newState

      // Add to byId index
      entities.byId.set(entity.id, entity)

      // Add to byType index
      if (!entities.byType.has(entity.type)) {
        entities.byType.set(entity.type, new Set())
      }
      entities.byType.get(entity.type)!.add(entity.id)

      // Add to resourcesByType index if it's a resource
      if (entity.type === EntityType.RESOURCE && 'resourceType' in entity) {
        const resourceEntity = entity as ResourceEntity
        if (!entities.resourcesByType.has(resourceEntity.resourceType)) {
          entities.resourcesByType.set(resourceEntity.resourceType, new Set())
        }
        entities.resourcesByType.get(resourceEntity.resourceType)!.add(entity.id)

        // Update available resources cache
        newState.availableResources.set(resourceEntity.resourceType, true)
      }

      return newState
    })
  },

  removeEntity: (entityId: string) => {
    set(state => {
      const entity = state.entities.byId.get(entityId)
      if (!entity) return state

      const newState = { ...state }
      const { entities } = newState

      // Remove from byId index
      entities.byId.delete(entityId)

      // Remove from byType index
      entities.byType.get(entity.type)?.delete(entityId)

      // Remove from resourcesByType index if it's a resource
      if (entity.type === EntityType.RESOURCE && 'resourceType' in entity) {
        const resourceEntity = entity as ResourceEntity
        entities.resourcesByType.get(resourceEntity.resourceType)?.delete(entityId)

        // Update available resources cache
        const resourceCount = entities.resourcesByType.get(resourceEntity.resourceType)?.size ?? 0
        const hasResourcesLeft = resourceCount > 0
        newState.availableResources.set(resourceEntity.resourceType, hasResourcesLeft)
      }

      return newState
    })
  },

  updateEntity: (entityId: string, updates: Partial<Entity>) => {
    set(state => {
      const entity = state.entities.byId.get(entityId)
      if (!entity) return state

      const newState = { ...state }
      const { entities } = newState

      // Create updated entity with type assertion
      const updatedEntity = { ...entity, ...updates } as Entity
      entities.byId.set(entityId, updatedEntity)

      // Handle type changes if needed
      if (updates.type && updates.type !== entity.type) {
        // Remove from old type index
        entities.byType.get(entity.type)?.delete(entityId)
        
        // Add to new type index
        if (!entities.byType.has(updates.type)) {
          entities.byType.set(updates.type, new Set())
        }
        entities.byType.get(updates.type)!.add(entityId)
      }

      return newState
    })
  },

  incrementResource: (type: ResourceType) => {
    set(state => ({
      ...state,
      inventory: {
        ...state.inventory,
        [type.toLowerCase()]: state.inventory[type.toLowerCase() as keyof typeof state.inventory] + 1
      }
    }))
  },

  getEntitiesByType: (type: EntityType) => {
    const state = get()
    const entityIds = state.entities.byType.get(type) ?? new Set()
    return Array.from(entityIds).map(id => state.entities.byId.get(id)!).filter(Boolean)
  },

  getResourceEntitiesByType: (type: ResourceType) => {
    const state = get()
    const entityIds = state.entities.resourcesByType.get(type) ?? new Set()
    return Array.from(entityIds)
      .map(id => state.entities.byId.get(id))
      .filter((entity): entity is ResourceEntity => 
        entity !== undefined && 
        entity.type === EntityType.RESOURCE && 
        'resourceType' in entity
      )
  },

  hasAvailableResource: (type: ResourceType) => {
    return get().availableResources.get(type) ?? false
  }
})) 