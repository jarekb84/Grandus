# Architect Planner: Story Planning Process (Mode B)

**Trigger:** Input is a single, specific User Story definition file. (Received via `new_task` message).

**Goal:** Create a detailed, actionable technical plan, ensuring feasibility, adherence to standards, and identifying specific code changes, **grounded in analysis evaluated against architectural principles (`05-architecture-patterns.md`) and directory structures (`06-directory-structure.md`)**. Conclude using `attempt_completion`.

## Process Steps:

1.  **Deep Dive into Story Requirements:**
    *   Analyze the User Story definition received in the task message: acceptance criteria, goals, constraints, referenced designs, etc.
    *   Clarify any ambiguities; if necessary, state assumptions made.

2.  **Code Discovery & Analysis (Repeat Targeted Discovery + Reference Analysis):**
    *   **Perform the multi-phase discovery process outlined in `04-code-analysis-standards.md`** focused on the specific functionality of *this story*. This ensures the plan uses the latest code state.
    *   **Phase 1: Initial Target Identification:** Use keywords from the story and directory structure conventions (guided by `06-directory-structure.md`). Use `list_files` if needed for orientation. Optionally use `list_code_definition_names` on likely target directories for a quick definition overview. Identify the primary target files/modules for *this specific story*.
    *   **Phase 2: Primary Target Analysis:** Use `read_file` to analyze the content of these primary files. Understand their internal logic, structure, and identify the key symbols involved or modified by this story. Use `list_code_definition_names` output (if run) to aid symbol identification.
    *   **Phase 3: Cross-Codebase Reference Search:** Use `search_files` to find files that **import or reference** the key symbols identified in Phase 2 relevant to this story's changes. Define appropriate `regex` and `path`.
    *   **Phase 4: Reference Context Analysis:** For each significant referencing file found in Phase 3 relevant to this story's changes: Use `read_file` to **READ and ANALYZE its content.** Understand **HOW** the symbol is used, **WHAT OTHER RESPONSIBILITIES** the file handles, and **evaluate usage context against principles like SRP** from `05-architecture-patterns.md`. Note violations.
    *   **Phase 5: Synthesis:** Combine insights from Phase 2 and Phase 4 specific to this story. Form a clear picture of the immediate code context, including relevant interactions, dependencies, and **adherence to architectural principles**, confirmed by reading the code.

3.  **Apply Architectural & Coding Standards:**
    *   Use `read_file` to consult *your specific rules*: `05-architecture-patterns.md` (principles), `06-directory-structure.md` (organization), relevant strategic docs (`./docs/`), general rules (`.roo/rules/`).
    *   Determine *how* the implementation *must* adhere to these applicable standards and patterns within the scope of this story, based on the synthesized, principle-evaluated understanding from Step 2.
    *   Explicitly note where the implementation needs to follow a specific pattern or guideline within the context of the discovered code.

4.  **Identify Necessary Refactoring:**
    *   Based on the detailed code analysis (Step 2, including principle evaluation in Phase 4/5) and standards requirements (Step 3), identify any *specific* refactoring required (potentially to address principle violations before implementing the story).

5.  **Define Implementation Plan:**
    *   Outline the step-by-step technical tasks required for the code changes.
    *   Specify *which* files to create or modify (guided by `06-directory-structure.md`, including primary targets and potentially referencing files identified in Step 2).
    *   Detail *what* changes are needed (e.g., new functions/methods, modifications to existing ones, class structure changes), ensuring they align with principles from `05-architecture-patterns.md`. Consider the impact on referenced code based on Phase 4 analysis.
    *   Define necessary configuration changes.

6.  **Consider Dependencies & Integration:**
    *   Based on the synthesis in Step 2, detail how this change will integrate with other parts of the system, specifically the components identified and analyzed through reference analysis.
    *   Note any upstream or downstream impacts confirmed through analysis.
    *   List any new library dependencies required.

7.  **(Optional) Estimate Complexity:**
    *   Provide a rough estimate of technical complexity (e.g., Low, Medium, High) based on the scope of changes identified across all analyzed files (primary and referencing).
    *   Prepare the final Markdown technical plan summarizing all findings and steps.

8.  **Signal Completion:**
    *   Summarize any relevant user feedback observed during the process, adhering to the **Feedback Principle** in `00-common-mode-principles.md`.
    *   Package the entire generated Markdown technical plan (containing analysis summary, code discovery summary including principle evaluation, refactoring, steps, compliance, testing guidance, dependencies, complexity estimate), formatted as described in the internal note below, into the `<report>` tag of the standard `attempt_completion` XML structure.
    *   Determine the final status signal (`PLAN_GENERATED_READY`, `PLAN_GENERATED_NEEDS_REFACTORING_FIRST`, `PLAN_BLOCKED_NEEDS_CLARIFICATION`, `STORY_INFEASIBLE_AS_WRITTEN`) to be used in the `<summary>` tag.
    *   **Call the `attempt_completion` tool.** Construct the payload strictly following the XML structure defined in `99-completion-template.md`. Include the status signal in the `<summary>`, the Markdown report in the `<report>`, and any summarized user feedback in the `<userFeedback>` section.

## (Internal Note: Format for the Markdown content within the `<report>` tag)

The Markdown report generated and placed inside the `"report"` key of the `attempt_completion` result should follow this structure:

```markdown
## Technical Plan: [User Story Title/ID]

### 1. Story Analysis Summary:
*   [Brief summary of technical requirements]
*   [Any assumptions made]

### 2. Code Discovery & Analysis Summary (Story Scope):
*   **Phase 1 (Primary Target):** [List primary files/modules identified, mention if `list_code_definition_names` used]
*   **Phase 2 (Primary Analysis):** [Summarize key findings within primary files via `read_file`, identify key symbols involved]
*   **Phase 3 (Reference Search):** [List files found via `search_files` referencing key symbols relevant to story changes]
*   **Phase 4 (Reference Analysis):** [Summarize how references impact/are impacted BY READING FILES via `read_file`, **explicitly mention adherence/violations of architectural principles like SRP** found in specific files.]
*   **Phase 5 (Synthesis):** [Summarize the current state relevant to implementing this story, including interactions confirmed by reading, **noting alignment with principles**.]

### 3. Required Refactoring (If Any):
*   [List specific, localized refactoring tasks based on Step 2 findings, potentially including those needed to fix principle violations found.]
*   *(If none, state "None identified")*

### 4. Implementation Steps:
*   **Task 1:** [e.g., Modify file X adhering to pattern Y from `05-architecture-patterns.md`...]
*   **Task 2:** [e.g., Modify file Y: Description of change...]
*   *(Break down into logical, actionable steps, considering all impacted files and ensuring alignment with architectural principles.)*

### 5. Architectural & Standards Compliance:
*   [Note adherence to principles in `05..`, structure in `06..`, etc.]
*   [Highlight any necessary deviations and justification.]

### 6. Manual Testing Guidance:
*   [Provide brief pointers for manual verification, including impacts on areas using the changed code identified in Phase 4.]

### 7. Dependencies:
*   [List internal module dependencies, external service dependencies, new libraries needed based on analysis.]

### 8. (Optional) Complexity Estimate:
*   [e.g., Medium]