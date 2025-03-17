'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Phaser from 'phaser';
import { CombatScene, CombatSceneEvents } from '@/game/scenes/CombatScene';
import styles from './CombatMode.module.css';

interface CombatStats {
  wave: number;
  enemiesRemaining: number;
  enemyHealth: number;
  enemyDamage: number;
  enemySpeed: number;
}

interface PlayerStats {
  health: number;
  damage: number;
  shootingSpeed: number;
}

export const CombatMode: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<CombatScene | null>(null);
  const [isAutoShooting, setIsAutoShooting] = useState(false);
  const [shootingCooldown, setShootingCooldown] = useState(0);
  const [combatStats, setCombatStats] = useState<CombatStats>({
    wave: 0,
    enemiesRemaining: 0,
    enemyHealth: 0,
    enemyDamage: 0,
    enemySpeed: 0,
  });
  const [playerStats] = useState<PlayerStats>({
    health: 100,
    damage: 1,
    shootingSpeed: 1,
  });

  useEffect(() => {
    if (!gameRef.current) return;

    const events: CombatSceneEvents = {
      onWaveComplete: (wave, rewards) => {
        console.log(`Wave ${wave} complete! Rewards:`, rewards);
      },
      onGameOver: (score) => {
        console.log('Game Over! Score:', score);
      },
      onStatsUpdate: (stats) => {
        setCombatStats(stats);
      }
    };

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 1024,
      height: 768,
      parent: gameRef.current,
      backgroundColor: '#1e293b',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scene: new CombatScene(events)
    });

    // Store scene reference
    const scene = game.scene.getScene('CombatScene') as CombatScene;
    sceneRef.current = scene;

    return () => {
      game.destroy(true);
    };
  }, []);

  // Update shooting cooldown
  useEffect(() => {
    if (!isAutoShooting) {
      setShootingCooldown(0);
      return;
    }

    const interval = setInterval(() => {
      setShootingCooldown((prev) => {
        if (prev >= 100) return 0;
        return prev + 10;
      });
    }, 100); // Update every 100ms for smooth progress

    return () => clearInterval(interval);
  }, [isAutoShooting]);

  const handleToggleAutoShoot = useCallback(() => {
    setIsAutoShooting((prev) => {
      const newValue = !prev;
      if (sceneRef.current) {
        sceneRef.current.setAutoShooting(newValue);
      }
      return newValue;
    });
  }, []);

  return (
    <div className={styles.container}>
      <div ref={gameRef} className={styles.gameContainer} />
      <div className={styles.statsContainer}>
        <div className={styles.waveStats}>
          <h3>Wave Stats</h3>
          <div className={styles.statGrid}>
            <div>Wave: {combatStats.wave}</div>
            <div>Enemies: {combatStats.enemiesRemaining}</div>
            <div>Enemy Health: {combatStats.enemyHealth}</div>
            <div>Enemy Damage: {combatStats.enemyDamage}</div>
            <div>Enemy Speed: {combatStats.enemySpeed}</div>
          </div>
        </div>

        <div className={styles.playerStats}>
          <h3>Player Stats</h3>
          <div className={styles.statGrid}>
            <div>Health: {playerStats.health}</div>
            <div>Damage: {playerStats.damage}</div>
            <div>Shooting Speed: {playerStats.shootingSpeed}/s</div>
          </div>
        </div>

        <div className={styles.controls}>
          <button 
            className={`${styles.shootButton} ${isAutoShooting ? styles.active : ''}`}
            onClick={handleToggleAutoShoot}
          >
            {isAutoShooting ? 'Stop Shooting' : 'Start Shooting'}
            <div 
              className={styles.cooldownOverlay} 
              style={{ 
                width: `${shootingCooldown}%`,
                display: isAutoShooting ? 'block' : 'none'
              }} 
            />
          </button>
        </div>
      </div>
    </div>
  );
}; 