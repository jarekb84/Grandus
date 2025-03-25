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
- **Performance:** Optimize PhaserJs scenes for smooth performance, especially in combat with multiple entities.
- **Scalability:** Design architecture to handle increasing complexity and potential future features, including multiplayer.
- **Memory Management:** Efficiently manage game assets and resources to prevent memory leaks and ensure smooth gameplay over extended sessions.

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
- PhaserJs is used specifically for the interactive game scenes, allowing for efficient rendering of game entities and effects.
- Zustand is implemented for simple and scalable state management, facilitating communication between React components and Phaser scenes.
