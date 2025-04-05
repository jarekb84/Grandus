import * as Phaser from "phaser";
import { EnemySystem } from "@/features/combat/Enemy";

export interface WaveRewards {
  coins: number;
}

export interface WaveEvents {
  onWaveComplete: (waveNumber: number, rewards: WaveRewards) => void;
  onStatsUpdate: (stats: {
    wave: number;
    enemiesRemaining: number;
    enemyHealth: number;
    enemyDamage: number;
    enemySpeed: number;
  }) => void;
}

export class WaveSystem {
  private scene: Phaser.Scene;
  private enemySystem: EnemySystem;
  private currentWave: number = 0;
  private events: WaveEvents;

  constructor(
    scene: Phaser.Scene,
    enemySystem: EnemySystem,
    events: WaveEvents,
  ) {
    this.scene = scene;
    this.enemySystem = enemySystem;
    this.events = events;
  }

  getCurrentWave(): number {
    return this.currentWave;
  }

  resetWaves(): void {
    this.currentWave = 0;
  }

  startNextWave(playerX: number, playerY: number): void {
    this.currentWave++;

    this.enemySystem.spawnWaveEnemies(
      this.currentWave,
      this.scene.cameras.main.width,
    );

    this.enemySystem.setInitialVelocities(playerX, playerY);

    this.updateStats();
  }

  isWaveComplete(): boolean {
    return this.enemySystem.getEnemies().length === 0;
  }

  completeWave(): void {
    this.events.onWaveComplete(this.currentWave, {
      coins: this.currentWave * 10,
    });
  }

  updateStats(): void {
    const enemies = this.enemySystem.getEnemies();
    this.events.onStatsUpdate({
      wave: this.currentWave,
      enemiesRemaining: enemies.length,
      enemyHealth: 1,
      enemyDamage: 1,
      enemySpeed: 50,
    });
  }

  createCashFloatingText(x: number, y: number, amount: number): void {
    const text = this.scene.add.text(x, y, `$${amount}`, {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#7FFF7F",
      stroke: "#000000",
      strokeThickness: 1.5,
    });
    text.setOrigin(0.5);

    this.scene.tweens.add({
      targets: text,
      y: y - 35,
      alpha: 0,
      scale: 0.8,
      duration: 800,
      ease: "Sine.Out",
      onComplete: () => {
        text.destroy();
      },
    });
  }
}
