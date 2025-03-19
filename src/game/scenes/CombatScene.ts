import * as Phaser from 'phaser';
import { EnemySystem, Enemy } from '../systems/EnemySystem';
import { ProjectileSystem } from '../systems/ProjectileSystem';
import { useCurrencyStore } from '@/stores/currency/currencyStore';
import { useResourcesStore } from '@/stores/resources/resourcesStore';
import { ResourceType } from '../entities.types';

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
  onAmmoChanged: (ammo: number) => void;
  onOutOfAmmo: () => void;
  onPlayerHealthChanged: (health: number) => void;
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
  private isGameOver: boolean = false; // Track game over state
  private resourcesStore = useResourcesStore; // Add ResourcesStore reference
  private playerHealth: number = 100; // Add player health

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
    // Reset game over state when scene is created
    this.isGameOver = false;
    // Reset wave counter to restart from wave 1
    this.currentWave = 0;
    // Reset player health
    this.playerHealth = 100;
    
    // Initialize physics
    this.physics.world.setBounds(0, 0, 1024, 768);
    
    // Ensure physics is running
    this.physics.resume();
    
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
    
    // Notify listeners about initial player health
    this.sceneEvents.onPlayerHealthChanged(this.playerHealth);
    
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

  // Create a floating text that shows the cash earned
  private createCashFloatingText(x: number, y: number, amount: number) {
    // Create text object with improved styling
    const text = this.add.text(x, y, `$${amount}`, {
      fontFamily: 'monospace', // More game-like font
      fontSize: '14px', // Smaller size
      color: '#7FFF7F', // Softer green
      stroke: '#000000',
      strokeThickness: 1.5
    });
    text.setOrigin(0.5);
    
    // More dynamic animation
    this.tweens.add({
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

  override update(time: number) {
    // Skip all updates if game is over
    if (this.isGameOver) return;

    // Handle automatic shooting
    if (this.isAutoShooting && time > this.nextShootTime) {
      const nearestEnemy = this.enemySystem.findNearestEnemy(this.player.x, this.player.y);
      // Check if we have stones available to shoot
      const hasStones = this.resourcesStore.getState().hasResource(ResourceType.STONE, 1);
      
      if (nearestEnemy && hasStones) {
        // Consume a stone when shooting
        this.resourcesStore.getState().removeResource(ResourceType.STONE, 1);
        
        this.projectileSystem.shootProjectile(
          this.player.x, this.player.y, 
          nearestEnemy.sprite.x, nearestEnemy.sprite.y
        );
        this.nextShootTime = time + this.SHOOT_INTERVAL;
        
        // Notify listeners about ammo change
        this.sceneEvents.onAmmoChanged(this.resourcesStore.getState().getResource(ResourceType.STONE));
      } else if (!hasStones) {
        // No stones left - notify listeners and stop shooting
        this.sceneEvents.onAmmoChanged(0);
        this.sceneEvents.onOutOfAmmo();
      }
    }

    // Update enemy positions and movement
    this.enemySystem.updateEnemyMovement(this.player.x, this.player.y);
    
    // Check if any enemies have reached the player's level
    const enemies = this.enemySystem.getEnemies();
    for (const enemy of enemies) {
      if (enemy.sprite.y >= this.PLAYER_Y - 32) {
        // Apply damage to player when enemy reaches them
        const enemyDamage = 10; // Each enemy does 10 damage
        this.updatePlayerHealth(enemyDamage);
        
        // Remove the enemy that hit the player
        this.enemySystem.removeEnemy(enemy);
        
        // Update stats after enemy is removed
        this.updateStats();
      }
    }

    // Check for collisions between projectiles and enemies
    this.projectileSystem.checkCollisions(enemies, (enemy, projectile) => {
      // Damage enemy
      const destroyed = this.enemySystem.damageEnemy(enemy);
      if (destroyed) {
        // Show floating cash text at enemy position
        this.createCashFloatingText(enemy.sprite.x, enemy.sprite.y, 1);
        
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

  // Update the player's health
  private updatePlayerHealth(damage: number) {
    this.playerHealth -= damage;
    
    // Notify listeners about health change
    this.sceneEvents.onPlayerHealthChanged(this.playerHealth);
    
    // Visual effect when player takes damage
    this.showDamageEffect(damage);
    
    // Check if player is dead
    if (this.playerHealth <= 0) {
      this.handlePlayerDeath();
    }
  }
  
  // Visual effect when player takes damage
  private showDamageEffect(damage: number) {
    // Flash the player red
    this.player.setTint(0xff0000);
    
    // Create a damage number floating up
    this.createDamageText(this.player.x, this.player.y - 20, damage);
    
    // Shake the camera slightly
    this.cameras.main.shake(100, 0.01);
    
    // Reset tint after a short delay
    this.time.delayedCall(200, () => {
      this.player.clearTint();
    });
  }
  
  // Create floating damage text
  private createDamageText(x: number, y: number, amount: number) {
    const text = this.add.text(x, y, `-${amount}`, {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 2
    });
    text.setOrigin(0.5);
    
    this.tweens.add({
      targets: text,
      y: y - 30,
      alpha: 0,
      scale: 1.5,
      duration: 800,
      ease: 'Cubic.Out',
      onComplete: () => {
        text.destroy();
      }
    });
  }
  
  // Handle player death
  private handlePlayerDeath() {
    // Game over when player health reaches 0
    this.isGameOver = true;
    this.setAutoShooting(false);
    
    // Freeze all enemies and projectiles
    this.physics.pause();
    
    // Notify game over
    this.sceneEvents.onGameOver(this.currentWave);
  }
} 