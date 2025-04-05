import { create } from "zustand";

interface CombatStats {
  playerHealth: number;
  wave: number;
  enemiesRemaining: number;
  enemyHealth: number;
  enemyDamage: number;
  enemySpeed: number;
  ammo: number;
  cash: number;
  killCount: number;
}

interface CombatState {
  stats: CombatStats;
  isGameOver: boolean;
  isWaveComplete: boolean;
  isAutoShooting: boolean;

  updateStats: (updates: Partial<CombatStats>) => void;
  setGameOver: (isOver: boolean) => void;
  setWaveComplete: (isComplete: boolean) => void;
  setAutoShooting: (enabled: boolean) => void;
  resetState: () => void;
}

const initialStats: CombatStats = {
  playerHealth: 100,
  wave: 1,
  enemiesRemaining: 0,
  enemyHealth: 1,
  enemyDamage: 10,
  enemySpeed: 50,
  ammo: 0,
  cash: 0,
  killCount: 0,
};

export const useCombatStore = create<CombatState>((set) => ({
  stats: { ...initialStats },
  isGameOver: false,
  isWaveComplete: false,
  isAutoShooting: false,

  updateStats: (updates: Partial<CombatStats>): void => {
    set((state) => ({
      ...state,
      stats: {
        ...state.stats,
        ...updates,
      },
    }));
  },

  setGameOver: (isOver: boolean): void => {
    set((state) => ({
      ...state,
      isGameOver: isOver,
    }));
  },

  setWaveComplete: (isComplete: boolean): void => {
    set((state) => ({
      ...state,
      isWaveComplete: isComplete,
    }));
  },

  setAutoShooting: (enabled: boolean): void => {
    set((state) => ({
      ...state,
      isAutoShooting: enabled,
    }));
  },

  resetState: (): void => {
    set((state) => ({
      ...state,
      stats: { ...initialStats },
      isGameOver: false,
      isWaveComplete: false,
    }));
  },
}));
