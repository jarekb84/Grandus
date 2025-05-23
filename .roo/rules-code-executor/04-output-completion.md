# Output Formatting and Completion Signal

## Using `attempt_completion` to Signal Completion

After successfully applying code changes to the file system using tools like `write_to_file` or `apply_diff`, or after determining that the task cannot be completed due to an error, you MUST use the `attempt_completion` tool call to signal the final status of your task execution.

**Crucially:** The `result` parameter of the `attempt_completion` tool call **MUST** contain an XML structure conforming strictly to the `99-completion-template.md`. You will populate either the `<success>` or the `<error>` block within this structure.

*   **`result` (required) parameter:**
    *   This parameter contains the XML payload.
    *   **On Success:** Populate the `<success>` block:
        *   Include a `<summary>` tag with a minimal confirmation. Example: `Task [task_id] completed successfully.` (Include the specific task ID if easily accessible).
        *   **(Removed mandatory `<tasks_remaining>` tag)**
        *   Optionally include `<userFeedback>` if applicable.
    *   **On Failure:** Populate the `<error>` block:
        *   Include a `<message>` tag with a clear, specific error message explaining *exactly why* the task failed. This message is critical for debugging the workflow. Start the message clearly indicating failure. Example: `Failure: Target file not found: 'src/utils/helpers.js'. Unable to complete the task.`
        *   Optionally, include `<details>` with more technical context if available.
        *   Omit `<userFeedback>` unless specifically relevant and instructed by a higher-level mode.

*   **`command` (optional) parameter:**
    *   You should **omit** this parameter. Your role is code implementation, not demonstration via CLI commands.

*   **Example Structure (Success):**

    ```xml
    <result>
        <success>
            <summary><![CDATA[Task [task_id] completed successfully.]]></summary>
            <!-- tasks_remaining tag is REMOVED -->
            <!-- artifacts_modified is intentionally omitted -->
        </success>
    </result>
    ```

*   **Example Structure (Failure):**

    ```xml
    <result>
        <error>
            <message><![CDATA[Failure: Target file not found: 'src/utils/helpers.js'. Unable to complete the task.]]></message>
        </error>
    </result>
    ```

## No Pre-Completion Code Output: Strict Reminder
You do **not** output the modified file content directly in your response message before calling `attempt_completion`. The file content is handled by the file writing tools (`write_to_file`, `apply_diff`). Your `attempt_completion` signal is purely for reporting status (success/failure). It should NOT contain lists of modified files or the removed `<tasks_remaining>` tag.

## No Meta-Tasks: Strict Reminder
Your role ends with applying the code changes and providing the `attempt_completion` signal. You do **not**:
*   Generate git commit messages.
*   Update documentation unless that *is* the specific task.
*   Update project status trackers or files.
*   Run tests, linters, or build scripts (unless explicitly defined as the task itself).
*   Interact directly with version control systems (e.g., `git commit`, `git push`).
*   Perform any other workflow management or project coordination actions.