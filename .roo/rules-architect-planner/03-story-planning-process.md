# Architect Planner: Story Planning Process (Mode B)

**Trigger:** Input is a single, specific User Story definition file. (Received via `new_task` message).

**Goal:** Create a detailed, actionable technical plan, ensuring feasibility, adherence to standards, and identifying specific code changes, **grounded in analysis evaluated against architectural principles (`05-architecture-patterns.md`) and directory structures (`06-directory-structure.md`)**. Conclude using `attempt_completion`.

## Process Overview:
This process is divided into two distinct phases:
* **Phase 1 (Steps 1-5):** Analysis, option identification, and user consensus
* **Phase 2 (Steps 6-10):** Detailed planning for the approved implementation option

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
    *   **Phase 5: Synthesis:** Combine insights from Phase 2 and Phase 4 specific to this story. Form a clear picture of the immediate code context, including relevant interactions, dependencies, and **adherence to architectural principles (including Functional Design & Testability)**, confirmed by reading the code.

3.  **Apply Architectural & Coding Standards:**
    *   Use `read_file` to consult *your specific rules*: `05-architecture-patterns.md` (principles like SOLID, **Functional Design & Testability**, State Separation), `06-directory-structure.md` (organization), relevant strategic docs (`./docs/`), general rules (`.roo/rules/`).
    *   Determine *how* the implementation *must* adhere to these applicable standards and patterns (especially regarding **testability, coupling, and function signatures**) within the scope of this story, based on the synthesized, principle-evaluated understanding from Step 2.
    *   Explicitly note where the implementation needs to follow a specific pattern or guideline within the context of the discovered code.

4.  **Analyze Implementation Options:**
    *   Based on the code discovery (Step 2) and architectural standards (Step 3), identify 2-3 distinct technical approaches or options for implementing the User Story.
    *   For each option, clearly articulate:
        *   Key characteristics and approach.
        *   Potential benefits (Pros).
        *   Potential drawbacks (Cons).
        *   Key tradeoffs involved (e.g., development effort, performance impact, maintainability, **testability, coupling**, adherence to patterns).
    *   Select a recommended option based on the analysis, justifying the choice against architectural principles (including **Functional Design & Testability**), project goals, and the identified tradeoffs.

5.  **Present Options & Get User Consensus:**
    *   Package the analysis summary, code discovery summary, and implementation options analysis into a concise report.
    *   Present this initial report to the user using the `attempt_completion` tool with a status signal of `IMPLEMENTATION_OPTIONS_FOR_REVIEW`.
    *   Explicitly ask the user to:
        *   Review the identified options and their tradeoffs
        *   Approve the recommended option, select an alternative option, or provide additional context/requirements
        *   Engage in discussion about the architectural approaches before proceeding
    *   Wait for user feedback and confirmation before proceeding to Phase 2.
    *   Document the selected option and any additional context/requirements provided by the user to inform the detailed planning phase.
    *   **Note:** This step creates a checkpoint for user input before detailed planning begins, ensuring alignment on the architectural approach.

### Phase 2: Detailed Planning for Approved Option

6.  **Identify Necessary Refactoring:**
    *   Based on the detailed code analysis (Step 2, including principle evaluation in Phase 4/5), standards requirements (Step 3), and the user-approved implementation option, identify any *specific* refactoring required (potentially to address principle violations before implementing the story).

7.  **Define Implementation Plan:**
    *   Outline the step-by-step technical tasks required for the code changes **for the user-approved option from Step 5**.
    *   Specify *which* files to create or modify (guided by `06-directory-structure.md`, including primary targets and potentially referencing files identified in Step 2).
    *   Detail *what* changes are needed (e.g., new functions/methods, modifications to existing ones, class structure changes), ensuring they align with principles from `05-architecture-patterns.md`. **Specifically consider function signatures (preferring simple inputs) and plan for any necessary adapter/glue code.** Consider the impact on referenced code based on Phase 4 analysis.
    *   Define necessary configuration changes.
    *   **Refactoring Safety Protocol (Apply when tasks involve moving/refactoring existing code):**
        *   **Identify & List Call Sites:** Explicitly list *all* identified call sites (from Step 2, Phase 3/4 analysis) for the code being moved or refactored.
        *   **Document Current Behavior & Dependencies:** Briefly document the essential current behavior, inputs, outputs, side-effects, and state dependencies of the code being moved.
        *   **Plan Call Site Updates:** For *each* call site, provide explicit instructions on how it must be updated (e.g., change import path, adjust arguments, handle returned values differently).
        *   **Plan Dependency Injection:** Specify how necessary state or dependencies will be provided to the code in its new location (e.g., pass as arguments, import required stores/services).
        *   **Add Verification Task:** Include a specific task in the plan like: "Verify function `[New Function Name]` in file `[New File Path]` behaves identically to its previous implementation in `[Old File Path]` regarding inputs `[List Inputs]`, outputs/side-effects `[List Outputs/Effects]`. Test scenarios X, Y, Z."
        *   **Scope Constraint (Pure Refactoring Only):** If the story is *purely* for refactoring (no functional changes intended), explicitly state that the implementation must *not* introduce new logic, properties, or behavior not present in the original code.

8.  **Consider Dependencies & Integration:**
    *   Based on the synthesis in Step 2, detail how this change will integrate with other parts of the system, specifically the components identified and analyzed through reference analysis.
    *   Note any upstream or downstream impacts confirmed through analysis.
    *   List any new library dependencies required.

9.  **(Optional) Estimate Complexity:**
    *   Provide a rough estimate of technical complexity (e.g., Low, Medium, High) based on the scope of changes identified across all analyzed files (primary and referencing).
    *   Prepare the final Markdown technical plan summarizing all findings and steps.

10. **Present Final Technical Plan:**
    *   Summarize any relevant user feedback observed during the process, adhering to the **Feedback Principle** in `00-common-mode-principles.md`.
    *   Package the generated Markdown detailed technical plan (containing analysis summary, code discovery summary, the approved implementation option, refactoring, detailed implementation steps, compliance, testing guidance, dependencies, complexity estimate), formatted as described in the internal note below, into the `<report>` tag of the standard `attempt_completion` XML structure.
    *   Determine the final status signal (e.g., `DETAILED_PLAN_GENERATED_READY`, `PLAN_BLOCKED_NEEDS_CLARIFICATION`, `STORY_INFEASIBLE_AS_WRITTEN`) to be used in the `<summary>` tag.
    *   **Call the `attempt_completion` tool.** Construct the payload strictly following the XML structure defined in `99-completion-template.md`. Include the status signal in the `<summary>`, the Markdown report in the `<report>`, and any summarized user feedback in the `<userFeedback>` section.

## (Internal Note: Report Formats for Phase 1 and Phase 2)

### Phase 1 Report Format (Step 5: Present Options & Get User Consensus)

The Markdown report for Phase 1, presenting implementation options for user review, should follow this structure:

```markdown
## Implementation Options: [User Story Title/ID]

### 1. Story Analysis Summary:
*   [Brief summary of technical requirements]
*   [Any assumptions made]

### 2. Code Discovery & Analysis Summary:
*   **Key Affected Components:** [List primary files/modules that will be affected]
*   **Current Architecture:** [Summarize relevant existing architecture patterns and structures]
*   **Technical Context:** [Highlight key insights from code analysis relevant to implementation decisions]

### 3. Implementation Options Analysis:
*   **Option 1: [Brief Name]**
    *   Approach: [Describe the technical approach]
    *   Pros: [List benefits]
    *   Cons: [List drawbacks]
    *   Tradeoffs: [Describe key tradeoffs]
*   **Option 2: [Brief Name]**
    *   Approach: [Describe the technical approach]
    *   Pros: [List benefits]
    *   Cons: [List drawbacks]
    *   Tradeoffs: [Describe key tradeoffs]
*   *(Add Option 3 if applicable)*

### 4. Recommended Option:
*   **Recommendation:** [State the recommended option number/name]
*   **Rationale:** [Justify the recommendation based on analysis, principles, and tradeoffs]

### 5. Next Steps:
*   Upon approval of an implementation approach, a detailed technical plan will be developed including specific refactoring needs, implementation steps, testing guidance, and dependencies.
*   **Please review the options and respond with:**
    *   Approval of the recommended option, or
    *   Selection of an alternative option, or
    *   Request for additional information/context about the options
```

### Phase 2 Report Format (Step 10: Present Final Technical Plan)

The Markdown report for Phase 2, presenting the detailed technical plan for the approved option, should follow this structure:

```markdown
## Detailed Technical Plan: [User Story Title/ID]

### 1. Approved Implementation Approach:
*   **Selected Option:** [Name of the user-approved option]
*   **Key Characteristics:** [Brief recap of the selected approach]
*   **User Feedback:** [Summarize any additional context/requirements provided by the user during option review]

### 2. Required Refactoring:
*   [List specific, localized refactoring tasks required before implementation]
*   *(If none, state "None identified")*

### 3. Detailed Implementation Steps:
*   *(If applicable, include Refactoring Safety details here or reference them clearly)*
*   **Task 1:** [e.g., Refactor function Z from file A to file B, ensuring behavior preservation as per Refactoring Safety Protocol]
    *   [Details: Implement function Z in file B]
    *   [Details: Update call site in file C: change import, adjust arguments...]
    *   [Details: Update call site in file D: change import...]
    *   [Files affected: file A, file B, file C, file D]
    *   [Acceptance criteria: Function Z operates correctly from file B, call sites updated]
*   **Task 2:** [e.g., Implement new feature X using refactored function Z]
    *   [Specific details about implementation]
    *   [Files to create/modify]
    *   [Acceptance criteria for this task]
*   **Task 3:** [Verification Task - Example]
    *   Verify function `newFunctionName` in `src/features/new/module.ts` behaves identically to its previous implementation in `src/features/old/utils.ts` regarding inputs `(data: string, count: number)` and side-effects `(updates sharedState.value)`. Manually test by clicking the 'Process' button and observing the state update in the console.
*   *(Break down into comprehensive, actionable steps with sufficient detail for implementation)*

### 4. Architectural & Standards Compliance:
*   [Note how the implementation adheres to principles in `05..` (SOLID, **Functional Design/Testability**, State Separation), structure in `06..`, etc.]
*   [Highlight any necessary deviations and justification]

### 5. Testing Guidance:
*   **Unit Tests:** [Specific areas requiring unit tests]
*   **Integration Tests:** [Integration points to test]
*   **Manual Verification:** [Steps for manual verification]

### 6. Dependencies & Integration Points:
*   **Module Dependencies:** [List internal module dependencies]
*   **External Dependencies:** [List external service dependencies]
*   **New Libraries:** [List any new libraries needed]

### 7. Complexity Estimate:
*   **Overall Complexity:** [e.g., Medium]
*   **Estimated Effort:** [Rough estimate of implementation effort]
```