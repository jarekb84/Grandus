# Mode: epic-story-generator - Step 3: Architect Interaction (Subtask Delegation)

## Goal

To delegate the high-level architectural review of the *initial* User Story plan to the `architect-planner` mode via a subtask, ensuring the plan's technical feasibility and alignment before user presentation. This involves pausing the current `epic-story-generator` task while the `architect-planner` subtask executes.

## Process

1.  **Prepare Delegation Package:**
    *   Compile the necessary information for the `architect-planner` subtask. This **must** include:
        *   **Epic Context:** The full content or the accessible path to the input Epic definition file (`epic-XX-slug.md`).
        *   **Initial Story Plan:** The structured list of proposed User Story titles and goals generated in Step 2 (`02-initial-planning-process.md`).
        *   **Explicit Instructions:** A clear statement defining the subtask's goal: "Perform a high-level architectural review of the provided initial story plan for the given Epic. Focus on feasibility, architectural alignment, dependencies, prerequisites, and suggestions for plan modifications (split, merge, reorder, add technical stories). Do NOT generate detailed implementation tasks. Return your findings as a structured markdown report via `attempt_completion` with a status indicator."

2.  **Delegate using `new_task`:**
    *   Invoke the `new_task` tool.
    *   Set the `mode` parameter to `architect-planner`.
    *   Set the `message` parameter to contain the **Epic Context**, the **Initial Story Plan**, and the **Explicit Instructions** compiled above. Example structure for the message:
        ```
        Requesting high-level architectural review for the following Epic and initial Story plan:

        **Epic File Path:** ./docs/projects/project-01/epic-01-mvp-core/epic-01-mvp-core.md
        *(Or include full Epic content here if more appropriate)*

        **Initial Story Plan:**
        1.  **Story Title:** [Title 1]
            *   **Goal:** [Brief Goal 1]
        2.  **Story Title:** [Title 2]
            *   **Goal:** [Brief Goal 2]
        ...

        **Instructions:**
        Perform a high-level architectural review of this initial story plan. Focus on feasibility, alignment, dependencies, prerequisites, and suggest modifications (split, merge, reorder, add technical stories). Do NOT generate detailed implementation tasks. Return your findings as a structured markdown report via `attempt_completion`, including a status indicator (`PLAN_REVIEW_COMPLETE_OK`, `PLAN_REVIEW_COMPLETE_WITH_RECOMMENDATIONS`, or `PLAN_REQUIRES_SIGNIFICANT_REVISION`).
        ```
    *   **Execution Pauses:** Upon successful invocation of `new_task`, the current `epic-story-generator` task will **pause** pending completion of the `architect-planner` subtask.

3.  **Await Resumption and Receive Result:**
    *   The `epic-story-generator` task will **resume** automatically when the `architect-planner` subtask uses the `attempt_completion` tool.
    *   Expect the result from `attempt_completion` to be a JSON object containing:
        *   `status`: An indicator like `PLAN_REVIEW_COMPLETE_OK`, `PLAN_REVIEW_COMPLETE_WITH_RECOMMENDATIONS`, or `PLAN_REQUIRES_SIGNIFICANT_REVISION`.
        *   `report`: A string containing the detailed architectural review in Markdown format, as requested.

4.  **Parse Architect Feedback from Result:**
    *   Extract the `report` (Markdown string) from the received JSON result.
    *   Parse this Markdown report to identify the architect's findings:
        *   Overall assessment (feasibility, alignment).
        *   Specific feedback on stories (split, merge, reorder recommendations).
        *   Identification of dependencies and necessary prerequisites (potential new stories).
        *   Cross-cutting concerns noted.
    *   Note the `status` for potential context, but primarily focus on the details within the `report`.

5.  **Internalize Feedback:**
    *   Carefully analyze the architect's feedback extracted from the report. Understand the reasoning behind each suggestion or concern.
    *   Identify the specific changes needed to the initial story plan based *directly* on this architectural input.

6.  **Prepare for Plan Refinement:**
    *   The initial plan, along with the parsed architectural feedback *from the completed subtask's report*, is now ready for the refinement step. The goal is to integrate the architect's suggestions logically before seeking user confirmation (as detailed in `04-user-confirmation-refinement.md`).