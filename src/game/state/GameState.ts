import { create, StateCreator } from 'zustand'
import { GameEntity, ResourceType } from '../types/entities.types'

interface GameState {
  entities: Map<string, GameEntity>
  inventory: {
    stone: number
    wood: number
    food: number
  }
  addEntity: (entity: GameEntity) => void
  removeEntity: (entityId: string) => void
  updateEntity: (entityId: string, updates: Partial<GameEntity>) => void
  incrementResource: (type: ResourceType) => void
}

type GameStateCreator = StateCreator<GameState>

export const useGameState = create<GameState>((set: GameStateCreator) => ({
  entities: new Map(),
  inventory: {
    stone: 0,
    wood: 0,
    food: 0
  },
  addEntity: (entity: GameEntity) => 
    set((state: GameState) => {
      const newEntities = new Map(state.entities)
      newEntities.set(entity.id, entity)
      return { entities: newEntities }
    }),
  removeEntity: (entityId: string) =>
    set((state: GameState) => {
      const newEntities = new Map(state.entities)
      newEntities.delete(entityId)
      return { entities: newEntities }
    }),
  updateEntity: (entityId: string, updates: Partial<GameEntity>) =>
    set((state: GameState) => {
      const newEntities = new Map(state.entities)
      const entity = newEntities.get(entityId)
      if (entity) {
        newEntities.set(entityId, { ...entity, ...updates })
      }
      return { entities: newEntities }
    }),
  incrementResource: (type: ResourceType) =>
    set((state: GameState) => ({
      inventory: {
        ...state.inventory,
        [type]: state.inventory[type] + 1
      }
    }))
})) 