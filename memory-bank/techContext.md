# Technical Context: Grandus Game

## Technologies Used
- **Frontend Framework:** React with Next.js
  - For UI components, game management interfaces, and overall application structure.
- **Game Engine:** PhaserJs (WebGL)
  - For rendering 2D game scenes, handling game logic in Gathering and Combat modes, and visual effects.
- **State Management:** Zustand
  - For managing game state across different features and components.
- **Styling:** CSS Modules
  - For component-level styling and maintainability.
- **Language:** TypeScript
  - For type safety, maintainability, and developer productivity.

## Development Setup
- **Environment:** VSCode
- **Package Manager:** npm
- **Local Development Server:** Next.js dev server
- **Target Platform:** Web browsers

## Technical Constraints
- **Browser Compatibility:** Ensure compatibility across modern web browsers.
- **Performance:** Optimize PhaserJs scenes for smooth performance, especially in combat with multiple entities. Key strategies include tiered update frequencies, object pooling (projectiles, particles, enemies), spatial partitioning for collision detection, and potential rendering optimizations (LOD, culling) as entity counts scale (Ref: PERFORMANCE_PLAN.MD). Target thresholds defined for implementing optimization milestones.
- **Scalability:** Design architecture to handle increasing complexity and potential future features, including multiplayer. State management and system design should support this.
- **Memory Management:** Efficiently manage game assets and resources (object pooling helps here) to prevent memory leaks and ensure smooth gameplay over extended sessions.

## Dependencies
- **Next.js:** Full-stack React framework for web application structure and features.
- **React:** JavaScript library for building user interfaces.
- **PhaserJs:** 2D game engine for rendering and game logic.
- **Zustand:** Lightweight state management library.
- **TypeScript:** Superset of JavaScript for type checking and enhanced development experience.
- **ESLint:** For code linting and maintaining code quality.

## Notes
- Project uses TypeScript for all code to ensure type safety and improve maintainability.
- Next.js provides a robust framework for handling routing, server-side rendering, and API routes if needed.
- PhaserJs is used specifically for the interactive game scenes (Territory, Combat), allowing for efficient rendering of game entities and effects.
- Zustand is implemented for global state management, with plans to refactor into domain-specific stores (e.g., `CombatStore`, `ResourceNodeStore`) for better organization. (Ref: STATE_ARCHITECTURE.MD)
- **State Architecture:** Emphasizes separation between high-frequency Phaser state and lower-frequency React/Zustand state. Communication facilitated by a standardized Adapter pattern and an Event Bus. Plans include using Dependency Injection and potentially a Service Layer for business logic. (Ref: STATE_ARCHITECTURE.MD & PERFORMANCE_PLAN.MD)
- **Performance Strategy:** Follows a milestone-based approach, implementing optimizations like object pooling and spatial partitioning based on measured performance against defined entity count thresholds. (Ref: PERFORMANCE_PLAN.MD)
