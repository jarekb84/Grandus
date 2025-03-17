'use client'

import React, { useRef, useEffect } from 'react';
import * as Phaser from 'phaser';
import { CombatUI } from '../CombatUI/CombatUI';
import { useCombatState } from './hooks/useCombatState';
import { CombatScene } from '@/game/scenes/combat/CombatScene';

export const CombatContainer: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<CombatScene | null>(null);
  const { state, actions } = useCombatState();

  // Initialize Phaser game
  useEffect(() => {
    if (!gameRef.current) return;

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
      scene: new CombatScene({
        onWaveComplete: actions.handleWaveComplete,
        onGameOver: actions.handleGameOver,
        onStatsUpdate: actions.handleStatsUpdate,
      })
    });

    // Store scene reference
    const scene = game.scene.getScene('CombatScene') as CombatScene;
    sceneRef.current = scene;

    return () => {
      game.destroy(true);
    };
  }, [actions.handleWaveComplete, actions.handleGameOver, actions.handleStatsUpdate]);

  // Update shooting cooldown
  useEffect(() => {
    if (!state.isAutoShooting) return;

    const interval = setInterval(actions.updateShootingCooldown, 100);
    return () => clearInterval(interval);
  }, [state.isAutoShooting, actions.updateShootingCooldown]);

  // Update scene auto-shooting state
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setAutoShooting(state.isAutoShooting);
    }
  }, [state.isAutoShooting]);

  const handleToggleAutoShoot = () => {
    actions.handleToggleAutoShoot();
  };

  const handleRetry = () => {
    if (sceneRef.current) {
      actions.handleRetry();
      sceneRef.current.scene.restart();
    }
  };

  return (
    <CombatUI
      gameRef={gameRef}
      isGameOver={state.isGameOver}
      finalScore={state.finalScore}
      combatStats={state.combatStats}
      playerStats={state.playerStats}
      isAutoShooting={state.isAutoShooting}
      shootingCooldown={state.shootingCooldown}
      onToggleAutoShoot={handleToggleAutoShoot}
      onRetry={handleRetry}
    />
  );
}; 