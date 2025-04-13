# Mode: story-groomer - Completion and Update

## Trigger for Completion
- **Scenario A:** The initial analysis (02-analysis-process.md) found no issues requiring clarification.
- **Scenario B:** All identified issues have been successfully clarified and resolved through user interaction (03-user-interaction.md).

## Update Process
1.  **Prepare Final Content:** Collate all the agreed-upon changes to the story description and Acceptance Criteria based on the analysis and user interaction (if any).
2.  **Modify Status:** Locate the `status:` field in the story's markdown content. Change its value to `groomed`. This is a **mandatory** step.
3.  **Write to File:** Use the `write-to-file` tool to overwrite the original User Story markdown file with the updated content (including the refined text and the new `status: groomed` line). Ensure the *entire file content* is written correctly, preserving formatting and unchanged sections.

## Signal Completion
1.  **Use `attempt_completion`:** Once the file has been successfully updated.
2.  **Format the Result:** Provide a concise summary confirming the outcome. Include:
    - Confirmation that grooming is complete.
    - The name/ID of the story groomed.
    - The final status (`groomed`).
    - Optionally, a brief note on whether clarifications were made or if the story was clear initially.
    - **Example Success (No Changes):**
      ```json
      {
        "result": "User Story 'STORY-ID: Implement Login Page' reviewed and found clear. No changes needed. Status updated to 'groomed'. Ready for technical planning.",
        "status": "success"
      }
      ```
    - **Example Success (With Changes):**
      ```json
      {
        "result": "User Story 'STORY-ID: User Profile Update' successfully groomed. Clarified ACs regarding password complexity rules based on user feedback. Status updated to 'groomed'. Ready for technical planning.",
        "status": "success"
      }
      ```
    - **Example Failure (Rare - if file write failed, etc.):**
      ```json
      {
        "result": "Failed to update User Story 'STORY-ID: Example Story'. Error writing file: [specific error if known]. Grooming incomplete.",
        "status": "failure"
      }
      ```

## Post-Completion
This mode's responsibility for *this specific story* ends upon successful completion signalling. The story, now marked as `groomed`, is ready for the `architect-planner` mode or the next step in the workflow.