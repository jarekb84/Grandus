import { PlayerSystem, ProjectileSystem, EnemySystem, CombatSystem as ICombatSystem } from './types';

export class CombatSystem implements ICombatSystem {
  private playerSystem: PlayerSystem;
  private projectileSystem: ProjectileSystem;
  private enemyManager: EnemySystem;
  private isAutoShooting: boolean = false;
  private nextShootTime: number = 0;
  private readonly SHOOT_INTERVAL = 1000;

  constructor(
    playerSystem: PlayerSystem,
    projectileSystem: ProjectileSystem,
    enemyManager: EnemySystem
  ) {
    this.playerSystem = playerSystem;
    this.projectileSystem = projectileSystem;
    this.enemyManager = enemyManager;
  }

  setAutoShooting(enabled: boolean) {
    this.isAutoShooting = enabled;
  }

  update(time: number) {
    // Handle automatic shooting
    if (this.isAutoShooting && time > this.nextShootTime) {
      const playerPos = this.playerSystem.getPlayerPosition();
      const enemies = this.enemyManager.getEnemies();
      
      if (enemies.length > 0) {
        // Find nearest enemy
        const nearestEnemy = enemies.reduce((nearest, current) => {
          const nearestDist = Phaser.Math.Distance.Between(
            playerPos.x, playerPos.y,
            nearest.sprite.x, nearest.sprite.y
          );
          const currentDist = Phaser.Math.Distance.Between(
            playerPos.x, playerPos.y,
            current.sprite.x, current.sprite.y
          );
          return currentDist < nearestDist ? current : nearest;
        });

        this.projectileSystem.shootProjectile(
          playerPos,
          { x: nearestEnemy.sprite.x, y: nearestEnemy.sprite.y }
        );
        this.nextShootTime = time + this.SHOOT_INTERVAL;
      }
    }

    // Update enemy positions
    this.enemyManager.updatePosition(this.playerSystem.getPlayerPosition());

    // Check for collisions
    this.projectileSystem.checkCollisions(this.enemyManager.getEnemies());
  }

  destroy() {
    // Nothing to clean up
  }
} 