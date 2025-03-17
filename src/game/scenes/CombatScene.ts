import * as Phaser from 'phaser';

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

interface Enemy {
  sprite: Phaser.Physics.Arcade.Sprite;
  health: number;
  type: string;
}

enum EnemyType {
  DOT = 'DOT',
  LINE = 'LINE',
  TRIANGLE = 'TRIANGLE',
  SQUARE = 'SQUARE',
  PENTAGON = 'PENTAGON'
}

export class CombatScene extends Phaser.Scene {
  private enemies: Enemy[] = [];
  private projectiles!: Phaser.GameObjects.Group;
  private player!: Phaser.Physics.Arcade.Sprite;
  private currentWave: number = 0;
  private sceneEvents: CombatSceneEvents;
  private readonly PLAYER_Y = 700; // Player's fixed Y position near bottom
  private readonly ENEMY_SPEED = 50; // Speed at which enemies move
  private readonly ARC_HEIGHT = 75; // Height of the spawning arc
  private readonly MIN_Y = 50; // Minimum Y position for enemies
  private readonly STAGGER_RANGE = 40; // Range for random Y offset
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
    
    this.projectiles = this.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      runChildUpdate: true
    });
    
    // Create player at the bottom center
    const centerX = this.cameras.main.centerX;
    
    // Create a simple circle for the player
    const graphics = this.add.graphics();
    graphics.fillStyle(0x00ff00);
    graphics.fillCircle(0, 0, 16);
    graphics.generateTexture('player', 32, 32);
    graphics.destroy();

    this.player = this.physics.add.sprite(centerX, this.PLAYER_Y, 'player');
    
    // Create enemy textures
    this.createEnemyTextures();

    // Start first wave
    this.startNextWave();
  }

  private createEnemyTextures() {
    // Create dot enemy texture
    const dotGraphics = this.add.graphics();
    dotGraphics.fillStyle(0xff0000);
    dotGraphics.fillCircle(0, 0, 8);
    dotGraphics.generateTexture('enemy_dot', 16, 16);
    dotGraphics.destroy();
  }

  private findNearestEnemy(): Enemy | null {
    if (this.enemies.length === 0) return null;

    return this.enemies.reduce((nearest, current) => {
      const nearestDist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        nearest.sprite.x, nearest.sprite.y
      );
      const currentDist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        current.sprite.x, current.sprite.y
      );
      return currentDist < nearestDist ? current : nearest;
    });
  }

  private shootProjectile(targetX: number, targetY: number) {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffff00);
    graphics.fillCircle(0, 0, 4);
    graphics.generateTexture('projectile', 8, 8);
    graphics.destroy();

    const projectile = this.physics.add.sprite(this.player.x, this.player.y, 'projectile');
    this.projectiles.add(projectile);

    // Calculate direction to target
    const angle = Phaser.Math.Angle.Between(
      this.player.x, this.player.y,
      targetX, targetY
    );

    // Set velocity directly towards click position
    const speed = 400;
    this.physics.velocityFromRotation(angle, speed, projectile.body.velocity);

    // Destroy projectile after 2 seconds if it hasn't hit anything
    this.time.delayedCall(2000, () => {
      projectile.destroy();
    });
  }

  private startNextWave() {
    this.currentWave++;
    
    // Clear any remaining enemies
    this.enemies.forEach(enemy => enemy.sprite.destroy());
    this.enemies = [];

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

      this.spawnEnemy(EnemyType.DOT, x, y);
    }

    // Set initial velocities for enemies to move towards player
    this.enemies.forEach(enemy => {
      const angle = Phaser.Math.Angle.Between(
        enemy.sprite.x, enemy.sprite.y,
        this.player.x, this.player.y
      );
      const sprite = enemy.sprite as Phaser.Physics.Arcade.Sprite;
      if (sprite.body) {
        this.physics.velocityFromRotation(angle, this.ENEMY_SPEED, sprite.body.velocity);
      }
    });

    // Update stats
    this.updateStats();
  }

  private updateStats() {
    this.sceneEvents.onStatsUpdate({
      wave: this.currentWave,
      enemiesRemaining: this.enemies.length,
      enemyHealth: 1, // For now, all enemies have 1 health
      enemyDamage: 1, // For now, all enemies do 1 damage
      enemySpeed: this.ENEMY_SPEED,
    });
  }

  override update(time: number) {
    // Handle automatic shooting
    if (this.isAutoShooting && time > this.nextShootTime) {
      const nearestEnemy = this.findNearestEnemy();
      if (nearestEnemy) {
        this.shootProjectile(nearestEnemy.sprite.x, nearestEnemy.sprite.y);
        this.nextShootTime = time + this.SHOOT_INTERVAL;
      }
    }

    // Update enemy positions and movement
    this.enemies.forEach(enemy => {
      // Update enemy velocity to track player
      const angle = Phaser.Math.Angle.Between(
        enemy.sprite.x, enemy.sprite.y,
        this.player.x, this.player.y
      );
      
      const sprite = enemy.sprite as Phaser.Physics.Arcade.Sprite;
      if (sprite.body) {
        // Gradually adjust velocity towards player
        const currentVelocity = sprite.body.velocity;
        const targetVelocity = new Phaser.Math.Vector2();
        this.physics.velocityFromRotation(angle, this.ENEMY_SPEED, targetVelocity);
        
        // Lerp between current and target velocity for smoother movement
        const lerpFactor = 0.05;
        currentVelocity.x = Phaser.Math.Linear(currentVelocity.x, targetVelocity.x, lerpFactor);
        currentVelocity.y = Phaser.Math.Linear(currentVelocity.y, targetVelocity.y, lerpFactor);
      }

      // Check if enemy has reached the player's level
      if (enemy.sprite.y >= this.PLAYER_Y - 32) {
        // Game over when enemies reach the bottom
        this.sceneEvents.onGameOver(this.currentWave);
        this.scene.restart();
      }
    });

    // Check for collisions between projectiles and enemies
    this.projectiles.getChildren().forEach((gameObject: Phaser.GameObjects.GameObject) => {
      const projectile = gameObject as Phaser.Physics.Arcade.Sprite;
      this.enemies.forEach((enemy, index) => {
        if (Phaser.Geom.Intersects.RectangleToRectangle(
          projectile.getBounds(),
          enemy.sprite.getBounds()
        )) {
          // Destroy projectile
          projectile.destroy();

          // Damage enemy
          enemy.health--;
          if (enemy.health <= 0) {
            enemy.sprite.destroy();
            this.enemies.splice(index, 1);
            // Update stats when enemy is destroyed
            this.updateStats();
          }
        }
      });
    });

    // Check if wave is complete
    if (this.enemies.length === 0) {
      this.sceneEvents.onWaveComplete(this.currentWave, {
        coins: this.currentWave * 10
      });
      this.startNextWave();
    }
  }

  private spawnEnemy(type: string, x: number, y: number) {
    const sprite = this.physics.add.sprite(x, y, 'enemy_dot');
    const enemy: Enemy = {
      sprite,
      health: 1, // For now, all enemies have 1 health
      type
    };
    this.enemies.push(enemy);
  }
} 