# Technical Epic: Game Deployment and Versioning

## Summary

This document outlines the basis for a technical epic intended to address foundational tasks between feature development phases. Specifically, it focuses on technical setup needed after establishing the initial game feedback loop, aiming to make the project publicly accessible, trackable, and automated.

## Purpose

The goal is to create a technical epic or sub-epic to address specific tasks and cleanup items that should be tackled between working on major feature epics. This document serves as the initial basis for that planning.

## Deployment Goals

*   Build the JavaScript codebase and deploy the application.
*   Deploy the game to GitHub Pages.
*   Establish a publicly accessible version of the game.
*   Enable sharing of the game for feedback purposes.
*   Implement deployment automation, specifically using GitHub Actions.
*   Automate the publishing/deployment process.

## Versioning Goals

*   Introduce version numbers to track changes over time.
*   Automate version number bumping and deployment.
*   Initially aim for automatic publication/deployment upon each commit.
*   Explore different versioning strategies (e.g., major, minor, patch) and how version bumps might align with epics or projects, noting that this strategy needs to be figured out.
*   Display the current version number within the application UI.
*   Ensure built artifacts include the correct version and are deployed.

## Other refactors
*   `CombatScene` -> Global State (Currency/Game Mode)**
    *   **Current Coupling:** Likely direct store calls (`currencyStore.addCoins()`, `gameContext.setActiveScene()`). Litmus Score: 5+ (High Risk - Emitter Knowledge, Cross-Domain).
    *   **Proposed Event:** `COMBAT_ENDED { hexId: string; rewards: { coins: number; cash?: number }; outcome: 'victory' | 'defeat' }` emitted by `CombatScene` (or its orchestrator/adapter). A central orchestrator/service subscribes to update stores and manage transitions.
    *   **Benefit:** Clearly decouples combat results (Phaser domain) from global state management and mode switching (React/Core domain). Enables easier addition of post-combat effects (achievements, stats).
    *   **Recommendation:** **Maintain Priority for Epic 02 (Basic Combat).** Essential for integrating combat results cleanly using the event bus for appropriate cross-domain communication.