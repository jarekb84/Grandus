import * as Phaser from 'phaser';

export class PlayerSystem {
  private scene: Phaser.Scene;
  private player!: Phaser.Physics.Arcade.Sprite;
  private readonly PLAYER_Y = 700;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    const centerX = this.scene.cameras.main.centerX;
    
    // Create a simple circle for the player
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0x00ff00);
    graphics.fillCircle(0, 0, 16);
    graphics.generateTexture('player', 32, 32);
    graphics.destroy();

    this.player = this.scene.physics.add.sprite(centerX, this.PLAYER_Y, 'player');
  }

  getPlayerPosition(): { x: number; y: number } {
    return {
      x: this.player.x,
      y: this.player.y,
    };
  }
} 