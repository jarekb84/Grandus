import { create } from "zustand";
import {
  EntityType,
  Entity,
  ResourceNodeEntity,
  ResourceNodeType,
} from "@/features/shared/types/entities";

interface EntityCollections {
  byId: Map<string, Entity>;
  byType: Map<EntityType, Set<string>>;
  nodesByType: Map<ResourceNodeType, Set<string>>;
}

interface GameState {
  // Entity Collections
  entities: EntityCollections;

  // Computed state (cached values)
  availableNodes: Map<ResourceNodeType, boolean>;

  // Entity Operations
  addEntity: (entity: Entity) => void;
  removeEntity: (entityId: string) => void;
  updateEntity: (entityId: string, updates: Partial<Entity>) => void;

  // Query Methods
  getEntitiesByType: (type: EntityType) => Entity[];
  getNodesByType: (type: ResourceNodeType) => ResourceNodeEntity[];
  hasAvailableNodeType: (type: ResourceNodeType) => boolean;
}

const createEntityCollections = (): EntityCollections => ({
  byId: new Map<string, Entity>(),
  byType: new Map<EntityType, Set<string>>(),
  nodesByType: new Map<ResourceNodeType, Set<string>>(),
});

// todo this file needs to be simplified, tons of duplicate code and saftey handling
export const useGameState = create<GameState>((set, get) => ({
  entities: createEntityCollections(),
  availableNodes: new Map([
    [ResourceNodeType.STONE_DEPOSIT, false],
    [ResourceNodeType.IRON_DEPOSIT, false],
    [ResourceNodeType.BERRY_BUSH, false],
    [ResourceNodeType.FALLEN_BRANCHES, false],
    [ResourceNodeType.TREE, false],
  ]),

  addEntity: (entity: Entity): void => {
    set((state) => {
      const newState = { ...state };
      const { entities } = newState;

      // Add to byId index
      entities.byId.set(entity.id, entity);

      // Add to byType index
      const typeSet = entities.byType.get(entity.type) ?? new Set();
      entities.byType.set(entity.type, typeSet);
      typeSet.add(entity.id);

      // Add to nodesByType index if it's a resource node
      if (entity.type === EntityType.RESOURCE_NODE && "nodeType" in entity) {
        // Type assertion removed, 'entity' is already narrowed here
        const nodeTypeSet =
          entities.nodesByType.get(entity.nodeType) ?? new Set();
        entities.nodesByType.set(entity.nodeType, nodeTypeSet);
        nodeTypeSet.add(entity.id);

        // Update available nodes cache
        newState.availableNodes.set(entity.nodeType, true); // Use entity.nodeType
      }

      return newState;
    });
  },

  removeEntity: (entityId: string): void => {
    set((state) => {
      const entity = state.entities.byId.get(entityId);
      if (!entity) return state;

      const newState = { ...state };
      const { entities } = newState;

      // Remove from byId index
      entities.byId.delete(entityId);

      // Remove from byType index
      const entityTypeSet = entities.byType.get(entity.type);
      if (entityTypeSet) {
        entityTypeSet.delete(entityId);
      }

      // Remove from nodesByType index if it's a resource node
      if (entity.type === EntityType.RESOURCE_NODE && "nodeType" in entity) {
        // Type assertion removed, 'entity' is already narrowed here
        const nodeTypeSet = entities.nodesByType.get(entity.nodeType);
        if (nodeTypeSet) {
          nodeTypeSet.delete(entityId);
        }

        // Update available nodes cache
        const nodeCount = entities.nodesByType.get(entity.nodeType)?.size ?? 0; // Use entity.nodeType
        newState.availableNodes.set(entity.nodeType, nodeCount > 0); // Use entity.nodeType
      }

      return newState;
    });
  },

  updateEntity: (entityId: string, updates: Partial<Entity>): void => {
    set((state) => {
      const entity = state.entities.byId.get(entityId);
      if (!entity) return state;

      const newState = { ...state };
      const { entities } = newState;

      // Create updated entity
      const updatedEntity = { ...entity, ...updates };
      if (
        updatedEntity.type !== EntityType.RESOURCE_NODE &&
        updatedEntity.type !== EntityType.CHARACTER
      ) {
        return state;
      }

      // Type assertion is safe here because we've checked the type
      entities.byId.set(entityId, updatedEntity as Entity);

      // Handle type changes if needed
      if (updates.type !== undefined && updates.type !== entity.type) {
        // Explicit check for undefined
        // Remove from old type index
        const oldTypeSet = entities.byType.get(entity.type);
        if (oldTypeSet) {
          oldTypeSet.delete(entityId);
        }

        // Add to new type index
        const newTypeSet = entities.byType.get(updates.type) ?? new Set();
        entities.byType.set(updates.type, newTypeSet);
        newTypeSet.add(entityId);
      }

      // Handle node type changes if needed
      if (
        entity.type === EntityType.RESOURCE_NODE &&
        "nodeType" in updates &&
        "nodeType" in entity &&
        updates.nodeType !== entity.nodeType
      ) {
        // Type assertion removed, 'entity' is already narrowed here
        const oldNodeType = entity.nodeType;
        const newNodeType = updates.nodeType;
        if (!(newNodeType in ResourceNodeType)) {
          return state;
        }

        // Remove from old nodeType index
        const oldNodeTypeSet = entities.nodesByType.get(oldNodeType);
        if (oldNodeTypeSet) {
          oldNodeTypeSet.delete(entityId);
        }

        // Add to new nodeType index
        const newNodeTypeSet =
          entities.nodesByType.get(newNodeType) ?? new Set();
        entities.nodesByType.set(newNodeType, newNodeTypeSet);
        newNodeTypeSet.add(entityId);

        // Update available nodes cache
        const oldNodeCount = oldNodeTypeSet?.size ?? 0;
        newState.availableNodes.set(oldNodeType, oldNodeCount > 0);
        newState.availableNodes.set(newNodeType, true);
      }

      return newState;
    });
  },

  getEntitiesByType: (type: EntityType): Entity[] => {
    const state = get();
    const entityIds = state.entities.byType.get(type) ?? new Set();
    return Array.from(entityIds)
      .map((id) => state.entities.byId.get(id))
      .filter((entity): entity is Entity => entity !== undefined);
  },

  getNodesByType: (type: ResourceNodeType): ResourceNodeEntity[] => {
    const state = get();
    const entityIds = state.entities.nodesByType.get(type) ?? new Set();
    return Array.from(entityIds)
      .map((id) => state.entities.byId.get(id))
      .filter(
        (entity): entity is ResourceNodeEntity =>
          entity !== undefined &&
          entity.type === EntityType.RESOURCE_NODE &&
          "nodeType" in entity,
      );
  },

  hasAvailableNodeType: (type: ResourceNodeType): boolean => {
    return get().availableNodes.get(type) ?? false;
  },
}));

// Removed unused type guard functions: isValidEntityType, isResourceNode, isValidNodeType
