# Specialist Mode Interaction Details

This file provides specific details on how to interact with the specialist modes you delegate tasks to using the `new_task` tool.

## General Interaction Pattern

1.  Use `new_task` specifying the `mode`, `input_artifact`(s), and a clear `goal` for the specialist. **Crucially, the goal must instruct the specialist mode to update the story file content AND its `status:` field to the appropriate next state upon successful completion.**
2.  Await the `attempt_completion` result from the specialist mode.
3.  Process the result:
    *   On **success**: Re-read the story file using `read-file` to confirm the new status set by the specialist. Proceed with the workflow based on this new status.
    *   On **failure**: Use `write-to-file` to set the story status to `blocked`. Report the issue to the user, and halt.

## Interaction with `story-groomer`

*   **Purpose:** To refine the User Story's definition, acceptance criteria, and ensure it's ready for technical planning.
*   **Trigger Status:** `(None)`, `defined`, `needs_grooming`.
*   **Input via `new_task`:**
    *   `mode`: `story-groomer`
    *   `input_artifact`: Path to the User Story file.
    *   `goal`: "Groom this user story. Ensure clarity, add acceptance criteria, and verify readiness. **Upon successful completion, update the story file content AND set its status to `groomed` (or `needs_architect_plan`).**"
*   **Expected Outcome on Success:**
    *   `attempt_completion` indicates success.
    *   The specialist mode (`story-groomer`) has updated the User Story file content AND set its `status:` field to `groomed` or `needs_architect_plan`.
*   **Handling Failure:** `attempt_completion` indicates failure. Workflow manager sets status to `blocked`.

## Interaction with `architect-planner`

*   **Purpose:** To create a Story-level technical implementation plan.
*   **Trigger Status:** `groomed`, `needs_architect_plan`.
*   **Input via `new_task`:**
    *   `mode`: `architect-planner`
    *   `input_artifact`: Path to the User Story file.
    *   `goal`: "Analyze this groomed user story and create a high-level technical implementation plan (Story-level plan). Embed this plan within the story file (e.g., under '## Technical Plan'). **Upon successful completion, update the story file content AND set its status to `plan_approved` (or `ready_for_coding`).**"
*   **Expected Outcome on Success:**
    *   `attempt_completion` indicates success.
    *   The specialist mode (`architect-planner`) has updated the User Story file to include the plan AND set its `status:` field to `plan_approved` or `ready_for_coding`.
*   **Handling Failure:** `attempt_completion` indicates failure. Workflow manager sets status to `blocked`.

`<!-- ... (Placeholders for other modes, ensuring their goals specify self-updating status on success) ... -->`

## Interaction with `code-executor`

*   **Purpose:** To write and apply the code changes needed to implement the story based on the technical plan.
*   **Trigger Status:** `plan_approved`, `ready_for_coding`.
*   `<!-- TODO: Detail interaction specifics for code-executor -->`
    *   `<!-- Inputs: Story file, relevant source code files/context -->`
    *   `<!-- Goal: Implement the plan, apply changes (e.g., via apply-diff) -->`
    *   `<!-- Expected Status Update: coding_complete or needs_code_review -->`

## Interaction with `code-reviewer`

*   **Purpose:** To review the code changes made for the story.
*   **Trigger Status:** `coding_complete`, `needs_code_review`.
*   `<!-- TODO: Detail interaction specifics for code-reviewer -->`
    *   `<!-- Inputs: Story file, diff/commit info, code context -->`
    *   `<!-- Goal: Review code quality, adherence to plan, correctness -->`
    *   `<!-- Expected Status Update: review_passed or needs_revision (might loop back or require specific handling) -->`

## Interaction with `user-feedback`

*   **Purpose:** To gather feedback from the user on the implemented story (if applicable).
*   **Trigger Status:** `review_passed`, `needs_user_feedback`.
*   `<!-- TODO: Detail interaction specifics for user-feedback -->`
    *   `<!-- Inputs: Story file, description of changes/demo info -->`
    *   `<!-- Goal: Present changes, ask for user validation -->`
    *   `<!-- Expected Status Update: user_approved -->`

## Interaction with `completion-manager`

*   **Purpose:** To perform final actions like merging code, closing tickets, etc.
*   **Trigger Status:** `user_approved`, `ready_for_completion`.
*   `<!-- TODO: Detail interaction specifics for completion-manager -->`
    *   `<!-- Inputs: Story file, commit info -->`
    *   `<!-- Goal: Finalize story implementation (e.g., merge PR) -->`
    *   `<!-- Expected Status Update: completed -->`