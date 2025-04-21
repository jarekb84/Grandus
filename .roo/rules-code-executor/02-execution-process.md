# Execution Process

When you receive a task via the `new_task` tool call, follow these steps meticulously:

1.  **Parse Task Instructions:**
    *   Carefully read the entire `message` content.
    *   Identify the specific file path(s) targeted for modification.
    *   Extract the precise instructions for code changes: what to add, delete, or modify.
    *   Note any provided context (variable names, data structures) or specific coding standards relevant *only* to this task.
    *   **Error Condition:** If the instructions are ambiguous, contradictory, incomplete (e.g., missing file path, unclear change description), or request actions outside your scope (e.g., creating commit messages, running tests), proceed immediately to step 5 (Reporting Failure).

2.  **Locate Target Code:**
    *   Attempt to access and read the content of the specified file(s).
    *   **Error Condition:** If a specified file cannot be found or accessed, proceed immediately to step 5 (Reporting Failure).
    *   Pinpoint the exact location(s) within the file(s) where the changes need to be applied, based on the instructions (e.g., specific function definition, line number range, code pattern).
    *   **Error Condition:** If the structure of the code in the file significantly deviates from what the instructions imply, making the prescribed changes impossible or nonsensical (e.g., a function to modify doesn't exist, the described code block is missing), proceed immediately to step 5 (Reporting Failure).

3.  **Implement Code Changes:**
    *   Execute the specified code modifications precisely as instructed.
    *   Add new code, delete specified lines, or modify existing code according to the task description.
    *   Apply any task-specific context or coding standards provided in the instructions.
    *   **Crucially:** Do **not** introduce any changes unrelated to the specific task instructions. Avoid refactoring surrounding code, fixing unrelated potential issues, or adding comments not directly related to the change unless explicitly requested.

4.  **Apply Changes to Files:**
    *   Use the `write_to_file` or `apply_diff` tool to write the implemented code changes to the specified file(s) on disk.
    *   **Wait for User Confirmation:** You *must* wait for the user's response confirming that the file writing tool call was successful before proceeding.
    *   **Error Condition:** If the file writing tool call fails, proceed immediately to step 6 (Reporting Failure).

5.  **Perform Basic Self-Check (Optional but Recommended):**
    *   If feasible within your processing capabilities and *after* the file changes have been confirmed written to disk, perform a quick sanity check on the changes.
    *   This could involve checking for obvious syntax errors in the newly added/modified code snippet within the file content.
    *   This is *not* a full validation, compilation, or test run. It's a minimal check to catch immediate, obvious errors *within the modified lines*.

6.  **Prepare Output and Signal Completion:**
    *   **On Success:** If steps 1-5 were completed successfully, including successful file writing confirmed by the user, proceed to `04-output-completion.md` for instructions on formatting the `attempt_completion` payload and signal completion using `attempt_completion` with a success status.
    *   **On Failure (from Steps 1, 2, 4, or if Implementation is Blocked):** If you encountered an error condition described above or the file writing step failed, do **not** attempt to make partial changes or guess the user's intent. Instead, prepare an error report. Use the `attempt_completion` tool call with a failure status and a clear message explaining *why* the task could not be completed (e.g., "File not found: [path]", "Instructions unclear: ambiguity regarding variable [X]", "File writing failed: [error details]", "Code structure mismatch: function [Y] not found"). Format the payload according to `99-completion-template.md`.