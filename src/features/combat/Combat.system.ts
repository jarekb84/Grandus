import * as Phaser from "phaser";
import { EnemySystem } from "@/features/combat/Enemy";
import { ProjectileSystem } from "@/features/combat/Projectile";
import { ResourceType } from "@/features/shared/types/entities";
import { useResourcesStore } from "@/features/shared/stores/Resources.store";
import { PlayerSystem } from "@/features/combat/Player";
import { WaveSystem } from "@/features/combat/Wave";
import { useCombatStore } from "@/features/combat/Combat.store";

export interface CombatEvents {
  onAmmoChanged: (ammo: number) => void;
  onOutOfAmmo: () => void;
}

export class CombatSystem {
  private scene: Phaser.Scene;
  private enemySystem: EnemySystem;
  private projectileSystem: ProjectileSystem;
  private playerSystem: PlayerSystem;
  private waveSystem: WaveSystem;
  private events: CombatEvents;

  private readonly SHOOT_INTERVAL = 1000; // Shoot every 1000ms (1 second)
  private nextShootTime: number = 0;
  private isAutoShooting: boolean = false;
  private resourcesStore = useResourcesStore;

  constructor(
    scene: Phaser.Scene,
    enemySystem: EnemySystem,
    projectileSystem: ProjectileSystem,
    playerSystem: PlayerSystem,
    waveSystem: WaveSystem,
    events: CombatEvents,
  ) {
    this.scene = scene;
    this.enemySystem = enemySystem;
    this.projectileSystem = projectileSystem;
    this.playerSystem = playerSystem;
    this.waveSystem = waveSystem;
    this.events = events;
  }

  setAutoShooting(enabled: boolean): void {
    this.isAutoShooting = enabled;
  }

  isAutoShootingEnabled(): boolean {
    return this.isAutoShooting;
  }

  update(time: number): boolean {
    const player = this.playerSystem.getPlayer();

    if (this.isAutoShooting && time > this.nextShootTime) {
      const nearestEnemy = this.enemySystem.findNearestEnemy(
        player.x,
        player.y,
      );
      const hasPebbles = this.resourcesStore
        .getState()
        .hasResource(ResourceType.PEBBLE, 1);

      if (nearestEnemy && hasPebbles) {
        this.resourcesStore.getState().removeResource(ResourceType.PEBBLE, 1);

        const newAmmoCount = this.resourcesStore
          .getState()
          .getResource(ResourceType.PEBBLE);
        useCombatStore.getState().updateStats({ ammo: newAmmoCount });

        this.projectileSystem.shootProjectile(
          player.x,
          player.y,
          nearestEnemy.sprite.x,
          nearestEnemy.sprite.y,
        );
        this.nextShootTime = time + this.SHOOT_INTERVAL;

        this.events.onAmmoChanged(newAmmoCount);
      } else if (!hasPebbles) {
        useCombatStore.getState().updateStats({ ammo: 0 });
        this.events.onAmmoChanged(0);
        this.events.onOutOfAmmo();
      }
    }

    return false;
  }
}
