import * as Phaser from 'phaser';
import { EnemySystem, Enemy } from '../systems/EnemySystem';
import { ProjectileSystem } from '../systems/ProjectileSystem';
import { useCurrencyStore } from '@/stores/currency/currencyStore';

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

export class CombatScene extends Phaser.Scene {
  private enemySystem!: EnemySystem;
  private projectileSystem!: ProjectileSystem;
  private player!: Phaser.Physics.Arcade.Sprite;
  private currentWave: number = 0;
  private sceneEvents: CombatSceneEvents;
  private readonly PLAYER_Y = 700; // Player's fixed Y position near bottom
  private readonly SHOOT_INTERVAL = 1000; // Shoot every 1000ms (1 second)
  private nextShootTime: number = 0;
  private isAutoShooting: boolean = false;

  constructor(events: CombatSceneEvents) {
    super({ 
      key: 'CombatScene',
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      }
    });
    this.sceneEvents = events;
  }

  setAutoShooting(enabled: boolean) {
    this.isAutoShooting = enabled;
  }

  preload() {
    // We'll create textures in create() instead, similar to MainScene
  }

  create() {
    // Initialize physics
    this.physics.world.setBounds(0, 0, 1024, 768);
    
    // Initialize systems
    this.enemySystem = new EnemySystem(this);
    this.projectileSystem = new ProjectileSystem(this);
    
    // Create player at the bottom center
    const centerX = this.cameras.main.centerX;
    
    // Create a simple circle for the player
    const graphics = this.add.graphics();
    graphics.fillStyle(0x00ff00);
    graphics.fillCircle(0, 0, 16);
    graphics.generateTexture('player', 32, 32);
    graphics.destroy();

    this.player = this.physics.add.sprite(centerX, this.PLAYER_Y, 'player');
    
    // Start first wave
    this.startNextWave();
  }

  private startNextWave() {
    this.currentWave++;
    
    // Spawn wave enemies
    this.enemySystem.spawnWaveEnemies(this.currentWave, 1024);

    // Set initial velocities for enemies to move towards player
    this.enemySystem.setInitialVelocities(this.player.x, this.player.y);

    // Update stats
    this.updateStats();
  }

  private updateStats() {
    const enemies = this.enemySystem.getEnemies();
    this.sceneEvents.onStatsUpdate({
      wave: this.currentWave,
      enemiesRemaining: enemies.length,
      enemyHealth: 1, // For now, all enemies have 1 health
      enemyDamage: 1, // For now, all enemies do 1 damage
      enemySpeed: 50, // Static for now
    });
  }

  override update(time: number) {
    // Handle automatic shooting
    if (this.isAutoShooting && time > this.nextShootTime) {
      const nearestEnemy = this.enemySystem.findNearestEnemy(this.player.x, this.player.y);
      if (nearestEnemy) {
        this.projectileSystem.shootProjectile(
          this.player.x, this.player.y, 
          nearestEnemy.sprite.x, nearestEnemy.sprite.y
        );
        this.nextShootTime = time + this.SHOOT_INTERVAL;
      }
    }

    // Update enemy positions and movement
    this.enemySystem.updateEnemyMovement(this.player.x, this.player.y);
    
    // Check if any enemies have reached the player's level
    const enemies = this.enemySystem.getEnemies();
    for (const enemy of enemies) {
      if (enemy.sprite.y >= this.PLAYER_Y - 32) {
        // Game over when enemies reach the bottom
        this.sceneEvents.onGameOver(this.currentWave);
        this.scene.restart();
        return;
      }
    }

    // Check for collisions between projectiles and enemies
    this.projectileSystem.checkCollisions(enemies, (enemy, projectile) => {
      // Damage enemy
      const destroyed = this.enemySystem.damageEnemy(enemy);
      if (destroyed) {
        // Add cash when enemy is destroyed ($1 per kill)
        useCurrencyStore.getState().addCash(1);
        // Update stats when enemy is destroyed
        this.updateStats();
      }
    });

    // Check if wave is complete
    if (enemies.length === 0) {
      this.sceneEvents.onWaveComplete(this.currentWave, {
        coins: this.currentWave * 10
      });
      this.startNextWave();
    }
  }
} 