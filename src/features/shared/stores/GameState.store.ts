import { create } from "zustand";
import {
  EntityType,  
  LightweightEntity,
} from "@/features/shared/types/entities";

interface EntityCollections {
  byId: Map<string, LightweightEntity>;
  byType: Map<EntityType, Set<string>>;
}

interface GameState {
  entities: EntityCollections;
  addEntity: (entity: LightweightEntity) => void;
  removeEntity: (entityId: string) => void;  
  updateEntity: (entityId: string, updates: Partial<LightweightEntity>) => void;
  getEntitiesByType: (type: EntityType) => LightweightEntity[];  
}

const createEntityCollections = (): EntityCollections => ({
  byId: new Map<string, LightweightEntity>(),
  byType: new Map<EntityType, Set<string>>(),
});

export const useGameState = create<GameState>((set, get) => ({
  entities: createEntityCollections(),

  addEntity: (entity: LightweightEntity): void => {
    set((state) => {
      const newState = { ...state };
      const { entities } = newState;

      entities.byId.set(entity.id, entity);
      const typeSet = entities.byType.get(entity.type) ?? new Set();
      entities.byType.set(entity.type, typeSet);
      typeSet.add(entity.id);

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

      return newState;
    });
  },

  updateEntity: (entityId: string, updates: Partial<LightweightEntity>): void => {
    set((state) => {
      const entity = state.entities.byId.get(entityId);
      if (!entity) return state;

      const newState = { ...state };
      const { entities } = newState;
      const updatedEntity = { ...entity, ...updates };

      
      entities.byId.set(entityId, updatedEntity);

      
      if (updates.type !== undefined && updates.type !== entity.type) {
        const oldTypeSet = entities.byType.get(entity.type);
        if (oldTypeSet) {
          oldTypeSet.delete(entityId);
        }
        const newTypeSet = entities.byType.get(updates.type) ?? new Set();
        entities.byType.set(updates.type, newTypeSet);
        newTypeSet.add(entityId);
      }

      return newState;
    });
  },

  getEntitiesByType: (type: EntityType): LightweightEntity[] => {
    const state = get();
    const entityIds = state.entities.byType.get(type) ?? new Set();
    return Array.from(entityIds)
      .map((id) => state.entities.byId.get(id))      
      .filter((entity): entity is LightweightEntity => entity !== undefined);
  },
}));
