import * as Phaser from "phaser";
import { EnemySystem } from "@/features/combat/Enemy";
import { ProjectileSystem } from "@/features/combat/Projectile";
import { PlayerSystem, PlayerEvents } from "@/features/combat/Player";
import { WaveSystem, WaveEvents, WaveRewards } from "@/features/combat/Wave";
import { CombatSystem, CombatEvents } from "@/features/combat/Combat.system";
import { useCurrencyStore } from "@/features/shared/stores/Currency.store";
import { PerformanceMonitor } from "@/features/game-engine/core/PerformanceMonitor";
import { useCombatStore } from "@/features/combat/Combat.store";
import { useResourcesStore } from "@/features/shared/stores/Resources.store";
import { ResourceType } from "@/features/shared/types/entities";

export interface CombatSceneEvents {
  onWaveComplete: (waveNumber: number, rewards: WaveRewards) => void;
  onGameOver: (score: number) => void;
  onStatsUpdate: (stats: {
    wave: number;
    enemiesRemaining: number;
    enemyHealth: number;
    enemyDamage: number;
    enemySpeed: number;
  }) => void;
  onAmmoChanged: (ammo: number) => void;
  onOutOfAmmo: () => void;
  onPlayerHealthChanged: (health: number) => void;
}

export class CombatScene extends Phaser.Scene {
  private enemySystem!: EnemySystem;
  private projectileSystem!: ProjectileSystem;
  private playerSystem!: PlayerSystem;
  private waveSystem!: WaveSystem;
  private combatSystem!: CombatSystem;
  private performanceMonitor!: PerformanceMonitor;
  private sceneEvents: CombatSceneEvents;
  private readonly PLAYER_Y = 700;
  private isGameOver: boolean = false;
  private frameCount: number = 0;
  private targetHexId: string | null = null;

  constructor(events: CombatSceneEvents) {
    super({
      key: "CombatScene",
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
    });
    this.sceneEvents = events;
  }

  init(data: { hexId?: string }): void {
    this.targetHexId = data.hexId ?? null;
    console.log(`CombatScene initialized for hex: ${this.targetHexId}`);
  }

  setAutoShooting(enabled: boolean): void {
    this.combatSystem.setAutoShooting(enabled);
    useCombatStore.getState().setAutoShooting(enabled);
  }

  preload(): void {
    // We'll create textures in create() instead, similar to MainScene
  }

  create(): void {
    this.isGameOver = false;
    this.frameCount = 0;

    this.physics.world.setBounds(0, 0, 1024, 768);

    this.physics.resume();

    this.enemySystem = new EnemySystem(this);
    this.projectileSystem = new ProjectileSystem(this);

    const playerEvents: PlayerEvents = {
      onPlayerHealthChanged: this.sceneEvents.onPlayerHealthChanged,
    };
    this.playerSystem = new PlayerSystem(this, playerEvents);

    const centerX = this.cameras.main.centerX;
    const player = this.playerSystem.createPlayer(centerX, this.PLAYER_Y);

    const waveEvents: WaveEvents = {
      onWaveComplete: this.sceneEvents.onWaveComplete,
      onStatsUpdate: this.sceneEvents.onStatsUpdate,
    };
    this.waveSystem = new WaveSystem(this, this.enemySystem, waveEvents);

    const combatEvents: CombatEvents = {
      onAmmoChanged: this.sceneEvents.onAmmoChanged,
      onOutOfAmmo: this.sceneEvents.onOutOfAmmo,
    };
    this.combatSystem = new CombatSystem(
      this,
      this.enemySystem,
      this.projectileSystem,
      this.playerSystem,
      this.waveSystem,
      combatEvents,
    );

    this.performanceMonitor = new PerformanceMonitor(this);

    const pebbleCount = useResourcesStore
      .getState()
      .getResource(ResourceType.PEBBLE);
    useCombatStore.getState().updateStats({ ammo: pebbleCount });
    this.sceneEvents.onAmmoChanged(pebbleCount);

    this.waveSystem.startNextWave(player.x, player.y);

    // State reset should be handled externally (e.g., on retry or mode change)

    // Immediately sync the complete state to prevent render delay
    useCombatStore.getState().updateStats({
      playerHealth: this.playerSystem.getPlayerHealth(),
      wave: this.waveSystem.getCurrentWave(),
      enemiesRemaining: this.enemySystem.getEnemies().length,
      ammo: pebbleCount,
    });
  }

  override update(time: number): void {
    if (this.isGameOver === true) return;

    if (
      this.combatSystem === null ||
      this.waveSystem === null ||
      this.playerSystem === null
    )
      return;

    // === HIGH FREQUENCY UPDATES (EVERY FRAME) ===

    // Update enemy movement and physics
    this.enemySystem.updateEnemyMovement(
      this.playerSystem.getPlayer().x,
      this.playerSystem.getPlayer().y,
    );

    this.projectileSystem.checkCollisions(
      this.enemySystem.getEnemies(),
      (enemy) => {
        const destroyed = this.enemySystem.damageEnemy(enemy);
        if (destroyed) {
          this.waveSystem.createCashFloatingText(
            enemy.sprite.x,
            enemy.sprite.y,
            1,
          );

          useCurrencyStore.getState().addCash(1);

          const killCount =
            (useCombatStore.getState().stats.killCount || 0) + 1;
          if (this.frameCount % 3 === 0) {
            useCombatStore.getState().updateStats({
              enemiesRemaining: this.enemySystem.getEnemies().length,
              killCount: killCount,
            });
          }
        }
      },
    );

    // === MEDIUM FREQUENCY UPDATES (EVERY 3 FRAMES) ===
    if (this.frameCount % 3 === 0) {
      const enemies = this.enemySystem.getEnemies();
      const playerY = this.playerSystem.getPlayer().y;
      for (const enemy of enemies) {
        if (enemy.sprite.y >= playerY - 32) {
          const enemyDamage = 10;
          const playerDied = this.playerSystem.updatePlayerHealth(enemyDamage);

          this.enemySystem.removeEnemy(enemy);

          if (playerDied) {
            this.handlePlayerDeath();
            return;
          }
        }
      }

      const playerDied = this.combatSystem.update(time);
      if (playerDied) {
        this.handlePlayerDeath();
        return;
      }
    }

    // === LOW FREQUENCY UPDATES (EVERY 10 FRAMES) ===
    if (this.frameCount % 10 === 0) {
      if (this.waveSystem.isWaveComplete()) {
        useCombatStore.getState().setWaveComplete(true);
        this.waveSystem.completeWave();
        this.waveSystem.startNextWave(
          this.playerSystem.getPlayer().x,
          this.playerSystem.getPlayer().y,
        );
        useCombatStore.getState().setWaveComplete(false);
      }

      useCombatStore.getState().updateStats({
        playerHealth: this.playerSystem.getPlayerHealth(),
        wave: this.waveSystem.getCurrentWave(),
        enemiesRemaining: this.enemySystem.getEnemies().length,
      });
    }

    this.performanceMonitor.update(time, this.enemySystem.getEnemies().length);

    this.frameCount = (this.frameCount + 1) % 60;
  }

  private handlePlayerDeath(): void {
    this.isGameOver = true;
    useCombatStore.getState().setGameOver(true);

    this.combatSystem.setAutoShooting(false);
    useCombatStore.getState().setAutoShooting(false);

    this.physics.pause();

    const finalScore = this.waveSystem.getCurrentWave();
    this.sceneEvents.onGameOver(finalScore);

    useCombatStore.getState().updateStats({
      wave: finalScore,
      enemiesRemaining: 0,
    });

    useCurrencyStore.getState().resetCash();
  }
}
