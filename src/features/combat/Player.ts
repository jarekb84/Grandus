import * as Phaser from "phaser";

export interface PlayerEvents {
  onPlayerHealthChanged: (health: number) => void;
}

export class PlayerSystem {
  private scene: Phaser.Scene;
  private player!: Phaser.Physics.Arcade.Sprite;
  private playerHealth: number = 100;
  private events: PlayerEvents;

  constructor(scene: Phaser.Scene, events: PlayerEvents) {
    this.scene = scene;
    this.events = events;
  }

  createPlayer(x: number, y: number): Phaser.Physics.Arcade.Sprite {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0x00ff00);
    graphics.fillCircle(0, 0, 16);
    graphics.generateTexture("player", 32, 32);
    graphics.destroy();

    this.player = this.scene.physics.add.sprite(x, y, "player");

    this.events.onPlayerHealthChanged(this.playerHealth);

    return this.player;
  }

  getPlayer(): Phaser.Physics.Arcade.Sprite {
    return this.player;
  }

  getPlayerHealth(): number {
    return this.playerHealth;
  }

  updatePlayerHealth(damage: number): boolean {
    this.playerHealth -= damage;

    this.events.onPlayerHealthChanged(this.playerHealth);

    this.showDamageEffect(damage);

    return this.playerHealth <= 0;
  }

  resetHealth(): void {
    this.playerHealth = 100;
    this.events.onPlayerHealthChanged(this.playerHealth);
  }

  private showDamageEffect(damage: number): void {
    // Flash the player red
    this.player.setTint(0xff0000);

    this.createDamageText(this.player.x, this.player.y - 20, damage);

    this.scene.cameras.main.shake(100, 0.01);

    this.scene.time.delayedCall(200, () => {
      this.player.clearTint();
    });
  }

  private createDamageText(x: number, y: number, amount: number): void {
    const text = this.scene.add.text(x, y, `-${amount}`, {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#FF0000",
      stroke: "#000000",
      strokeThickness: 2,
    });
    text.setOrigin(0.5);

    this.scene.tweens.add({
      targets: text,
      y: y - 30,
      alpha: 0,
      duration: 800,
      onComplete: () => {
        text.destroy();
      },
    });
  }
}
