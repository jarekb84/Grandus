# Architect Planner: Epic Review Process (Mode A)

**Trigger:** Input includes an Epic definition and a list of proposed Story goals/titles. (Received via `new_task` message).

**Goal:** Provide strategic feedback grounded in **proactive, multi-phase discovery and analysis of the codebase**, including primary feature areas and their cross-directory dependencies/references identified by **reading file contents**. Focus on feasibility, architectural alignment (documented vs. observed), structural issues, and prerequisites. Conclude by using `attempt_completion`.

## Process Steps:

1.  **Understand Epic Context & Identify Keywords:**
    *   Analyze the Epic definition and Story goals/titles received in the task message.
    *   Extract key technical concepts and domain terms.

2.  **Consult & Analyze Strategic Documents:**
    *   Use `read_file` to retrieve, **READ, and thoroughly ANALYZE** the content of high-level strategic documents: `./docs/PERFORMANCE_PLAN.md` and `./docs/STATE_ARCHITECTURE.md`. Understand the documented goals, patterns, and targets.
    *   Use `read_file` to review general development standards: `.roo/rules/01-project-overview.md`, `.roo/rules/02-development-practices.md`.

3.  **Phase 1: Initial Target Identification:**
    *   Use keywords and conventions (and potentially `list_files` on `src` or relevant subdirs if needed for orientation) to identify promising primary directories (e.g., `src/features/feature-name/`).
    *   **Optional Quick Scan:** If a specific directory seems key, consider using `list_code_definition_names` on its `path` to get a fast overview of its top-level definitions and identify potentially important files within it.
    *   Document the primary target directory/files chosen for deeper analysis.

4.  **Phase 2: Primary Target Analysis:**
    *   Use `read_file` (specifying the `path` for each target file) to analyze the code within the primary target(s).
    *   Identify key logic, structure, and **exported symbols**. Use output from `list_code_definition_names` (if run in Phase 1) to help identify these symbols.

5.  **Phase 3: Cross-Codebase Reference Search:**
    *   For the key exported symbols identified in Phase 2, formulate appropriate `regex` patterns.
    *   Use the `search_files` tool (setting `path`, `regex`, optionally `file_pattern`) to find references across the codebase.
    *   List the referencing files found from the output.

6.  **Phase 4: Reference Context Analysis:**
    *   For each significant referencing file identified by `search_files`:
        *   Use `read_file` (specifying the `path`) to **READ and ANALYZE its content thoroughly.**
        *   Determine **HOW the imported symbol is USED** within this file.
        *   Identify the **purpose** of this interaction.
        *   **Explicitly look for unexpected interactions or misplaced responsibilities.** Note potential architectural smells.

7.  **Phase 5: Synthesis & Story Plan Evaluation:**
    *   Combine findings from Phase 2 (potentially informed by Phase 1's `list_code_definition_names`) and the detailed usage context from Phase 4 to create a holistic understanding.
    *   **Evaluate the proposed Story Plan against this synthesized understanding:**
        *   **For Each Story Goal:**
            *   Map the goal to the relevant primary files AND any significant referencing files where usage was analyzed.
            *   Assess feasibility/impact considering the *full picture*.
            *   Identify structural/architectural concerns based on the combined analysis.
            *   Compare the observed structure with documented standards/patterns.
            *   Identify prerequisites based on the *holistic view*.

8.  **Synthesize Overall Findings & Assess Strategic Docs:**
    *   Consolidate analysis, focusing on cross-cutting issues and architectural smells revealed by detailed Phase 4 analysis.
    *   Re-evaluate `./docs/` plans based on the **synthesized reality of the code**.
    *   Prepare the final Markdown report summarizing all findings.

9.  **Signal Completion:**
    *   Package the entire generated Markdown report into a single string variable.
    *   Determine the final status signal (`PLAN_REVIEW_COMPLETE_OK`, `PLAN_REVIEW_COMPLETE_WITH_RECOMMENDATIONS`, `PLAN_REQUIRES_SIGNIFICANT_REVISION`).
    *   **Call the `attempt_completion` tool.** Set the `result` parameter to a JSON string containing the status signal and the full Markdown report (using the format specified in the internal note below).

## (Internal Note: Output Format for Markdown Report within `attempt_completion`)

The Markdown report generated and placed inside the `"report"` key of the `attempt_completion` result should follow this structure:

```markdown
## Epic Review: [Epic Title/ID]

### Strategic Document Analysis Summary:
*   **`STATE_ARCHITECTURE.md`:** [Key relevant principles/patterns identified...]
*   **`PERFORMANCE_PLAN.md`:** [Key relevant targets/guidelines identified...]

### Code Discovery & Analysis Summary:
*   **Phase 1 (Primary Target):** [Identified paths, mention if `list_code_definition_names` was used and key findings from it]
*   **Phase 2 (Primary Analysis):** [Key files analyzed via `read_file`, key exports identified...]
*   **Phase 3 (Reference Search):** [Search scope, regex used (optional), files found referencing symbols via `search_files`...]
*   **Phase 4 (Reference Analysis):** [Summary of findings FROM READING referencing files via `read_file`, e.g., purpose of reference, issues found...]
*   **Phase 5 (Synthesis):** [Overall structure description based on combined findings...]

### Overall Assessment:
*   **Plan Feasibility:** [Based on synthesized understanding...]
*   **Architectural Alignment (Observed):** [Based on synthesized understanding vs. docs/rules, highlighting specific deviations found...]
*   **Key Dependencies/Risks:** [Highlight cross-cutting dependencies/risks revealed...]

### High-Level Plan Alignment & Status (`./docs/` files vs. Discovered Code):
*   **`STATE_ARCHITECTURE.md` Alignment:** [Assessment based on synthesized view...]
*   **`PERFORMANCE_PLAN.md` Alignment:** [Assessment based on synthesized view...]
*   **Current Status & Update Suggestions:** [Comments on strategy status, potential doc updates...]

### Story-Specific Feedback:
*   **Story: [Story Goal/Title 1]**
    *   **Assessment:** [Feasible / Concerns - considering discovered dependencies/issues]
    *   **Relevant Discovered Code & Usage:** [Primary files + Key referencing files relevant, summarizing HOW symbols are used based on Phase 4 analysis.]
    *   **Structural/Architectural Concerns:** [Concerns arising from the interaction...]
    *   **Prerequisites/Suggestions:** [Prerequisites considering impacts...]
*   **Story: [Story Goal/Title 2]**
    *   [...]

### Proposed Prerequisite Technical Stories:
*   [List identified refactoring needs or state "None identified"]