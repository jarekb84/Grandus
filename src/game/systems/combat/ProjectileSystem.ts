import * as Phaser from 'phaser';
import { Enemy } from '@/game/scenes/combat/types';

export class ProjectileSystem {
  private scene: Phaser.Scene;
  private projectiles!: Phaser.GameObjects.Group;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    this.projectiles = this.scene.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      runChildUpdate: true
    });
  }

  shootProjectile(from: { x: number; y: number }, to: { x: number; y: number }) {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xffff00);
    graphics.fillCircle(0, 0, 4);
    graphics.generateTexture('projectile', 8, 8);
    graphics.destroy();

    const projectile = this.scene.physics.add.sprite(from.x, from.y, 'projectile');
    this.projectiles.add(projectile);

    // Calculate direction to target
    const angle = Phaser.Math.Angle.Between(
      from.x, from.y,
      to.x, to.y
    );

    // Set velocity directly towards target position
    const speed = 400;
    this.scene.physics.velocityFromRotation(angle, speed, projectile.body.velocity);

    // Destroy projectile after 2 seconds if it hasn't hit anything
    this.scene.time.delayedCall(2000, () => {
      projectile.destroy();
    });
  }

  checkCollisions(enemies: Enemy[]) {
    this.projectiles.getChildren().forEach((gameObject: Phaser.GameObjects.GameObject) => {
      const projectile = gameObject as Phaser.Physics.Arcade.Sprite;
      enemies.forEach((enemy, index) => {
        if (Phaser.Geom.Intersects.RectangleToRectangle(
          projectile.getBounds(),
          enemy.sprite.getBounds()
        )) {
          projectile.destroy();
          enemy.health--;
          if (enemy.health <= 0) {
            enemy.sprite.destroy();
            enemies.splice(index, 1);
          }
        }
      });
    });
  }
} 