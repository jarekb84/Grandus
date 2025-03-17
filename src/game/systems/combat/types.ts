export interface GameSystem {
  create?(): void;
  update?(time: number): void;
  destroy?(): void;
}

export interface EnemySystem extends GameSystem {
  hasEnemiesReachedBottom(): boolean;
  createEnemyTextures(): void;
  getEnemies(): Enemy[];
  spawnEnemy(type: EnemyType, x: number, y: number): void;
  updatePosition(playerPosition: { x: number; y: number }): void;
}

export interface WaveSystem extends GameSystem {
  getCurrentWave(): number;
  startNextWave(enemyManager: EnemySystem): void;
}

export interface PlayerSystem extends GameSystem {
  getPlayerPosition(): { x: number; y: number };
}

export interface ProjectileSystem extends GameSystem {
  create(): void;
  shootProjectile(from: { x: number; y: number }, to: { x: number; y: number }): void;
  checkCollisions(enemies: Enemy[]): void;
}

export interface CombatSystem extends GameSystem {
  setAutoShooting(enabled: boolean): void;
  update(time: number): void;
}

export interface Enemy {
  sprite: Phaser.Physics.Arcade.Sprite;
  health: number;
  type: string;
}

export enum EnemyType {
  DOT = 'DOT',
  LINE = 'LINE',
  TRIANGLE = 'TRIANGLE',
  SQUARE = 'SQUARE',
  PENTAGON = 'PENTAGON'
}

export interface CombatSceneEvents {
  onWaveComplete: (waveNumber: number, rewards: any) => void;
  onGameOver: (score: number) => void;
  onStatsUpdate: (stats: {
    wave: number;
    enemiesRemaining: number;
    enemyHealth: number;
    enemyDamage: number;
    enemySpeed: number;
  }) => void;
} 