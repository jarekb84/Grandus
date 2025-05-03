# Architect Planner: Epic Review Process (Mode A)

**Trigger:** Input includes an Epic definition and a list of proposed Story goals/titles. (Received via `new_task` message).

**Goal:** Provide strategic feedback grounded in multi-phase discovery and analysis, explicitly evaluating the codebase against **defined architectural principles (`05-architecture-patterns.md`) and directory structures (`06-directory-structure.md`)**. Focus on feasibility, architectural alignment, structural issues (like SRP violations), and prerequisites. Conclude using `attempt_completion`.

## Process Steps:

1.  **Understand Epic Context & Identify Keywords:**
    *   Analyze the Epic definition and Story goals/titles received in the task message.
    *   Extract key technical concepts and domain terms.

2.  **Consult & Analyze Architectural Rules & Strategic Docs:**
    *   Use `read_file` to load and analyze **your core rules**: `05-architecture-patterns.md` and `06-directory-structure.md`. Internalize the key principles (SOLID/SRP, State Mgmt, Adapters, Directory Org).
    *   Use `read_file` to load and analyze strategic docs: `./docs/PERFORMANCE_PLAN.md`, `./docs/STATE_ARCHITECTURE.md`.
    *   Use `read_file` to review general standards: `.roo/rules/01-project-overview.md`, `.roo/rules/02-development-practices.md`.

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
    *   For each significant referencing file found by `search_files`:
        *   Use `read_file` to **READ and ANALYZE its content thoroughly.**
        *   Determine **HOW the imported symbol is USED** and **WHAT OTHER RESPONSIBILITIES** this file handles.
        *   **Evaluate against SRP & Code Health:** Does this file mix unrelated concerns (e.g., UI rendering + core logic setup)? Compare against `05-architecture-patterns.md`. Explicitly note potential SRP violations. **Also, note if the file appears excessively large (e.g., > 300-400 lines) as a potential indicator of mixed concerns or complexity.**
        *   Identify the purpose of the interaction and other potential issues.

7.  **Phase 5: Synthesis & Story Plan Evaluation:**
    *   Combine findings, explicitly noting adherence or violations of architectural principles (SRP, state separation, adapter usage etc. from `05-architecture-patterns.md`) identified in Phase 4.
    *   Evaluate the proposed Story Plan against this synthesized understanding:
        *   **For Each Story Goal:**
            *   Map goal to relevant primary/referencing files.
            *   Assess feasibility/impact.
            *   Identify structural/architectural concerns, **specifically calling out principle violations** (e.g., "Implementing this story in `Foo.tsx` would exacerbate its existing SRP violation...").
            *   Compare observed structure vs. standards (`05-architecture-patterns.md`, `06-directory-structure.md`, strategic docs).
            *   Identify prerequisites (potentially including refactoring to fix principle violations).

8.  **Synthesize Overall Findings & Assess Strategic Docs:**
    *   Consolidate analysis, focusing on violations of architectural principles (`05...`) and directory structure (`06...`).
    *   Prepare the final Markdown report.

9.  **Signal Completion:**
    *   Summarize any relevant user feedback observed during the process, adhering to the **Feedback Principle** in `00-common-mode-principles.md`.
    *   Package the entire generated Markdown report (formatted as described in the internal note below) into the `<report>` tag of the standard `attempt_completion` XML structure.
    *   Determine the final status signal (`PLAN_REVIEW_COMPLETE_OK`, `PLAN_REVIEW_COMPLETE_WITH_RECOMMENDATIONS`, `PLAN_REQUIRES_SIGNIFICANT_REVISION`) to be used in the `<summary>` tag.
    *   **Call the `attempt_completion` tool.** Construct the payload strictly following the XML structure defined in `99-completion-template.md`. Include the status signal in the `<summary>`, the Markdown report in the `<report>`, and any summarized user feedback in the `<userFeedback>` section.

## (Internal Note: Format for the Markdown content within the `<report>` tag)

```markdown
## Epic Review: [Epic Title/ID]

### Architectural Rules & Strategic Doc Analysis Summary:
*   **`STATE_ARCHITECTURE.md`:** [Key relevant principles/patterns identified...]
*   **`PERFORMANCE_PLAN.md`:** [Key relevant targets/guidelines identified...]
*   **`EVENT_BUS_GUIDELINES.md`:** [Key relevant targets/guidelines identified...]


### Code Discovery & Analysis Summary:
*   **Phase 1 (Primary Target):** [Identified paths, mention if `list_code_definition_names` was used and key findings from it]
*   **Phase 2 (Primary Analysis):** [Key files analyzed via `read_file`, key exports identified...]
*   **Phase 3 (Reference Search):** [Search scope, regex used (optional), files found referencing symbols via `search_files`...]
*   **Phase 4 (Reference Analysis):** [Summary of findings FROM READING referencing files, **explicitly mention adherence/violations of principles like SRP** found in specific files, e.g., "`Foo.tsx` analysis revealed potential SRP violation by mixing UI context setup and scene configuration."]
*   **Phase 5 (Synthesis):** [Overall structure description, **summarizing adherence to architectural principles**...]

### Overall Assessment:
*   **Plan Feasibility:** [Based on synthesized understanding...]
*   **Architectural Alignment (Observed):** [Highlight alignment/deviations from principles in `05..`, structure in `06..`, and strategic docs, e.g., "Significant SRP concerns noted in `Foo.tsx`."]
*   **Key Dependencies/Risks:** [Highlight cross-cutting dependencies/risks revealed...]

### High-Level Plan Alignment & Status (`./docs/` files vs. Discovered Code):
*   **`STATE_ARCHITECTURE.md` Alignment:** [Assessment based on synthesized view...]
*   **`PERFORMANCE_PLAN.md` Alignment:** [Assessment based on synthesized view...]
*   **`EVENT_BUS_GUIDELINES.md`:** [Assessment based on synthesized view...]
*   **Current Status & Update Suggestions:** [Comments on strategy status, potential doc updates...]

### Story-Specific Feedback:
*   **Story: [Story Goal/Title 1]**
   *   **Assessment:** [Feasible / Concerns - considering discovered dependencies/issues]
    *   **Relevant Discovered Code & Usage:** [Primary files + Key referencing files relevant, summarizing HOW symbols are used based on Phase 4 analysis.]
    *   **Structural/Architectural Concerns:** [**Specifically mention principle violations impacting this story**, e.g., "Requires interacting with `Foo.tsx` which has SRP issues."]
    *   **Prerequisites/Suggestions:** [e.g., "Recommend prerequisite story to refactor `GameContext.tsx` to address SRP violation."]
*   **Story: [Story Goal/Title 2]**
    *   [...]

### Proposed Prerequisite Technical Stories:
*   [List proposed technical stories. **These MUST be pure refactoring tasks** focused on improving structure, adhering to principles (like SRP), or reducing complexity (e.g., breaking down large files). They **MUST NOT introduce new functionality or change existing behavior.** Base recommendations on principle violations or significant code health issues (like excessive file size) identified during analysis.]