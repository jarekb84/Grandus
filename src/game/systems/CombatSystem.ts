import * as Phaser from 'phaser';
import { EnemySystem, Enemy } from './EnemySystem';
import { ProjectileSystem } from './ProjectileSystem';
import { ResourceType } from '../entities.types';
import { useResourcesStore } from '@/stores/resources/resourcesStore';
import { useCurrencyStore } from '@/stores/currency/currencyStore';
import { PlayerSystem } from './PlayerSystem';
import { WaveSystem } from './WaveSystem';

export interface CombatEvents {
  onAmmoChanged: (ammo: number) => void;
  onOutOfAmmo: () => void;
}

export class CombatSystem {
  private scene: Phaser.Scene;
  private enemySystem: EnemySystem;
  private projectileSystem: ProjectileSystem;
  private playerSystem: PlayerSystem;
  private waveSystem: WaveSystem;
  private events: CombatEvents;
  
  private readonly SHOOT_INTERVAL = 1000; // Shoot every 1000ms (1 second)
  private nextShootTime: number = 0;
  private isAutoShooting: boolean = false;
  private resourcesStore = useResourcesStore;
  
  constructor(
    scene: Phaser.Scene, 
    enemySystem: EnemySystem, 
    projectileSystem: ProjectileSystem,
    playerSystem: PlayerSystem,
    waveSystem: WaveSystem,
    events: CombatEvents
  ) {
    this.scene = scene;
    this.enemySystem = enemySystem;
    this.projectileSystem = projectileSystem;
    this.playerSystem = playerSystem;
    this.waveSystem = waveSystem;
    this.events = events;
  }
  
  setAutoShooting(enabled: boolean): void {
    this.isAutoShooting = enabled;
  }
  
  isAutoShootingEnabled(): boolean {
    return this.isAutoShooting;
  }
  
  update(time: number): boolean {
    const player = this.playerSystem.getPlayer();
    
    // Handle automatic shooting
    if (this.isAutoShooting && time > this.nextShootTime) {
      const nearestEnemy = this.enemySystem.findNearestEnemy(player.x, player.y);
      // Check if we have stones available to shoot
      const hasStones = this.resourcesStore.getState().hasResource(ResourceType.STONE, 1);
      
      if (nearestEnemy && hasStones) {
        // Consume a stone when shooting
        this.resourcesStore.getState().removeResource(ResourceType.STONE, 1);
        
        this.projectileSystem.shootProjectile(
          player.x, player.y, 
          nearestEnemy.sprite.x, nearestEnemy.sprite.y
        );
        this.nextShootTime = time + this.SHOOT_INTERVAL;
        
        // Notify listeners about ammo change
        this.events.onAmmoChanged(this.resourcesStore.getState().getResource(ResourceType.STONE));
      } else if (!hasStones) {
        // No stones left - notify listeners and stop shooting
        this.events.onAmmoChanged(0);
        this.events.onOutOfAmmo();
      }
    }

    // Update enemy positions and movement
    this.enemySystem.updateEnemyMovement(player.x, player.y);

    // Check if any enemies have reached the player
    const enemies = this.enemySystem.getEnemies();
    const playerY = player.y;
    let playerDied = false;
    
    for (const enemy of enemies) {
      if (enemy.sprite.y >= playerY - 32) {
        // Apply damage to player when enemy reaches them
        const enemyDamage = 10; // Each enemy does 10 damage
        playerDied = this.playerSystem.updatePlayerHealth(enemyDamage);
        
        // Remove the enemy that hit the player
        this.enemySystem.removeEnemy(enemy);
        
        // Update stats after enemy is removed
        this.waveSystem.updateStats();
        
        if (playerDied) {
          return true; // Game over
        }
      }
    }

    // Check for collisions between projectiles and enemies
    this.projectileSystem.checkCollisions(enemies, (enemy, projectile) => {
      // Damage enemy
      const destroyed = this.enemySystem.damageEnemy(enemy);
      if (destroyed) {
        // Show floating cash text at enemy position
        this.waveSystem.createCashFloatingText(enemy.sprite.x, enemy.sprite.y, 1);
        
        // Add cash when enemy is destroyed ($1 per kill)
        useCurrencyStore.getState().addCash(1);
        // Update stats when enemy is destroyed
        this.waveSystem.updateStats();
      }
    });
    
    return false; // Game continues
  }
} 