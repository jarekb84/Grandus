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
  entities: EntityCollections;

  availableNodes: Map<ResourceNodeType, boolean>;

  addEntity: (entity: Entity) => void;
  removeEntity: (entityId: string) => void;
  updateEntity: (entityId: string, updates: Partial<Entity>) => void;

  getEntitiesByType: (type: EntityType) => Entity[];
  getNodesByType: (type: ResourceNodeType) => ResourceNodeEntity[];
  hasAvailableNodeType: (type: ResourceNodeType) => boolean;
}

const createEntityCollections = (): EntityCollections => ({
  byId: new Map<string, Entity>(),
  byType: new Map<EntityType, Set<string>>(),
  nodesByType: new Map<ResourceNodeType, Set<string>>(),
});

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

      entities.byId.set(entity.id, entity);

      const typeSet = entities.byType.get(entity.type) ?? new Set();
      entities.byType.set(entity.type, typeSet);
      typeSet.add(entity.id);

      if (entity.type === EntityType.RESOURCE_NODE && "nodeType" in entity) {
        const nodeTypeSet =
          entities.nodesByType.get(entity.nodeType) ?? new Set();
        entities.nodesByType.set(entity.nodeType, nodeTypeSet);
        nodeTypeSet.add(entity.id);

        newState.availableNodes.set(entity.nodeType, true);
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

      entities.byId.delete(entityId);

      const entityTypeSet = entities.byType.get(entity.type);
      if (entityTypeSet) {
        entityTypeSet.delete(entityId);
      }

      if (entity.type === EntityType.RESOURCE_NODE && "nodeType" in entity) {
        const nodeTypeSet = entities.nodesByType.get(entity.nodeType);
        if (nodeTypeSet) {
          nodeTypeSet.delete(entityId);
        }

        const nodeCount = entities.nodesByType.get(entity.nodeType)?.size ?? 0;
        newState.availableNodes.set(entity.nodeType, nodeCount > 0);
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

      const updatedEntity = { ...entity, ...updates };
      if (
        updatedEntity.type !== EntityType.RESOURCE_NODE &&
        updatedEntity.type !== EntityType.CHARACTER
      ) {
        return state;
      }

      entities.byId.set(entityId, updatedEntity as Entity);

      if (updates.type !== undefined && updates.type !== entity.type) {
        const oldTypeSet = entities.byType.get(entity.type);
        if (oldTypeSet) {
          oldTypeSet.delete(entityId);
        }

        const newTypeSet = entities.byType.get(updates.type) ?? new Set();
        entities.byType.set(updates.type, newTypeSet);
        newTypeSet.add(entityId);
      }

      if (
        entity.type === EntityType.RESOURCE_NODE &&
        "nodeType" in updates &&
        "nodeType" in entity &&
        updates.nodeType !== entity.nodeType
      ) {
        const oldNodeType = entity.nodeType;
        const newNodeType = updates.nodeType;
        if (!(newNodeType in ResourceNodeType)) {
          return state;
        }

        const oldNodeTypeSet = entities.nodesByType.get(oldNodeType);
        if (oldNodeTypeSet) {
          oldNodeTypeSet.delete(entityId);
        }

        const newNodeTypeSet =
          entities.nodesByType.get(newNodeType) ?? new Set();
        entities.nodesByType.set(newNodeType, newNodeTypeSet);
        newNodeTypeSet.add(entityId);

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
