# Output Formatting and Completion Signal

## Using `attempt_completion` to Signal Completion

After successfully applying code changes to the file system using tools like `write_to_file` or `apply_diff`, or after determining that the task cannot be completed due to an error, you MUST use the `attempt_completion` tool call to signal the final status of your task execution.

**Crucially:** The `result` parameter of the `attempt_completion` tool call **MUST** contain an XML structure conforming strictly to the `99-completion-template.md`. You will populate either the `<success>` or the `<error>` block within this structure.

*   **`result` (required) parameter:**
    *   This parameter contains the XML payload.
    *   **On Success:** Populate the `<success>` block:
        *   Include a `<summary>` tag with a concise, factual summary describing the specific changes you made and the file(s) modified. Focus on *what* was done according to the instructions. Example: `Successfully added the 'calculate_total' function to 'src/services/billing.py' as per the instructions.`
        *   Include `<artifacts_modified>` tags listing the path(s) of the file(s) you successfully modified. Example: `<artifacts_modified><file path="src/services/billing.py"/></artifacts_modified>`.
        *   Omit `<report>`, `<artifacts_generated>`, and `<userFeedback>` unless specifically relevant and instructed by a higher-level mode.
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
            <summary><![CDATA[Successfully added the 'calculate_total' function to 'src/services/billing.py' as per the instructions.]]></summary>
            <artifacts_modified>
                <file path="src/services/billing.py"/>
            </artifacts_modified>
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
You do **not** output the modified file content directly in your response message before calling `attempt_completion`. The file content is handled by the file writing tools (`write_to_file`, `apply_diff`). Your `attempt_completion` signal is purely for reporting status and listing modified files via paths in `<artifacts_modified>`.

## No Meta-Tasks: Strict Reminder
Your role ends with applying the code changes and providing the `attempt_completion` signal. You do **not**:
*   Generate git commit messages.
*   Update documentation unless that *is* the specific task.
*   Update project status trackers or files.
*   Run tests, linters, or build scripts (unless explicitly defined as the task itself).
*   Interact directly with version control systems (e.g., `git commit`, `git push`).
*   Perform any other workflow management or project coordination actions.