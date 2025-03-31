import * as Phaser from "phaser";
import { EnemySystem } from "@/features/combat/Enemy";
import { ProjectileSystem } from "@/features/combat/Projectile";
import { PlayerSystem, PlayerEvents } from "@/features/combat/Player";
import { WaveSystem, WaveEvents, WaveRewards } from "@/features/combat/Wave"; // Import WaveRewards
import { CombatSystem, CombatEvents } from "@/features/combat/Combat.system";
import { useCurrencyStore } from "@/features/shared/stores/Currency.store";
import { PerformanceMonitor } from "@/features/game-engine/core/PerformanceMonitor";
import { useCombatStore } from "@/features/combat/Combat.store";
import { useResourcesStore } from "@/features/shared/stores/Resources.store";
import { ResourceType } from "@/features/shared/types/entities";

export interface CombatSceneEvents {
  onWaveComplete: (waveNumber: number, rewards: WaveRewards) => void; // Use WaveRewards here
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
  private readonly PLAYER_Y = 700; // Player's fixed Y position near bottom
  private isGameOver: boolean = false; // Track game over state
  private frameCount: number = 0; // Track frame count for tiered updates
  private targetHexId: string | null = null; // To store the hex context

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
    // Also update the store for React components
    useCombatStore.getState().setAutoShooting(enabled);
  }

  preload(): void {
    // We'll create textures in create() instead, similar to MainScene
  }

  create(): void {
    // Reset game over state when scene is created
    this.isGameOver = false;
    this.frameCount = 0;

    // Initialize physics
    this.physics.world.setBounds(0, 0, 1024, 768);

    // Ensure physics is running
    this.physics.resume();

    // Initialize systems
    this.enemySystem = new EnemySystem(this);
    this.projectileSystem = new ProjectileSystem(this);

    // Initialize player system
    const playerEvents: PlayerEvents = {
      onPlayerHealthChanged: this.sceneEvents.onPlayerHealthChanged,
    };
    this.playerSystem = new PlayerSystem(this, playerEvents);

    // Create player at the bottom center
    const centerX = this.cameras.main.centerX;
    const player = this.playerSystem.createPlayer(centerX, this.PLAYER_Y);

    // Initialize wave system
    const waveEvents: WaveEvents = {
      onWaveComplete: this.sceneEvents.onWaveComplete,
      onStatsUpdate: this.sceneEvents.onStatsUpdate,
    };
    this.waveSystem = new WaveSystem(this, this.enemySystem, waveEvents);

    // Initialize combat system
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

    // Initialize performance monitor
    this.performanceMonitor = new PerformanceMonitor(this);

    // Immediately update the ammo count from resources store
    const stoneCount = useResourcesStore
      .getState()
      .getResource(ResourceType.STONE); // Assuming STONE is still the ammo for now
    useCombatStore.getState().updateStats({ ammo: stoneCount });
    this.sceneEvents.onAmmoChanged(stoneCount);

    // Start first wave
    this.waveSystem.startNextWave(player.x, player.y);

    // State reset should be handled externally (e.g., on retry or mode change)

    // Immediately sync the complete state to prevent render delay
    useCombatStore.getState().updateStats({
      playerHealth: this.playerSystem.getPlayerHealth(),
      wave: this.waveSystem.getCurrentWave(),
      enemiesRemaining: this.enemySystem.getEnemies().length,
      ammo: stoneCount,
    });
  }

  override update(time: number): void {
    // Skip all updates if game is over
    if (this.isGameOver === true) return;

    // Ensure all systems are initialized
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

    // Check for collisions between projectiles and enemies
    this.projectileSystem.checkCollisions(
      this.enemySystem.getEnemies(),
      (enemy) => {
        // Damage enemy
        const destroyed = this.enemySystem.damageEnemy(enemy);
        if (destroyed) {
          // Show floating cash text at enemy position
          this.waveSystem.createCashFloatingText(
            enemy.sprite.x,
            enemy.sprite.y,
            1,
          );

          // Add cash when enemy is destroyed ($1 per kill)
          useCurrencyStore.getState().addCash(1);

          // Update kill count in high-frequency local state
          const killCount =
            (useCombatStore.getState().stats.killCount || 0) + 1;

          // Update local state for enemiesRemaining
          if (this.frameCount % 3 === 0) {
            // Every 3 frames, update the medium-frequency state
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
      // Check if any enemies have reached the player
      const enemies = this.enemySystem.getEnemies();
      const playerY = this.playerSystem.getPlayer().y;

      for (const enemy of enemies) {
        if (enemy.sprite.y >= playerY - 32) {
          // Apply damage to player when enemy reaches them
          const enemyDamage = 10; // Each enemy does 10 damage
          const playerDied = this.playerSystem.updatePlayerHealth(enemyDamage);

          // Remove the enemy that hit the player
          this.enemySystem.removeEnemy(enemy);

          if (playerDied) {
            this.handlePlayerDeath();
            return;
          }
        }
      }

      // Check auto shooting in medium frequency
      const playerDied = this.combatSystem.update(time);
      if (playerDied) {
        this.handlePlayerDeath();
        return;
      }
    }

    // === LOW FREQUENCY UPDATES (EVERY 10 FRAMES) ===
    if (this.frameCount % 10 === 0) {
      // Check if wave is complete
      if (this.waveSystem.isWaveComplete()) {
        useCombatStore.getState().setWaveComplete(true);
        this.waveSystem.completeWave();
        this.waveSystem.startNextWave(
          this.playerSystem.getPlayer().x,
          this.playerSystem.getPlayer().y,
        );
        useCombatStore.getState().setWaveComplete(false);
      }

      // Sync game stats to the store for React UI
      useCombatStore.getState().updateStats({
        playerHealth: this.playerSystem.getPlayerHealth(),
        wave: this.waveSystem.getCurrentWave(),
        enemiesRemaining: this.enemySystem.getEnemies().length,
      });
    }

    // Update performance monitor every frame
    this.performanceMonitor.update(time, this.enemySystem.getEnemies().length);

    // Increment frame counter
    this.frameCount = (this.frameCount + 1) % 60;
  }

  private handlePlayerDeath(): void {
    // Set game over state
    this.isGameOver = true;
    useCombatStore.getState().setGameOver(true);

    // Stop auto-shooting
    this.combatSystem.setAutoShooting(false);
    useCombatStore.getState().setAutoShooting(false);

    // Freeze all physics objects (enemies and projectiles)
    this.physics.pause();

    // Notify game over with current wave as score
    const finalScore = this.waveSystem.getCurrentWave();
    this.sceneEvents.onGameOver(finalScore);

    // Update final stats in store
    useCombatStore.getState().updateStats({
      wave: finalScore,
      enemiesRemaining: 0,
    });

    // Reset cash when game is over
    useCurrencyStore.getState().resetCash();
  }
}
