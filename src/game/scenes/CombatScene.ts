import * as Phaser from 'phaser';

export interface CombatSceneEvents {
  onWaveComplete: (waveNumber: number, rewards: any) => void;
  onGameOver: (score: number) => void;
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
    
    // Create player in center
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    
    // Create a simple circle for the player
    const graphics = this.add.graphics();
    graphics.fillStyle(0x00ff00);
    graphics.fillCircle(0, 0, 16);
    graphics.generateTexture('player', 32, 32);
    graphics.destroy();

    this.player = this.physics.add.sprite(centerX, centerY, 'player');
    this.player.setCollideWorldBounds(true);
    
    // Setup input handling
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.shootProjectile(pointer.x, pointer.y);
    });

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

  private shootProjectile(targetX: number, targetY: number) {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffff00);
    graphics.fillCircle(0, 0, 4);
    graphics.generateTexture('projectile', 8, 8);
    graphics.destroy();

    const projectile = this.physics.add.sprite(this.player.x, this.player.y, 'projectile');
    this.projectiles.add(projectile);

    // Calculate direction
    const angle = Phaser.Math.Angle.Between(
      this.player.x, this.player.y,
      targetX, targetY
    );

    // Set velocity
    const speed = 300;
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
    
    for (let i = 0; i < numEnemies; i++) {
      // Random position along the edges of the screen
      const edge = Math.floor(Math.random() * 4);
      let x, y;
      
      switch (edge) {
        case 0: // Top
          x = Math.random() * 1024;
          y = 50;
          break;
        case 1: // Right
          x = 974;
          y = Math.random() * 768;
          break;
        case 2: // Bottom
          x = Math.random() * 1024;
          y = 718;
          break;
        default: // Left
          x = 50;
          y = Math.random() * 768;
          break;
      }

      this.spawnEnemy(EnemyType.DOT, x, y);
    }
  }

  override update() {
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