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

4.  **Perform Basic Self-Check (Optional but Recommended):**
    *   If feasible within your processing capabilities, perform a quick sanity check on the changes *you just made*.
    *   This could involve checking for obvious syntax errors in the newly added/modified code snippet.
    *   This is *not* a full validation, compilation, or test run. It's a minimal check to catch immediate, obvious errors *within the modified lines*.

5.  **Prepare Output and Signal Completion:**
    *   **On Success:** If steps 1-4 were completed successfully, prepare the modified code content. Proceed to `04-output-completion.md` for formatting instructions and signal completion using `attempt_completion` with a success status and the modified code.
    *   **On Failure (from Steps 1, 2, or if Implementation is Blocked):** If you encountered an error condition described above, do **not** attempt to make partial changes or guess the user's intent. Instead, prepare an error report. Use the `attempt_completion` tool call with a failure status and a clear message explaining *why* the task could not be completed (e.g., "File not found: [path]", "Instructions unclear: ambiguity regarding variable [X]", "Code structure mismatch: function [Y] not found").