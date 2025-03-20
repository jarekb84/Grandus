import { create } from 'zustand';
import { useResourcesStore } from '@/features/shared/stores/Resources.store';
import { ResourceType } from '@/features/shared/types/entities';

interface CombatState {
  wave: number;
  enemiesRemaining: number;
  enemyHealth: number;
  enemyDamage: number;
  enemySpeed: number;
  ammo: number;
  playerHealth: number;
  isGameOver: boolean;
  finalScore: number;
  isAutoShooting: boolean;
  shootingCooldown: number;
  outOfAmmo: boolean;
  setCombatStats: (stats: Partial<CombatState>) => void;
  resetCombat: () => void;
  setIsAutoShooting: (isAutoShooting: boolean) => void;
  setShootingCooldown: (shootingCooldown: number) => void;
  setIsGameOver: (isGameOver: boolean) => void;
  setFinalScore: (finalScore: number) => void;
  setOutOfAmmo: (outOfAmmo: boolean) => void;
  setAmmo: (ammo: number) => void;
  setPlayerHealth: (playerHealth: number) => void;
}

export const useCombatStore = create<CombatState>((set) => ({
  wave: 0,
  enemiesRemaining: 0,
  enemyHealth: 0,
  enemyDamage: 0,
  enemySpeed: 0,
  ammo: useResourcesStore.getState().getResource(ResourceType.STONE), // Initialize ammo from ResourcesStore
  playerHealth: 100,
  isGameOver: false,
  finalScore: 0,
  isAutoShooting: false,
  shootingCooldown: 0,
  outOfAmmo: false,
  setCombatStats: (stats) => set((state) => {
     const updatedStats = { ...state, ...stats };
     return updatedStats;
  }),
  resetCombat: () => set({
    wave: 0,
    enemiesRemaining: 0,
    enemyHealth: 0,
    enemyDamage: 0,
    enemySpeed: 0,
    ammo: useResourcesStore.getState().getResource(ResourceType.STONE), // Initialize ammo from ResourcesStore
    playerHealth: 100,
    isGameOver: false,
    finalScore: 0,
    isAutoShooting: false,
    shootingCooldown: 0,
    outOfAmmo: false,
  }),
  setIsAutoShooting: (isAutoShooting) => set({ isAutoShooting }),
  setShootingCooldown: (shootingCooldown) => set({ shootingCooldown }),
  setIsGameOver: (isGameOver) => set({ isGameOver }),
  setFinalScore: (finalScore) => set({ finalScore }),
  setOutOfAmmo: (outOfAmmo) => set({ outOfAmmo }),
  setAmmo: (ammo) => set({ ammo }),
  setPlayerHealth: (playerHealth) => set({ playerHealth }),
}));