# Architect Planner: Code Analysis & Standards Application

This document outlines *how* you should approach analyzing the codebase and applying architectural/coding standards. **Actively discovering and analyzing relevant code, including cross-directory dependencies by READING file contents using provided tools, and EVALUATING against architectural principles, is mandatory.**

## 1. Code Analysis Approach: Targeted Discovery + Reference Analysis

*   **Goal:** Build a comprehensive understanding of the relevant code sections, including their internal structure, how they connect to other parts of the system, and **how they adhere to defined architectural principles (like SOLID, SRP)**.
*   **Mechanism:** You **must** perform a multi-phase analysis:
    1.  **Phase 1: Initial Target Identification:**
        *   Analyze Epic/Story goals for keywords and concepts.
        *   Use directory structure conventions (defined in `06-directory-structure.md`) and potentially `list_files` for orientation.
        *   Optionally use `list_code_definition_names` for a quick scan of key directories.
        *   Identify primary target directory/files.
    2.  **Phase 2: Primary Target Analysis:**
        *   Use `read_file` to analyze the content of key primary files.
        *   Understand their internal logic, structure, and primary responsibility.
        *   Identify key exported symbols.
    3.  **Phase 3: Cross-Codebase Reference Search:**
        *   Use `search_files` to find references to key symbols across the codebase.
    4.  **Phase 4: Reference Context Analysis:**
        *   For each significant referencing file identified by `search_files`:
            *   Use `read_file` to **READ and ANALYZE its content thoroughly.**
            *   Understand **HOW the imported symbol is USED.**
            *   Identify the *purpose* of the reference and the *actions performed within this file*.
            *   **Crucially, evaluate if this file handles multiple, unrelated concerns.** Compare its observed responsibilities against the **Single Responsibility Principle (SRP)** defined in `05-architecture-patterns.md`. Note potential violations.
            *   Note other issues revealed by usage (coupling, misplaced logic etc.).
    5.  **Phase 5: Synthesis:**
        *   Combine insights from Phase 2 and Phase 4.
        *   Form a holistic view of the implementation, its connections, and its **adherence to architectural principles** (SOLID, state management rules, communication patterns from `05-architecture-patterns.md`). Explicitly call out identified violations or concerns (like SRP issues found in Phase 4).
*   **Scope & Application:** Apply this 5-phase process in both modes. **Phase 4 and 5 MUST include evaluation against the architectural principles** defined in your rules files (`05-architecture-patterns.md`, etc.).
*   **What to Look For:** [Previous list + Explicitly look for violations of SOLID principles, especially SRP, by examining the combination of tasks performed within individual files analyzed in Phase 4].
*   **Reporting:** Report on adherence to architectural principles, specifically mentioning violations like potential SRP issues identified during Phase 4/5 analysis.

## 2. Standards Application Approach

*   **Goal:** Ensure alignment with standards/strategies, **grounded in the discovered reality** of the code and explicitly evaluated against
*   **Locating Standards:**
    *   `05-architecture-patterns.md` (Core principles, state, communication)
    *   `06-directory-structure.md` (Where files/features live)
    *   Strategic Docs: `./docs/PERFORMANCE_PLAN.md`, `./docs/STATE_ARCHITECTURE.md`.
    *   General Rules: `.roo/rules/01-project-overview.md`, `.roo/rules/02-development-practices.md`.
*   **Application Logic:** Apply standards based on the synthesized understanding. **Explicitly evaluate** against SOLID/SRP, state management rules, communication patterns, and directory structure defined in *your* ruleset.
*   **Explicit Referencing & Deviations:** Cite evidence from `read_file` analysis when identifying deviations from architectural principles or directory structure rules.