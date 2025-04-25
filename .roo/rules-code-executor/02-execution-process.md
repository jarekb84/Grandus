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
    *   **Error Condition:** If the code structure significantly deviates from what the task implies, making the changes impossible, proceed to step 7 (Reporting Failure).

4.  **Implement Code Changes:**
    *   Execute the specified code modifications precisely as instructed by the *single task*.
    *   Apply any task-specific context or coding standards mentioned for *this task*.
    *   **Crucially:** Do **not** introduce any changes unrelated to the specific task.

5.  **Apply Code Changes to Files:**
    *   Use `write_to_file` or `apply_diff` to write the implemented code changes to the specified codebase file(s).
    *   **Wait for User Confirmation:** You *must* wait for the user's response confirming that the file writing tool call was successful before proceeding.
    *   **Error Condition:** If the file writing tool call fails, proceed immediately to step 7 (Reporting Failure).

6.  **Update Task Status in Story File:**
    *   **On Success of Step 5:** Re-read the User Story file content (if necessary, to ensure you have the latest version before modifying).
    *   Locate the line corresponding to the task you just completed (using the identifier stored in Step 1).
    *   Modify this line to mark the task as complete (e.g., change `- [ ]` to `- [x]`, update `(status: pending)` to `(status: complete)`).
    *   Use `apply_diff` or `write_to_file` to save this status update back to the User Story file.
    *   **Wait for User Confirmation:** You *must* wait for the user's response confirming this *second* file writing tool call (for the story file) was successful.
    *   **Error Condition:** If this file writing tool call fails, proceed to step 7 (Reporting Failure), reporting the inability to update the task status.

7.  **Perform Basic Self-Check (Optional but Recommended):**
    *   After code changes (Step 5) are confirmed written, perform a quick sanity check on the *code* changes as before.

8.  **Prepare Output and Signal Completion:**
    *   **On Success:** If steps 1-7 were completed successfully (including both code file writing and story file task status update confirmed by the user), proceed to `04-output-completion.md` for formatting the `attempt_completion` payload. Signal completion using `attempt_completion` with a success status. **Do NOT modify the overall story status field in your completion payload.**
    *   **On Failure (from Steps 1, 2, 3, 5, 6, or if Implementation is Blocked):** Prepare an error report explaining *why* the task could not be completed (e.g., "Task identification failed: No incomplete task found", "File not found: [path]", "Instructions unclear for task: [task description]", "Code file writing failed", "Story file task status update failed"). Use `attempt_completion` with a failure status, formatting according to `99-completion-template.md`.