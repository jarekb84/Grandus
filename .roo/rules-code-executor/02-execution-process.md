# Execution Process

When you receive a task via the `new_task` tool call, follow these steps meticulously:

1.  **Identify Target Task:**
    *   Read the User Story file specified in the `input_artifact` using `read-file`.
    *   Parse the content to locate the list of tasks (e.g., under a `## Tasks` heading). Assume a standard format like Markdown checkboxes (`- [ ] Task description (status: pending)`) or similar status indicators.
    *   Identify the *first* task in the list that is *not* marked as complete.
    *   Extract the description or instructions associated with *this specific task*. This becomes your primary instruction set.
    *   Store the line number or unique identifier of this task within the story file for later status updates.
    *   **Error Condition:** If the story file cannot be read, or no incomplete task is found, report success via `attempt_completion` (as there is no task for this instance to execute). Include a message like "No incomplete task found in [story file path]."
    *   **Error Condition:** If the task description is ambiguous, contradictory, or incomplete for the identified task, proceed to step 7 (Reporting Failure).

2.  **Parse Task Instructions:**
    *   Analyze the extracted task description.
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

7.  **Update Specific Task Status in Story File:**
    *   **On Success of Step 6:** Re-read the User Story file content (if necessary, to ensure you have the latest version before modifying).
    *   Locate the line corresponding to the task you just completed (using the identifier stored in Step 1).
    *   Modify this line to mark the task as complete (e.g., change `- [ ]` to `- [x]`, update `(status: pending)` to `(status: complete)`).
    *   Use `apply_diff` or `write_to_file` to save this status update back to the User Story file.
8.  **Check for Remaining Tasks:**
    *   **On Success of Step 7:** Parse the current User Story file content (which should be up-to-date from the previous step).
    *   Check if there are any *other* tasks listed (e.g., under `## Tasks`) that are still marked as incomplete.
    *   Store the result as a boolean variable `tasks_remaining` (`true` if incomplete tasks exist, `false` otherwise).
9.  **Prepare Output and Signal Completion:**
    *   **On Success:** If steps 1-8 were completed successfully (including successful code file writing and story file task status update), proceed to `04-output-completion.md` for formatting the `attempt_completion` payload. Include the value of `tasks_remaining` determined in Step 8. Signal completion using `attempt_completion` with a success status. **Do NOT modify the overall story status field.**
    *   **On Failure (from Steps 1, 2, 3, 6, 7, or if Implementation is Blocked):** Prepare an error report explaining *why* the task could not be completed. Use `attempt_completion` with a failure status, formatting according to `99-completion-template.md`.