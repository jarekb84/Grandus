import * as Phaser from 'phaser';

export enum EnemyType {
  DOT = 'DOT',
  LINE = 'LINE',
  TRIANGLE = 'TRIANGLE',
  SQUARE = 'SQUARE',
  PENTAGON = 'PENTAGON'
}

export interface Enemy {
  sprite: Phaser.Physics.Arcade.Sprite;
  health: number;
  type: string;
}

export class EnemySystem {
  private scene: Phaser.Scene;
  private physics: Phaser.Physics.Arcade.ArcadePhysics;
  private enemies: Enemy[] = [];
  
  // Configuration
  private readonly ENEMY_SPEED = 50;
  private readonly ARC_HEIGHT = 75;
  private readonly MIN_Y = 50;
  private readonly STAGGER_RANGE = 40;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.physics = scene.physics;
    this.createEnemyTextures();
  }
  
  private createEnemyTextures() {
    // Create dot enemy texture - use a cleaner circle without a box
    const dotGraphics = this.scene.add.graphics();
    
    // Clear fill to ensure no background rectangle
    dotGraphics.clear();
    
    // Draw a filled circle with a subtle border
    dotGraphics.fillStyle(0xff0000);
    dotGraphics.fillCircle(8, 8, 6);
    
    // Add a slight glow effect
    dotGraphics.lineStyle(1, 0xff3333, 0.8);
    dotGraphics.strokeCircle(8, 8, 7);
    
    // Generate texture and clean up
    dotGraphics.generateTexture('enemy_dot', 16, 16);
    dotGraphics.destroy();
  }
  
  spawnEnemy(type: string, x: number, y: number): Enemy {
    const sprite = this.physics.add.sprite(x, y, 'enemy_dot');
    const enemy: Enemy = {
      sprite,
      health: 1, // For now, all enemies have 1 health
      type
    };
    this.enemies.push(enemy);
    return enemy;
  }
  
  spawnWaveEnemies(waveNumber: number, screenWidth: number) {
    // Clear any remaining enemies
    this.enemies.forEach(enemy => enemy.sprite.destroy());
    this.enemies = [];
    
    // Spawn 3 enemies for wave 1, add 2 more for each subsequent wave
    const numEnemies = Math.min(3 + (waveNumber - 1) * 2, 20);
    
    // Calculate arc parameters
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
    
    return this.enemies;
  }
  
  updateEnemyMovement(playerX: number, playerY: number) {
    this.enemies.forEach(enemy => {
      // Update enemy velocity to track player
      const angle = Phaser.Math.Angle.Between(
        enemy.sprite.x, enemy.sprite.y,
        playerX, playerY
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
    });
  }
  
  damageEnemy(enemy: Enemy): boolean {
    enemy.health--;
    if (enemy.health <= 0) {
      const index = this.enemies.indexOf(enemy);
      if (index !== -1) {
        enemy.sprite.destroy();
        this.enemies.splice(index, 1);
        return true; // Enemy was destroyed
      }
    }
    return false; // Enemy still alive
  }
  
  setInitialVelocities(playerX: number, playerY: number) {
    this.enemies.forEach(enemy => {
      const angle = Phaser.Math.Angle.Between(
        enemy.sprite.x, enemy.sprite.y,
        playerX, playerY
      );
      const sprite = enemy.sprite as Phaser.Physics.Arcade.Sprite;
      if (sprite.body) {
        this.physics.velocityFromRotation(angle, this.ENEMY_SPEED, sprite.body.velocity);
      }
    });
  }
  
  getEnemies(): Enemy[] {
    return this.enemies;
  }
  
  removeEnemy(enemy: Enemy): void {
    // Find index of the enemy in the array
    const index = this.enemies.findIndex(e => e === enemy);
    if (index !== -1) {
      // Remove from the array
      this.enemies.splice(index, 1);
      // Destroy the sprite
      enemy.sprite.destroy();
    }
  }
  
  findNearestEnemy(x: number, y: number): Enemy | null {
    if (this.enemies.length === 0) {
      return null;
    }
    
    let nearestEnemy: Enemy | null = null;
    let nearestDistance = Number.MAX_VALUE;
    
    for (const enemy of this.enemies) {
      if (!enemy || !enemy.sprite) continue;
      
      const distance = Phaser.Math.Distance.Between(
        x, y,
        enemy.sprite.x, enemy.sprite.y
      );
      
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestEnemy = enemy;
      }
    }
    
    return nearestEnemy;
  }
} 