# Component Guidelines
- Pure presentation in React components.
- Business logic in hooks or systems/services.
- Maximum 200 lines per file (as a guideline, not a hard rule).
- Maximum 3 levels of JSX nesting (prefer extraction).
- Extract complex logic to dedicated files/hooks.
- Use TypeScript interfaces for all props.

# Naming Conventions
- PascalCase: Components, Classes, Types, Interfaces.
- camelCase: Functions, Variables, Files.
- Prefix: 'use' for React hooks.
- Suffix: Use dot notation for specific file types (.store.ts, .scene.ts, .adapter.ts, .service.ts, etc.).
- No index.tsx/index.ts files - use explicit names only.