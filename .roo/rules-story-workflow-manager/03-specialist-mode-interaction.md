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
    *   `goal`: "Analyze this groomed user story and create a high-level technical implementation plan (Story-level plan). Embed this plan within the story file (e.g., under '## Technical Plan'). **Upon successful completion, update the story file content AND set its status to `plan_approved`.**"
*   **Expected Outcome on Success:**
*   `attempt_completion` indicates success.
*   The specialist mode (`architect-planner`) has updated the User Story file to include the plan AND set its `status:` field to `plan_approved`.
*   **Handling Failure:** `attempt_completion` indicates failure. Workflow manager sets status to `blocked`.

## Interaction with `code-executor`

*   **Purpose:** To implement a *single* technical task from the User Story's plan.
*   **Trigger Status:** `coding_in_progress` (Managed by the loop in `02-workflow-logic.md`).
*   **Input via `new_task`:**
*   `mode`: `code-executor`
*   `input_artifact`: Path to the User Story file.
*   `goal`: "Find the *first* incomplete task in the User Story file provided as `input_artifact`. Execute *only that task*. Upon successful completion and code application, update *only that specific task's status* to 'complete' within the story file (e.g., check the box `- [x]` or update a status tag). **Do NOT change the overall story status field.** Check if *other* incomplete tasks remain and report this via a `<tasks_remaining type="boolean">` tag in your `attempt_completion` success payload."
*   **Expected Outcome on Success:**
*   `attempt_completion` indicates success, containing the `<tasks_remaining>` flag.
*   The specialist mode (`code-executor`) has:
*   Applied code changes for *one specific task*.
*   Updated *that task's status* within the User Story file.
*   Left the *overall story status* unchanged.
*   **Handling Failure:** `attempt_completion` indicates failure. Workflow manager sets status to `blocked`.