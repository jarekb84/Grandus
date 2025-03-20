import { create } from 'zustand'
import { EntityType, ResourceType, Entity, ResourceNodeEntity, ResourceNodeType } from '@/features/shared/types/entities'

interface EntityCollections {
  byId: Map<string, Entity>
  byType: Map<EntityType, Set<string>>
  nodesByType: Map<ResourceNodeType, Set<string>>
}

interface GameState {
  // Entity Collections
  entities: EntityCollections
  
  // Computed state (cached values)
  availableNodes: Map<ResourceNodeType, boolean>

  // Entity Operations
  addEntity: (entity: Entity) => void
  removeEntity: (entityId: string) => void
  updateEntity: (entityId: string, updates: Partial<Entity>) => void
  
  // Query Methods
  getEntitiesByType: (type: EntityType) => Entity[]
  getNodesByType: (type: ResourceNodeType) => ResourceNodeEntity[]
  hasAvailableNodeType: (type: ResourceNodeType) => boolean
}

const createEntityCollections = (): EntityCollections => ({
  byId: new Map<string, Entity>(),
  byType: new Map<EntityType, Set<string>>(),
  nodesByType: new Map<ResourceNodeType, Set<string>>()
})


// todo this file needs to be simplified, tons of duplicate code and saftey handling
export const useGameState = create<GameState>((set, get) => ({
  entities: createEntityCollections(),
  availableNodes: new Map([
    [ResourceNodeType.STONE_DEPOSIT, false],
    [ResourceNodeType.IRON_DEPOSIT, false],
    [ResourceNodeType.BERRY_BUSH, false],
    [ResourceNodeType.FALLEN_BRANCHES, false],
    [ResourceNodeType.TREE, false]
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

      // Add to nodesByType index if it's a resource node
      if (entity.type === EntityType.RESOURCE_NODE && 'nodeType' in entity) {
        const nodeEntity = entity as ResourceNodeEntity
        if (!entities.nodesByType.has(nodeEntity.nodeType)) {
          entities.nodesByType.set(nodeEntity.nodeType, new Set())
        }
        entities.nodesByType.get(nodeEntity.nodeType)!.add(entity.id)

        // Update available nodes cache
        newState.availableNodes.set(nodeEntity.nodeType, true)
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

      // Remove from nodesByType index if it's a resource node
      if (entity.type === EntityType.RESOURCE_NODE && 'nodeType' in entity) {
        const nodeEntity = entity as ResourceNodeEntity
        entities.nodesByType.get(nodeEntity.nodeType)?.delete(entityId)

        // Update available nodes cache
        const nodeCount = entities.nodesByType.get(nodeEntity.nodeType)?.size ?? 0
        const hasNodesLeft = nodeCount > 0
        newState.availableNodes.set(nodeEntity.nodeType, hasNodesLeft)
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

      // Handle node type changes if needed
      if (
        entity.type === EntityType.RESOURCE_NODE &&
        'nodeType' in updates &&
        updates.nodeType !== (entity as ResourceNodeEntity).nodeType
      ) {
        const oldNodeType = (entity as ResourceNodeEntity).nodeType
        const newNodeType = updates.nodeType as ResourceNodeType

        // Remove from old nodeType index
        entities.nodesByType.get(oldNodeType)?.delete(entityId)
        
        // Add to new nodeType index
        if (!entities.nodesByType.has(newNodeType)) {
          entities.nodesByType.set(newNodeType, new Set())
        }
        entities.nodesByType.get(newNodeType)!.add(entityId)

        // Update available nodes cache
        const oldNodeCount = entities.nodesByType.get(oldNodeType)?.size ?? 0
        const newNodeCount = entities.nodesByType.get(newNodeType)?.size ?? 1
        newState.availableNodes.set(oldNodeType, oldNodeCount > 0)
        newState.availableNodes.set(newNodeType, newNodeCount > 0)
      }

      return newState
    })
  },

  getEntitiesByType: (type: EntityType) => {
    const state = get()
    const entityIds = state.entities.byType.get(type) ?? new Set()
    return Array.from(entityIds).map(id => state.entities.byId.get(id)!).filter(Boolean)
  },

  getNodesByType: (type: ResourceNodeType) => {
    const state = get()
    const entityIds = state.entities.nodesByType.get(type) ?? new Set()
    return Array.from(entityIds)
      .map(id => state.entities.byId.get(id))
      .filter((entity): entity is ResourceNodeEntity => 
        entity !== undefined && 
        entity.type === EntityType.RESOURCE_NODE && 
        'nodeType' in entity
      )
  },

  hasAvailableNodeType: (type: ResourceNodeType) => {
    return get().availableNodes.get(type) ?? false
  }
})) 