import * as Phaser from 'phaser';
import { EnemySystem } from '@/features/combat/Enemy';

export interface WaveRewards {
  coins: number;
}

export interface WaveEvents {
  onWaveComplete: (waveNumber: number, rewards: WaveRewards) => void;
  onStatsUpdate: (stats: {
    wave: number;
    enemiesRemaining: number;
    enemyHealth: number;
    enemyDamage: number;
    enemySpeed: number;
  }) => void;
}

export class WaveSystem {
  private scene: Phaser.Scene;
  private enemySystem: EnemySystem;
  private currentWave: number = 0;
  private events: WaveEvents;
  
  constructor(scene: Phaser.Scene, enemySystem: EnemySystem, events: WaveEvents) {
    this.scene = scene;
    this.enemySystem = enemySystem;
    this.events = events;
  }
  
  getCurrentWave(): number {
    return this.currentWave;
  }
  
  resetWaves(): void {
    this.currentWave = 0;
  }
  
  startNextWave(playerX: number, playerY: number): void {
    this.currentWave++;
    
    // Spawn wave enemies
    this.enemySystem.spawnWaveEnemies(this.currentWave, this.scene.cameras.main.width);

    // Set initial velocities for enemies to move towards player
    this.enemySystem.setInitialVelocities(playerX, playerY);

    // Update stats
    this.updateStats();
  }
  
  isWaveComplete(): boolean {
    return this.enemySystem.getEnemies().length === 0;
  }
  
  completeWave(): void {
    this.events.onWaveComplete(this.currentWave, {
      coins: this.currentWave * 10
    });
  }
  
  updateStats(): void {
    const enemies = this.enemySystem.getEnemies();
    this.events.onStatsUpdate({
      wave: this.currentWave,
      enemiesRemaining: enemies.length,
      enemyHealth: 1, // For now, all enemies have 1 health
      enemyDamage: 1, // For now, all enemies do 1 damage
      enemySpeed: 50, // Static for now
    });
  }
  
  // Create a floating text that shows the cash earned
  createCashFloatingText(x: number, y: number, amount: number): void {
    // Create text object with improved styling
    const text = this.scene.add.text(x, y, `$${amount}`, {
      fontFamily: 'monospace', // More game-like font
      fontSize: '14px', // Smaller size
      color: '#7FFF7F', // Softer green
      stroke: '#000000',
      strokeThickness: 1.5
    });
    text.setOrigin(0.5);
    
    // More dynamic animation
    this.scene.tweens.add({
      targets: text,
      y: y - 35, // Float up a bit less
      alpha: 0, // Fade out
      scale: 0.8, // Slightly shrink
      duration: 800, // Faster animation
      ease: 'Sine.Out',
      onComplete: () => {
        text.destroy(); // Remove when animation completes
      }
    });
  }
} 