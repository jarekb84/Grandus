# Architect Planner: Code Analysis & Standards Application

This document outlines *how* you should approach analyzing the codebase and applying architectural/coding standards. **Actively discovering and analyzing relevant code, including cross-directory dependencies by READING file contents using provided tools, is mandatory.**

## 1. Code Analysis Approach: Targeted Discovery + Reference Analysis

*   **Goal:** Build a comprehensive understanding of the relevant code sections, including their internal structure and how they connect to other parts of the system (e.g., shared utilities, adapters in other features), by analyzing actual code implementations using `read_file`, `search_files`, `list_files`, and potentially `list_code_definition_names`.
*   **Mechanism:** You **must** perform a multi-phase analysis:
    1.  **Phase 1: Initial Target Identification:**
        *   Analyze Epic/Story goals for keywords and concepts.
        *   Use directory structure conventions and potentially `list_files` (with `path` set to `src` or relevant subdirectories, `recursive` potentially `true` initially) for orientation and identifying promising subdirectories.
        *   **Optional Quick Scan:** If a specific directory seems highly relevant (e.g., `src/features/feature-x`), consider using `list_code_definition_names` with the `path` set to that directory. This provides a quick overview of top-level definitions (classes, functions, etc.) within that directory, helping to identify key files or components without reading everything immediately.
        *   Based on the above, identify the primary directory/files most likely containing the core logic.
    2.  **Phase 2: Primary Target Analysis:**
        *   Use the `read_file` tool (specifying the `path` for each target file) to analyze the full content of the key files identified in Phase 1. Rely on `read_file`'s truncation or use line ranges for very large files.
        *   Understand their internal logic, structure, and responsibilities.
        *   **Identify key exported symbols** (classes, functions, types, variables). The output from `list_code_definition_names` (if used in Phase 1) can directly help identify these symbols and their definitions. If not used, identify them by analyzing the file content read via `read_file`.
    3.  **Phase 3: Cross-Codebase Reference Search:**
        *   **Crucial Step:** For key exported symbols from Phase 2, use the `search_files` tool.
            *   Set the `path` parameter to the appropriate search scope (e.g., `src` or `.`).
            *   Construct a precise `regex` (Rust syntax) to find import statements or usage patterns of these symbols.
            *   Optionally use `file_pattern`.
        *   Extract the file paths and line numbers of relevant matches from the `search_files` output.
    4.  **Phase 4: Reference Context Analysis:**
        *   For each significant referencing file identified by `search_files`:
            *   Use the `read_file` tool (specifying the `path`). **Read the full file content** to understand the complete context.
            *   **Analyze the content to understand HOW the imported symbol is USED.**
            *   Identify the *purpose* of the reference.
            *   Note any potential issues revealed by this usage.
    5.  **Phase 5: Synthesis:** Combine the insights from the primary target analysis (Phase 2, potentially informed by Phase 1's `list_code_definition_names`) and the detailed usage context from the reference analysis (Phase 4) to form a holistic view.
*   **Scope & Application:** Apply this 5-phase process in both Epic Review and Story Planning, adjusting focus/depth. Use `list_code_definition_names` judiciously in Phase 1/2 when a quick structural overview of a specific directory is beneficial. Always perform the reference checks (Phase 3 & 4) including reading file contents via `read_file`.
*   **What to Look For (Across Phases):** [Content remains the same as previous version]
*   **Reporting:** Clearly state which files were analyzed using `read_file`, `search_files`, and potentially `list_code_definition_names`. Summarize the *specific findings from reading the content* in Phase 4.

## 2. Standards Application Approach

*   **Goal:** Ensure alignment with standards/strategies, **grounded in the discovered reality** of the code and its cross-cutting dependencies, verified by reading file contents using `read_file`.
*   **Locating Standards:** Use `read_file` to access standards documents:
    *   General Development Practices: `.roo/rules/01-project-overview.md`, `.roo/rules/02-development-practices.md`.
    *   High-Level Strategic Plans: `./docs/PERFORMANCE_PLAN.md`, `./docs/STATE_ARCHITECTURE.md`. (Consult deeply during Epic Review).
    *   Other specific documents referenced.
*   **Application Logic:** Apply standards based on the synthesized understanding from the full discovery process (Phase 5). Evaluate patterns or rules considering interactions revealed by **reading and analyzing** referencing files (Phase 4).
*   **Explicit Referencing & Deviations:** Relate recommendations to the observed structure across relevant files discovered through the process, citing evidence found within the code read via `read_file`.

## 3. Guiding Principles

When analyzing and planning, always consider:
*   **Maintainability:** Will the proposed changes be easy to understand, modify, and debug?
*   **Scalability:** Can the solution handle expected load and future growth (informed by strategic plans)?
*   **Reliability:** Does the plan account for error handling and resilience?
*   **Security:** Are security best practices being followed?
*   **Performance:** Does the plan consider performance implications (guided by `PERFORMANCE_PLAN.md` at Epic level, and best practices at Story level)?
*   **Consistency:** Does the plan promote consistency with existing architecture and defined patterns?
Evaluate these against the **discovered, analyzed, and synthesized code** context.