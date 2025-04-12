# Project Structure

## Directory Organization Principles
- Features are the primary organizational unit.
- All files related to a feature should be in that feature's directory.
- Use descriptive file names with purpose-based suffixes.
- Create sub-feature directories only when a feature area becomes complex.
- Keep cross-cutting functionality in shared directories.

## Pattern
```
src/
  features/                     # All game features
    {feature-name}/             # Each specific game feature
      {Feature}.tsx             # Root React component for the feature
      {Feature}.scene.ts        # Phaser scene for the feature (if applicable)
      {Feature}.store.ts        # State management for the feature
      {domain-object}.ts        # Domain-specific logic files

      # Sub-features pattern (when needed)
      {sub-feature}/            # A distinct part of the feature
        {SubFeature}.tsx        # UI components
        {SubFeature}.store.ts   # State management for sub-feature

    shared/                     # Cross-cutting concerns
      types.ts                  # Shared type definitions
      utils.ts                  # Shared utility functions
      ui/                       # Reusable UI components
        {Component}.tsx         # Generic UI components

  app/                          # Next.js pages (Assuming this is the project root structure, adjust if needed)
```

## Current Implementation Examples (Illustrative)
```
src/
  features/
    combat/
      Combat.tsx                # Combat UI root component
      Combat.scene.ts           # Combat game scene
      Combat.store.ts           # Combat state management
      Player.ts                 # Player entity logic
      Enemy.ts                  # Enemy entity logic

    gathering/
      Gathering.tsx             # Gathering UI root component
      Gathering.scene.ts        # Gathering game scene
      Resource.store.ts         # Resource management
      ResourceNode.ts           # Resource node logic

    shared/
      types.ts                  # Shared type definitions
      utils.ts                  # Utility functions
      ui/
        Button.tsx              # Reusable button component
        Panel.tsx               # Reusable panel component

  app/
    page.tsx                    # Next.js app entry point (Adjust if not Next.js)
```

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

# Code Comments (Strict Guidelines)

*   **Purpose:** Comments MUST explain the *why* behind complex, non-obvious logic or design decisions that cannot be easily inferred from the code itself. They should *never* explain the *what* or *how* if the code is clear.
*   **Prohibited Comments (AI & Human):** The following types of comments are strictly forbidden and should not be generated or added:
    *   **Change Descriptions:** Comments describing the change being made (e.g., `// Refactored X`, `// Added Y`, `// Moved function`). This information belongs exclusively in commit messages.
    *   **Redundant/Obvious Logic:** Comments that merely restate the function/variable name or describe self-evident code logic (e.g., `// Loop through items`, `// Increment counter`).
    *   **Markers/Placeholders:** `TODO`, `FIXME`, `XXX`, `NOTE`, placeholder comments, or similar temporary markers. Use issue tracking systems for managing tasks and known issues.
    *   **Temporary State/Workarounds:** Comments explaining temporary fixes, workarounds, or incomplete states (e.g., `// Temporary fix until API is ready`). Address the underlying issue or document it externally.
*   **Sparsity:** Add comments *very sparingly*. Clean, self-documenting code is preferred over excessive commenting. If code requires extensive comments to be understood, consider refactoring it for clarity first.