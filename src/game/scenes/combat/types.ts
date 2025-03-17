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

export interface CombatSceneEvents {
  onWaveComplete: (waveNumber: number, rewards: any) => void;
  onGameOver: (score: number) => void;
  onStatsUpdate: (stats: CombatStats) => void;
}

export enum EnemyType {
  DOT = 'DOT',
  LINE = 'LINE',
  TRIANGLE = 'TRIANGLE',
  SQUARE = 'SQUARE',
  PENTAGON = 'PENTAGON'
}

export interface Enemy {
  sprite: Phaser.Physics.Arcade.Sprite;
  health: number;
  type: EnemyType;
} 