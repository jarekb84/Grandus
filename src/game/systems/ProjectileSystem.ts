import * as Phaser from 'phaser';
import { Enemy } from './EnemySystem';

export class ProjectileSystem {
  private scene: Phaser.Scene;
  private physics: Phaser.Physics.Arcade.ArcadePhysics;
  private projectiles: Phaser.GameObjects.Group;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.physics = scene.physics;
    
    this.projectiles = this.scene.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      runChildUpdate: true
    });
    
    this.createProjectileTextures();
  }
  
  private createProjectileTextures() {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xffff00);
    graphics.fillCircle(0, 0, 4);
    graphics.generateTexture('projectile', 8, 8);
    graphics.destroy();
  }
  
  shootProjectile(sourceX: number, sourceY: number, targetX: number, targetY: number) {
    const projectile = this.physics.add.sprite(sourceX, sourceY, 'projectile');
    this.projectiles.add(projectile);

    // Calculate direction to target
    const angle = Phaser.Math.Angle.Between(
      sourceX, sourceY,
      targetX, targetY
    );

    // Set velocity directly towards click position
    const speed = 400;
    this.physics.velocityFromRotation(angle, speed, projectile.body.velocity);

    // Destroy projectile after 2 seconds if it hasn't hit anything
    this.scene.time.delayedCall(2000, () => {
      projectile.destroy();
    });
    
    return projectile;
  }
  
  checkCollisions(enemies: Enemy[], onEnemyHit: (enemy: Enemy, projectile: Phaser.Physics.Arcade.Sprite) => void) {
    this.projectiles.getChildren().forEach((gameObject: Phaser.GameObjects.GameObject) => {
      const projectile = gameObject as Phaser.Physics.Arcade.Sprite;
      enemies.forEach(enemy => {
        if (Phaser.Geom.Intersects.RectangleToRectangle(
          projectile.getBounds(),
          enemy.sprite.getBounds()
        )) {
          // Destroy projectile
          projectile.destroy();
          
          // Call the hit callback
          onEnemyHit(enemy, projectile);
        }
      });
    });
  }
  
  getProjectiles(): Phaser.GameObjects.Group {
    return this.projectiles;
  }
} 