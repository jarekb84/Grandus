# Workflow Strategy for Story Management

This document outlines the agreed-upon strategy for managing development tasks (Epics and Stories) within this project, particularly for AI-driven sessions.

## Core Principles

*   **Single Story Focus:** Each AI work session should focus on completing only *one* story at a time to maintain clarity and reduce context bleed.
*   **Granularity:** Work is broken down into Epics and Stories. Stories represent the smallest unit of work delegated in a single session.

## Structure (Hybrid Approach)

*   **Epic Overviews:** Located in `docs/epics/EPIC_X_NAME.md`. Each file contains:
    *   The Epic's overall goal.
    *   A list/links to the story files associated with that Epic.
*   **Individual Story Files:** Located in `docs/stories/epicX/NN_Story_Name.md`. Each file contains:
    *   Story description.
    *   Acceptance Criteria.
    *   Notes.
    *   Explicit dependency declarations (`**Depends on:** #NN_Other_Story.md`) if necessary.
    *   Explicit decomposition links (`**Parent Story:**`, `**Decomposed into:**`) if a story is split.

## Sequencing and Naming

*   **Numerical Prefix:** Stories within an Epic are sequenced using a two-digit numerical prefix (e.g., `01_`, `02_`) in the filename, indicating the default implementation order.
*   **Descriptive Names:** Filenames should be descriptive (e.g., `01_Foundation_Hex_Grid.md`).

## Handling Complexity & Decomposition

1.  **Assessment:** Before starting a story, assess its complexity. If it seems large (>5 AC, >3 systems, vague), consider breaking it down.
2.  **Sub-tasks:** For moderate complexity, define sub-tasks using Markdown checklists *within* the story file first.
3.  **Decomposition (Escalation):** If a story is too large, break it into *new, separate story files*.
    *   **Naming:** Use letter suffixes for decomposed stories (e.g., `04a_Part_One.md`, `04b_Part_Two.md`).
    *   **Linking:** Add explicit links in the parent (`**Decomposed into:** #04a_..., #04b_...`) and child (`**Parent Story:** #04_...`) files.

## Memory Bank Integration

*   **Story Files (`docs/stories/`):** Define the **"What"** (scope, goal, AC).
*   **Memory Bank (`memory-bank/`):** Tracks the **"How" & "Why"** of execution.
    *   `activeContext.md`: Notes the *currently active story*.
    *   `decisionLog.md`: Records significant decisions *during* story implementation.
    *   `progress.md`: Logs when stories are *started* and *completed*.
    *   `workflowStrategy.md`: This file, defining the process itself.

## Iterative Refinement

This strategy is a starting point. We will adapt it based on experience, particularly around complexity assessment and decomposition methods.

## Story Completion Tracking

[2025-04-12 15:24]
To track the completion status of user stories:
- **Primary Status:** Edit the corresponding Epic file (e.g., `docs/epics/EPIC_NAME.md`) and add a Markdown checkbox `[x]` marker to the list item for the completed story. Ensure story filenames in the epic file match the actual filenames in `docs/stories/`.
- **Historical Log:** Continue to record the completion event, including the story path and a brief summary, in `memory-bank/progress.md` with a timestamp.
- **Commit Message Suggestion:** After confirming the completion updates, provide a suggested commit message summarizing the changes made during the story's implementation, following a concise title/detailed body format.