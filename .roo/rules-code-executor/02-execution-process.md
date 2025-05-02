# Execution Process

When you receive a task via the `new_task` tool call, follow these steps meticulously:

1.  **Receive Task Assignment:**
    *   Identify the `input_artifact` (story file path) and the specific `task_id` provided in the `new_task` instructions.
    *   Read the User Story file specified in `input_artifact` using `read-file`.
    *   Locate the description or instructions associated with the provided `task_id`. This becomes your primary instruction set.
    *   **Error Condition:** If the story file cannot be read, or the specific `task_id` cannot be found within the file's task list, proceed to Step 7 (Reporting Failure).
    *   **Error Condition:** If the task description for the given `task_id` is ambiguous, contradictory, or incomplete, proceed to step 7 (Reporting Failure).

2.  **Parse Specific Task Instructions:**
    *   Analyze the extracted task description associated with the given `task_id`.
    *   Identify the specific file path(s) targeted for modification based *only* on this task's description.
    *   Extract the precise instructions for code changes relevant *only* to this task.
    *   Note any context mentioned *within this task's description*.
    *   **Error Condition:** If the task requires actions outside your scope (e.g., running tests, architectural decisions), proceed to step 7 (Reporting Failure).

3.  **Locate Target Code:**
    *   Attempt to access and read the content of the codebase file(s) specified by the task instructions.
    *   **Error Condition:** If a specified file cannot be found or accessed, proceed to step 7 (Reporting Failure).
    *   Pinpoint the exact location(s) within the file(s) where the changes need to be applied, based on the task instructions.
    *   **Error Condition:** If the code structure significantly deviates from what the task implies, making the changes impossible, proceed to step 8 (Reporting Failure).

4.  **Analyze Local Context (Briefly):**
    *   Examine the lines of code immediately surrounding the target modification point(s) identified in Step 3 (e.g., ~10 lines before and after).
    *   Identify local variable naming conventions, common function call patterns, and data access methods used in the immediate vicinity.
    *   Note the general logical flow of the surrounding code.
    *   **Purpose:** Use this understanding to inform the implementation in the *next* step, ensuring the new code integrates consistently with its immediate surroundings.
    *   **Constraint:** This analysis must *not* lead to changes outside the scope defined in the task instructions or violate the strict limitations in `03-coding-standards-scope.md`. The goal is consistency within the task's implementation, not general refactoring.

5.  **Implement Code Changes:**
    *   Execute the specified code modifications precisely as instructed by the *single task*.
    *   Apply any task-specific context or coding standards mentioned for *this task*.
    *   **Leverage Local Context:** Ensure the implementation aligns with the local variable naming, patterns, and logic identified in Step 4, *without altering code outside the direct task scope*.
    *   **Crucially:** Do **not** introduce any changes unrelated to the specific task.

6.  **Apply Code Changes to Files:**
    *   Use `write_to_file` or `apply_diff` to write the implemented code changes to the specified codebase file(s).

7.  **Mark Task Complete via MCP:**
    *   **On Success of Step 6:** Use `completeTask` tool to call the Story MCP Server with `[input_artifact] [task_id]` (replace placeholders with actual values).
    *   **Error Condition:** If the MCP command itself fails (returns an error), proceed to Step 8 (Reporting Failure).

8.  **(Removed Step: Check for Remaining Tasks)**

9.  **Prepare Output and Signal Completion:**
    *   **On Success:** If steps 1-7 were completed successfully (including successful code file writing and the MCP `completeTask` call), proceed to `04-output-completion.md` for formatting the `attempt_completion` payload (note: `<tasks_remaining>` tag is no longer included). Signal completion using `attempt_completion` with a success status.
    *   **On Failure (from Steps 1, 2, 3, 6, 7, or if Implementation is Blocked):** Prepare an error report explaining *why* the task could not be completed. Use `attempt_completion` with a failure status, formatting according to `99-completion-template.md`.