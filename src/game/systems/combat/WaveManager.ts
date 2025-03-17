import { CombatSceneEvents, EnemyType } from '@/game/scenes/combat/types';
import { WaveSystem, EnemySystem } from './types';

export class WaveManager implements WaveSystem {
  private events: CombatSceneEvents;
  private currentWave: number = 0;
  private readonly ARC_HEIGHT = 75;
  private readonly MIN_Y = 50;
  private readonly STAGGER_RANGE = 40;

  constructor(events: CombatSceneEvents) {
    this.events = events;
  }

  getCurrentWave(): number {
    return this.currentWave;
  }

  startNextWave(enemyManager: EnemySystem) {
    this.currentWave++;
    
    // Clear any remaining enemies
    enemyManager.destroy?.();

    // Spawn 3 enemies for wave 1, add 2 more for each subsequent wave
    const numEnemies = Math.min(3 + (this.currentWave - 1) * 2, 20);
    
    // Calculate arc parameters
    const screenWidth = 1024;
    const centerX = screenWidth / 2;
    const arcWidth = screenWidth * 0.8; // Use 80% of screen width for the arc
    const startX = centerX - arcWidth / 2;
    
    for (let i = 0; i < numEnemies; i++) {
      // Calculate position along the arc
      const progress = i / (numEnemies - 1);
      const x = startX + arcWidth * progress;
      
      // Calculate base Y position using a parabolic arc
      const normalizedX = (x - startX) / arcWidth - 0.5; // -0.5 to 0.5
      const baseY = this.MIN_Y + this.ARC_HEIGHT * (4 * normalizedX * normalizedX); // Parabola: 4x²
      
      // Add random stagger to Y position
      const staggerY = Phaser.Math.Between(-this.STAGGER_RANGE, this.STAGGER_RANGE);
      const y = baseY + staggerY;

      enemyManager.spawnEnemy(EnemyType.DOT, x, y);
    }

    // Update stats
    this.events.onStatsUpdate({
      wave: this.currentWave,
      enemiesRemaining: numEnemies,
      enemyHealth: 1,
      enemyDamage: 1,
      enemySpeed: 50,
    });
  }

  destroy() {
    // Nothing to clean up
  }
} 