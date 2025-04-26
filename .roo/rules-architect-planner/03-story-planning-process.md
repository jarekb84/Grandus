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
    *   **Define Tasks as Thin Vertical Slices:** Outline the step-by-step technical tasks required for the code changes **for the user-approved option from Step 5**. Crucially, each task MUST adhere to the following principles, **in alignment with the project's guidelines in `.roo/rules/02-development-practices.md`**:
        *   **Atomicity & Verticality:** Represent the *smallest possible* unit of change that delivers a verifiable piece of *integrated behavior* or refactoring.
        *   **Verifiability:** Result in a state where the application **compiles, builds, and runs without errors or regressions**. Each task must be independently testable/verifiable.
        *   **Layered Implementation:** Tasks must build upon each other sequentially. Task N+1 starts from the working state left by Task N.
        *   **Immediately Usable (No Dead Code):** Avoid introducing code (files, functions, classes, state) in one task that is only intended to be completed or *used* in a subsequent task. All code within a task must contribute directly to its verifiable behavioral outcome. **If new structures (like stores or services) are created, they must be integrated and used for at least one minimal piece of functionality within the SAME task.**
        *   **Strict Separation:** Tasks involving *only* refactoring (moving/restructuring existing code without changing behavior) MUST be separate from tasks introducing *new* functionality or behavior.
        *   **CRITICAL: Vertical Slice Validation:** For each task, explicitly verify it implements a complete vertical slice by asking:
            1. "Does this task create any files, classes, or services that aren't used within this same task?" If yes, restructure the task.
            2. "Does this task deliver a small but complete unit of behavior that can be observed in the running application?" If no, restructure the task.
            3. "Could the files created in this task be considered 'dead code' until a future task is implemented?" If yes, restructure the task.
    *   **Task Details:** For each task:
        *   Specify *which* files to create or modify (guided by `06-directory-structure.md`, including primary targets and potentially referencing files identified in Step 2).
        *   Detail *what* specific, minimal changes are needed (e.g., create file AND integrate, add function signature AND call site, implement minimal logic AND connect it), ensuring alignment with `05-architecture-patterns.md`. Consider function signatures and adapter code.
        *   Define necessary configuration changes for *that task*.
        *   Explicitly state the acceptance criteria, focusing on the *behavioral outcome* and including "Application compiles and runs without errors or regressions."
    *   **Refactoring Safety Protocol (Apply when tasks involve moving/refactoring existing code):**
        *   **Break Down Refactoring:** If refactoring is complex, break it down into multiple, sequential "thin vertical slice" tasks (e.g., Task 1: Create new file/structure, Task 2: Move function A, Task 3: Update call sites for A & Verify, Task 4: Move function B...).
        *   **Identify & List Call Sites:** For the specific code being moved *in a given task*, explicitly list the relevant call sites identified (from Step 2, Phase 3/4 analysis).
        *   **Document Current Behavior & Dependencies:** Briefly document the essential current behavior, inputs, outputs, side-effects, and state dependencies of the code being moved *in that task*.
        *   **Plan Call Site Updates:** For *each* relevant call site, provide explicit instructions on how it must be updated *within that task*.
        *   **Plan Dependency Injection:** Specify how necessary state or dependencies will be provided to the code in its new location *for that task*.
        *   **Add Verification Step:** Include specific verification steps *within the task's acceptance criteria* (e.g., "Verify function `[New Function Name]` in `[New File Path]` is callable and produces expected minimal output/effect. Verify call site in `[File X]` compiles and runs.").
        *   **Scope Constraint (Pure Refactoring Task):** Explicitly state within any refactoring task that it must *not* introduce new logic, properties, or behavior not present in the original code being moved/restructured in *that specific task*.

### Example: Horizontal vs. Vertical Task Slicing

**INCORRECT (Horizontal Slicing) - Resource System Refactoring Example:**
```
Task 1: Create ResourceNodeStore
- Create store file with state and actions
- Define types and interfaces
[No integration with existing code]

Task 2: Create ResourceNodeService
- Implement service that uses the store
- Define methods for node management
[No integration with existing code]

Task 3: Refactor ResourceSystem to use the service
- Modify ResourceSystem to use the new service
[First actual integration point]
```

This approach creates "horizontal slices" or "dead code" - files that aren't used until later tasks.

**CORRECT (Vertical Slicing) - Resource System Refactoring Example:**
```
Task 1: Implement Basic Node State Management
- Create minimal ResourceNodeStore with only essential state/actions
- Create minimal ResourceNodeService with only getNodeState/depleteNode methods
- Modify ResourceSystem to use these for a single behavior (e.g., node depletion)
- Update one gathering method to use the new system
- Verify the complete behavior works end-to-end

Task 2: Add Node Respawn Functionality
- Add respawn timer state to ResourceNodeStore
- Add respawn methods to ResourceNodeService
- Integrate respawn functionality into ResourceSystem
- Verify respawn behavior works end-to-end

Task 3: Refactor Node Availability Checks
- Add node availability methods to ResourceNodeService
- Update UI adapter to use these methods
- Verify availability checks work end-to-end
```

This approach creates "vertical slices" where each task delivers complete, working functionality.

### Guidelines for Refactoring as Vertical Slices

When planning refactoring tasks (especially for architectural improvements like introducing stores/services), follow these principles:

1. **Start with Behavior, Not Structure:** Begin by identifying a specific, minimal behavior to refactor (e.g., "refactor node depletion" rather than "create node store").

2. **Minimal Viable Implementation:** For each new architectural component (store, service, etc.), implement only what's needed for the specific behavior being refactored in that task.

3. **Complete the Circuit:** Every task must include:
   - Creating any new structures needed
   - Implementing minimal functionality in those structures
   - Modifying existing code to use the new structures
   - Verifying the behavior works end-to-end

4. **Incremental Expansion:** Subsequent tasks should expand on the initial implementation by:
   - Adding more state/actions to stores
   - Adding more methods to services
   - Refactoring additional behaviors to use the expanded functionality

5. **Avoid These Red Flags:**
   - Tasks that only create files without using them
   - Tasks that implement services/stores without integrating them
   - Multiple tasks required before a feature works again
   - "Preparatory" tasks that only set up structure for later tasks

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

### 3. Detailed Implementation Tasks (Thin Vertical Slices):
*   **Task 1: [Brief name focusing on behavior implemented]**
    *   **Files:** [List files to create/modify]
    *   **Changes:** [Detail specific changes]
    *   **Vertical Slice Behavior:** [Explicitly describe the complete, observable behavior this task delivers]
    *   **Integration Points:** [Explain how new components are used within this task]
    *   **Acceptance Criteria:** [Include behavioral outcomes and verification steps]

*   [Additional tasks following the same pattern]

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