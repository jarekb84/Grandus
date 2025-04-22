## Summary: Hierarchical AI Mode Workflow for Development

This document summarizes the multi-layered AI mode structure designed to manage complex development tasks, focusing on controlled context, iterative refinement, and incorporating user feedback throughout the process.

**Core Principle:** Break down large goals (Product Vision) into progressively smaller, manageable units (Projects -> Epics -> Stories -> Tasks) managed by specialized AI modes. Each mode operates with limited, relevant context passed down from the level above, aiming for focused execution and predictable behavior.

**Hierarchical Mode Structure & Workflow:**

**Level 0: Product Vision -> Projects**
*   **Input:** High-level Product Vision document (e.g., `docs/game_plan.md`).
*   **Mode:** `product-planner` (🌍 Product Planner)
    *   **Goal:** Analyzes vision, identifies strategic initiatives (often vertical slices).
    *   **Process:** Proposes a sequenced Project plan to the user, iterates based on feedback, gets explicit confirmation.
    *   **Output:** Creates structured Project definition files (`./docs/projects/project-<num>-<slug>/...`) containing embedded vision context relevant to that specific Project.

**Level 1: Project -> Epics**
*   **Input:** A single Project definition file (from L0).
*   **Mode:** `project-epic-generator` (🏗️ Project Epic Generator)
    *   **Goal:** Breaks down the Project into a sequence of value-driven Epics (often iterative vertical slices like MVP -> V1.1 -> V1.2). Relies heavily on context embedded in the Project file.
    *   **Process:** Proposes a sequenced Epic plan to the user, iterates based on feedback, gets explicit confirmation.
    *   **Output:** Creates structured Epic definition files (`./docs/projects/<proj_dir>/epic-<num>-<slug>/...`) containing embedded Project context relevant to that specific Epic.

**Level 2: Epic -> Story Outline & Architectural Review**
*   **Input:** A single Epic definition file (from L1).
*   **Mode:** `epic-story-generator` (📚 Epic Story Generator)
    *   **Goal:** Generates an initial plan of User Stories (titles/goals) to fulfill the Epic. Critically, it then interacts with the `architect-planner` for feasibility checks *before* finalizing the Story definitions with the user.
    *   **Process:**
        1.  Analyzes Epic, proposes initial Story goals list.
        2.  Delegates to `architect-planner` (L4) providing Epic context + Story goals list.
        3.  Receives high-level architectural feedback (feasibility, existing code, refactoring needs, plan adjustments).
        4.  Refines Story goals list based on architect feedback.
        5.  Presents refined Story plan to the user for confirmation, explaining architectural rationale.
        6.  Upon confirmation, generates initial Story definition files (`./docs/projects/<proj_dir>/<epic_dir>/story-<num>-<slug>/...`) containing embedded Epic context.
    *   **Output:** Structured User Story definition files ready for individual execution.

**Level 3: Story Workflow Orchestration**
*   **Input:** A single User Story definition file (from L2).
*   **Mode:** `story-workflow-manager` (⚙️ Story Workflow Manager)
    *   **Goal:** Manages the end-to-end lifecycle of a single Story by orchestrating calls to specialist L4 modes.
    *   **Process:** Operates as a state machine driven by the `status:` field within the Story file. Sequentially delegates to:
        1.  `story-groomer` (L4) for requirement clarification.
        2.  `architect-planner` (L4) for *detailed technical implementation planning*.
        3.  `code-executor` (L4) for implementing specific technical tasks from the architect's plan.
        4.  `code-reviewer` (L4) for quality and standards checks.
        5.  `user-feedback` (L4) (Optional) for user validation.
        6.  `completion-manager` (L4) for final wrap-up (commit msg, status updates).
    *   **Output:** A completed Story, associated artifacts (code changes, commit message), and updated statuses.

**Level 4: Specialist Execution Modes**
*   **(Called by `story-workflow-manager`)**
*   **Modes:**
    *   `story-groomer` (🔍): Refines Story description & ACs via user interaction.
    *   `architect-planner` (🏗️): Performs *detailed* technical planning for a *single* Story (contrast with its high-level review role when called by `epic-story-generator`). Defines specific file changes/sub-tasks.
    *   `code-executor` (💻): Implements *one* specific technical sub-task based *only* on instructions received.
    *   `code-reviewer` (🧐): Analyzes code changes (diffs) against standards and task intent. Provides feedback (pass/fail/comments).
    *   `user-feedback` (🗣️): Facilitates user review of implemented changes.
    *   `completion-manager` (✅): Generates commit messages, updates progress/status files.

**Cross-Cutting Concepts & Mechanisms:**

*   **Context Embedding:** Higher-level planning modes (Product, Project, Epic) are responsible for embedding sufficient context from their input into their output artifacts so downstream modes can operate with relative independence.
*   **Standardized Completion (`attempt_completion`):** All modes use a templated structure (e.g., via `99-completion-template.md` symlinked via `.roo/shared/`) to report results back to their caller. This includes status, summaries, artifact paths, and crucially, **user feedback summaries** and **scope deviation notes**.
*   **Common Mode Principles (`00-common-mode-principles.md`):** A shared file (symlinked via `.roo/shared/`) containing high-level directives applicable to most modes, covering:
    *   **Feedback Principle:** How to capture, summarize, and report user feedback observed during interaction.
    *   **Scope Principle:** How to identify, challenge, and report scope creep or necessary out-of-scope work.
    *   **Completion Principle:** Reinforces using the standard completion template.
*   **Mode Refinement (`mode-refiner` 🛠️):**
    *   A **meta-mode** invoked *manually* by the user.
    *   Takes structured feedback about a target mode's suboptimal performance.
    *   Analyzes the target mode's instruction files (`.roo/rules-{target_mode_slug}/*.md`).
    *   Suggests modifications (diffs) to the instructions to address the feedback, potentially referencing/injecting calls to the Common Principles.
    *   Requires user confirmation before applying changes (initially applied manually by user, potential for automation later).
*   **User Confirmation Loops:** Planning modes (`product-planner`, `project-epic-generator`, `epic-story-generator`) incorporate mandatory steps to present proposed plans (Projects, Epics, Stories) to the user for review and confirmation *before* generating final artifacts or proceeding. `mode-refiner` also requires confirmation for instruction changes.

**Potential Future: Automated Refinement Loop**

*   The structured feedback reported via `attempt_completion` (using the template) by *any* mode could theoretically be captured by an orchestrator (like `story-workflow-manager` or even a higher-level one).
*   If significant negative feedback about a mode's performance is detected, the orchestrator could *automatically* trigger the `mode-refiner` mode, passing the captured feedback to attempt self-improvement of the poorly performing mode's instructions. This remains an advanced concept requiring careful implementation and likely user oversight.

---

This summary should provide a clear overview of the system architecture we've designed. Let me know if you'd like any part elaborated further!