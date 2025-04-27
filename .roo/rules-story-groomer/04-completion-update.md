# Mode: story-groomer - Completion and Update

## Trigger for Completion
- **Scenario A:** The initial analysis (02-analysis-process.md) found no issues requiring clarification.
- **Scenario B:** All identified issues have been successfully clarified and resolved through user interaction (03-user-interaction.md).

## Update Process
1.  **Prepare Final Content:** Collate all the agreed-upon changes to the story description and Acceptance Criteria based on the analysis and user interaction (if any).
2.  **Update and Position Status:** Ensure the `**Status:** groomed` line exists and is the **very first line** of the final content. If the status line existed elsewhere, move it to the top. This is a **mandatory** step.
3.  **Write to File:** Use the `write-to-file` tool to overwrite the original User Story markdown file with the updated content (ensuring the status line is first).

## Signal Completion
Once the story file has been successfully updated with the refined content and `status: groomed`, signal completion using the `attempt_completion` tool.

**Structure of the `attempt_completion` payload:**
Use the standard XML structure defined in `../../templates/99-completion-template.md`.

**Populating the `<success>` block:**
- **`<summary>`:** Provide a concise summary (e.g., "User Story '[Story ID]' successfully groomed. Status updated to 'groomed'."). Mention if clarifications were made.
- **`<report>`:** (Optional) Can include a brief markdown report if needed, but often the summary and feedback are sufficient.
- **`<artifacts_modified>`:** Include a `<file>` element for the groomed story file (e.g., `<file path="./docs/stories/[story-file-name].md"/>`).
- **`<userFeedback>`:** This is where the summarized feedback collected during the interaction phase (as per `03-user-interaction.md`) should be included.
    - Add a `<feedback>` element with `target_mode_slug="story-groomer"`.
    - Inside the `<feedback>` element, add a `<comment>` section.
    - Populate the `<comment>` with the summarized list of feedback points. Generalize the feedback and avoid including full transcript details.
    - **Example `<userFeedback>` structure:**
      ```xml
      <userFeedback>
          <feedback target_mode_slug="story-groomer">
              <comment><![CDATA[
Summary of Grooming Feedback:
- User asked for clarification on date formatting requirements.
- User corrected the expected value for field 'X'.
- User provided a screenshot to illustrate the current UI state relevant to AC #2.
              ]]></comment>
          </feedback>
      </userFeedback>
      ```

**Populating the `<error>` block:**
(Use if the file update or other critical step failed)
- **`<message>`:** Provide a clear error message.
- **`<details>`:** (Optional) Add technical details about the failure.
- **`<userFeedback>`:** (Optional) Include any feedback provided by the user even in case of error, if relevant.

## Post-Completion
This mode's responsibility for *this specific story* ends upon successful completion signalling via `attempt_completion`. The story, now marked as `groomed`, is ready for the `architect-planner` mode or the next step in the workflow.