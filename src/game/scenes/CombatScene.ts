import * as Phaser from 'phaser';

export interface CombatSceneEvents {
  onWaveComplete: (waveNumber: number, rewards: any) => void;
  onGameOver: (score: number) => void;
}

interface Enemy {
  sprite: Phaser.GameObjects.Sprite;
  health: number;
  type: string;
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

    // Start first wave
    this.startNextWave();
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
  }

  private startNextWave() {
    this.currentWave++;
    // TODO: Implement wave spawning logic based on currentWave
    // This will use the geometric progression described in the gameplan
  }

  override update() {
    // TODO: Implement collision detection between projectiles and enemies
    // TODO: Update enemy movement patterns
    // TODO: Check for wave completion
  }

  private spawnEnemy(type: string, x: number, y: number) {
    // TODO: Implement enemy spawning with different geometric shapes
    // based on the type parameter
  }
} 