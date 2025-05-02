# Specialist Mode Interaction Details

This file provides specific details on how to interact with the specialist modes you delegate tasks to using the `new_task` tool.

## General Interaction Pattern

1.  Use `new_task` specifying the `mode`, `input_artifact`(s), and a clear `goal` for the specialist. **The goal must instruct the specialist mode to update the story file *content* (if applicable) but explicitly state that it should NOT update the overall story `status:` field.** Status updates are handled by the `story-workflow-manager` via the Story MCP Server. For `code-executor`, provide the specific `task_id`.
2.  Await the `attempt_completion` result from the specialist mode.
3.  Process the result:
    *   On **success**: Use MCP `setStatus <filePath> [next_status]` to advance the workflow.
    *   On **failure**: Use MCP `setStatus <filePath> blocked`. Report the issue to the user, and halt.

## Interaction with `story-groomer`

*   **Purpose:** To refine the User Story's definition, acceptance criteria, and ensure it's ready for technical planning.
*   **Trigger Status:** `(None)`, `defined`, `needs_grooming`.
*   **Input via `new_task`:**
    *   `mode`: `story-groomer`
    *   `input_artifact`: Path to the User Story file.
    *   `goal`: "Groom this user story. Ensure clarity, add acceptance criteria, and verify readiness. **Update the story file content as needed. Do NOT update the overall story status field.**"
*   **Expected Outcome on Success:**
    *   `attempt_completion` indicates success.
    *   The specialist mode (`story-groomer`) has updated the User Story file content.
    *   The `story-workflow-manager` will use MCP `setStatus` to update the status.
*   **Handling Failure:** `attempt_completion` indicates failure. Workflow manager sets status to `blocked`.

## Interaction with `architect-planner`

*   **Purpose:** To create a Story-level technical implementation plan.
*   **Trigger Status:** `groomed`, `needs_architect_plan`.
*   **Input via `new_task`:**
    *   `mode`: `architect-planner`
    *   `input_artifact`: Path to the User Story file.
    *   `goal`: "Analyze this groomed user story and create a high-level technical implementation plan (Story-level plan). Embed this plan within the story file (e.g., under '## Technical Plan'). **Update the story file content as needed. Do NOT update the overall story status field.**"
*   **Expected Outcome on Success:**
    *   `attempt_completion` indicates success.
    *   The specialist mode (`architect-planner`) has updated the User Story file to include the plan.
    *   The `story-workflow-manager` will use MCP `setStatus` to update the status.
*   **Handling Failure:** `attempt_completion` indicates failure. Workflow manager sets status to `blocked`.

## Interaction with `code-executor`

*   **Purpose:** To implement a *single* technical task from the User Story's plan.
*   **Trigger Status:** `coding_in_progress` (Managed by the loop in `02-workflow-logic.md`).
*   **Input via `new_task`:**
    *   `mode`: `code-executor`
    *   `input_artifact`: Path to the User Story file.
    *   `task_id`: `[Specific Task ID determined by Workflow Manager]` (Pass the specific ID)
    *   `goal`: "Execute the technical task identified by `task_id: [Specific Task ID]` found within the User Story file (`input_artifact`). Apply the necessary code changes. **Upon successful completion, use the Story MCP Server command `completeTask [input_artifact] [Specific Task ID]` to mark this specific task as done.** Do NOT modify the overall story status or other tasks."
*   **Expected Outcome on Success:**
    *   `attempt_completion` indicates success (without the `<tasks_remaining>` flag).
    *   The specialist mode (`code-executor`) has:
        *   Applied code changes for the specified task.
        *   Called the MCP `completeTask` command.
    *   The `story-workflow-manager` will use MCP `getPendingTasks` to determine the next action.
*   **Handling Failure:** `attempt_completion` indicates failure. Workflow manager sets status to `blocked`.