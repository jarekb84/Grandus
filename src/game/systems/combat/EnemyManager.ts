import * as Phaser from 'phaser';
import { Enemy, EnemyType, CombatSceneEvents } from '@/game/scenes/combat/types';
import { EnemySystem } from './types';

export class EnemyManager implements EnemySystem {
  private scene: Phaser.Scene;
  private events: CombatSceneEvents;
  private enemies: Enemy[] = [];
  private readonly PLAYER_Y = 700;
  private readonly ENEMY_SPEED = 50;

  constructor(scene: Phaser.Scene, events: CombatSceneEvents) {
    this.scene = scene;
    this.events = events;
  }

  hasEnemiesReachedBottom(): boolean {
    return this.enemies.some(enemy => enemy.sprite.y >= this.PLAYER_Y - 32);
  }

  createEnemyTextures() {
    // Create dot enemy texture
    const dotGraphics = this.scene.add.graphics();
    dotGraphics.fillStyle(0xff0000);
    dotGraphics.fillCircle(0, 0, 8);
    dotGraphics.generateTexture('enemy_dot', 16, 16);
    dotGraphics.destroy();
  }

  getEnemies(): Enemy[] {
    return this.enemies;
  }

  spawnEnemy(type: EnemyType, x: number, y: number) {
    const sprite = this.scene.physics.add.sprite(x, y, 'enemy_dot');
    const enemy: Enemy = {
      sprite,
      health: 1,
      type: type
    };
    this.enemies.push(enemy);
    return enemy;
  }

  update(time: number) {
    // This is called by the scene's update loop
  }

  updatePosition(playerPosition: { x: number; y: number }) {
    this.enemies.forEach(enemy => {
      // Update enemy velocity to track player
      const angle = Phaser.Math.Angle.Between(
        enemy.sprite.x, enemy.sprite.y,
        playerPosition.x, playerPosition.y
      );
      
      const sprite = enemy.sprite as Phaser.Physics.Arcade.Sprite;
      if (sprite.body) {
        // Gradually adjust velocity towards player
        const currentVelocity = sprite.body.velocity;
        const targetVelocity = new Phaser.Math.Vector2();
        this.scene.physics.velocityFromRotation(angle, this.ENEMY_SPEED, targetVelocity);
        
        // Lerp between current and target velocity for smoother movement
        const lerpFactor = 0.05;
        currentVelocity.x = Phaser.Math.Linear(currentVelocity.x, targetVelocity.x, lerpFactor);
        currentVelocity.y = Phaser.Math.Linear(currentVelocity.y, targetVelocity.y, lerpFactor);
      }
    });
  }

  destroy() {
    this.enemies.forEach(enemy => enemy.sprite.destroy());
    this.enemies = [];
  }
} 