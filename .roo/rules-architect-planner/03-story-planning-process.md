# Architect Planner: Story Planning Process (Mode B)

**Trigger:** Input is a single, specific User Story definition file. (Received via `new_task` message).

**Goal:** Create a detailed, actionable technical implementation plan, ensuring feasibility, adherence to standards, and identifying specific code changes, **grounded in an up-to-date analysis of the relevant code and its immediate dependencies/references, verified by reading file contents.** Conclude by using `attempt_completion`.

## Process Steps:

1.  **Deep Dive into Story Requirements:**
    *   Analyze the User Story definition received in the task message: acceptance criteria, goals, constraints, referenced designs, etc.
    *   Clarify any ambiguities; if necessary, state assumptions made.

2.  **Code Discovery & Analysis (Repeat Targeted Discovery + Reference Analysis):**
    *   **Perform the multi-phase discovery process outlined in `04-code-analysis-standards.md`** focused on the specific functionality of *this story*.
    *   **Phase 1: Initial Target Identification:** Use keywords from the story and conventions (and potentially `list_files`) to identify the primary target files/modules for *this specific story*. Optionally use `list_code_definition_names` on the target directory for a quick definition overview.
    *   **Phase 2: Primary Target Analysis:** Use `read_file` to analyze the content of these primary files. Understand their internal logic, structure, and identify the key symbols involved or modified by this story. Use `list_code_definition_names` output (if run) to aid symbol identification.
    *   **Phase 3: Cross-Codebase Reference Search:** Use `search_files` to find files that **import or reference** the key symbols identified in Phase 2 relevant to this story's changes. Define appropriate `regex` and `path`.
    *   **Phase 4: Reference Context Analysis:** For each significant referencing file found in Phase 3 relevant to this story's changes: Use `read_file` to **READ and ANALYZE its content.** Understand **HOW** the symbol is used and how the proposed changes will affect this usage.
    *   **Phase 5: Synthesis:** Combine insights from Phase 2 and Phase 4 specific to this story. Form a clear picture of the immediate code context, including relevant interactions and dependencies confirmed by reading the code.

3.  **Apply Architectural & Coding Standards:**
    *   Use `read_file` to consult the defined standards (general rules, relevant parts of strategic docs, etc.).
    *   Determine *how* the implementation *must* adhere to these standards based on the synthesized understanding from Step 2.
    *   Explicitly note where the implementation needs to follow a specific pattern or guideline.

4.  **Identify Necessary Refactoring:**
    *   Based on the detailed code analysis (Step 2, including Phase 4 findings) and standards requirements (Step 3), identify any *specific* refactoring required.

5.  **Define Implementation Plan:**
    *   Outline the step-by-step technical tasks.
    *   Specify *which* files to create or modify (including primary targets and potentially referencing files).
    *   Detail *what* changes are needed, considering the impact on referenced code based on Phase 4 analysis.
    *   Define necessary configuration changes.

6.  **Consider Dependencies & Integration:**
    *   Based on the synthesis in Step 2, detail integration points and impacts confirmed through analysis.
    *   List any new library dependencies required.

7.  **(Optional) Estimate Complexity:**
    *   Provide a rough estimate based on the scope identified across all analyzed files.
    *   Prepare the final Markdown technical plan.

8.  **Signal Completion:**
    *   Package the entire generated Markdown technical plan into a single string variable.
    *   Determine the final status signal (`PLAN_GENERATED_READY`, `PLAN_GENERATED_NEEDS_REFACTORING_FIRST`, `PLAN_BLOCKED_NEEDS_CLARIFICATION`, `STORY_INFEASIBLE_AS_WRITTEN`).
    *   **Call the `attempt_completion` tool.** Set the `result` parameter to a JSON string containing the status signal and the full Markdown report (using the format specified in the internal note below).

## (Internal Note: Output Format for Markdown Report within `attempt_completion`)

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
*   **Phase 4 (Reference Analysis):** [Summarize how references impact/are impacted BY READING FILES via `read_file`]
*   **Phase 5 (Synthesis):** [Summarize the current state relevant to implementing this story, including interactions confirmed by reading]

### 3. Required Refactoring (If Any):
*   [List specific, localized refactoring tasks based on Step 2 findings.]
*   *(If none, state "None identified")*

### 4. Implementation Steps:
*   **Task 1:** [e.g., Modify file X: Description of change...]
*   **Task 2:** [e.g., Modify file Y: Description of change...]
*   *(Break down into logical, actionable steps, considering all impacted files.)*

### 5. Architectural & Standards Compliance:
*   [Note how the plan adheres to specific standards/patterns within the discovered context.]
*   [Highlight any necessary deviations and justification.]

### 6. Manual Testing Guidance:
*   [Provide brief pointers for manual verification, including impacts on areas using the changed code.]

### 7. Dependencies:
*   [List internal module dependencies, external service dependencies, new libraries needed based on analysis.]

### 8. (Optional) Complexity Estimate:
*   [e.g., Medium]