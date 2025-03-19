export interface CombatStats {
  wave: number;
  enemiesRemaining: number;
  enemyHealth: number;
  enemyDamage: number;
  enemySpeed: number;
}

export interface PlayerStats {
  health: number;
  damage: number;
  shootingSpeed: number;
}

export interface CombatModeProps {
  onGameOver?: (score: number) => void;
}

export interface GameStatsProps {
  combatStats: CombatStats;
  playerStats: PlayerStats;
}

export interface GameControlsProps {
  isAutoShooting: boolean;
  shootingCooldown: number;
  onToggleAutoShoot: () => void;
  isGameOver: boolean;
}

export interface GameOverProps {
  wave: number;
  finalScore: number;
  onRetry: () => void;
} 