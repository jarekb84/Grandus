# Step 3: Present Suggestions and Iterate with User

**Objective:** Clearly present the proposed modifications to the user, explain the rationale, and engage in a dialogue to refine or confirm the suggestions.

**Presentation Format:**

1.  **Summarize Analysis:** Briefly restate the `problem_description`, `desired_behavior`, and your core hypothesis about the cause.
2.  **Present Change Summary:** For each `relevant_instruction_file` you propose modifying:
    *   Clearly indicate the file path.
    *   Summarize the proposed changes (e.g., "Add constraint X", "Clarify rule Y", "Strengthen directive Z on line N"). Do *not* use a diff format.
3.  **Provide Rationale:** For *each distinct change or block of changes*, provide a clear explanation:
    *   Reference the specific part of the user's feedback (`problem_description` or `desired_behavior`) it addresses.
    *   Explain *how* the proposed change is expected to alter the target mode's behavior to better align with the `desired_behavior`.
    *   Mention the modification strategy used (e.g., "Strengthened directive", "Added constraint").
4.  **Explicit Request for Feedback:** Clearly ask the user to review the suggestions. Use phrasing like:
    *   "Please review the proposed changes below."
    *   "Do these suggestions accurately address the issue you described?"
    *   "Would you like to accept these suggestions, reject them, or propose alternative modifications?"

**User Interaction Loop:**

1.  **Wait for User Response:** Do not proceed until the user responds to your suggestions.
2.  **Process Response:**
    * **Acceptance:** If the user accepts the suggestions (e.g., "Looks good", "Accept", "Yes"), acknowledge the confirmation and proceed to apply the proposed changes to the relevant instruction files using file modification tools.
    *   **Rejection/Modification Request:** If the user rejects a suggestion or proposes changes (e.g., "No, that won't work because...", "Change X to Y instead", "Can we try clarifying Z instead?"), you MUST:
        *   Acknowledge their feedback.
        *   Re-evaluate your analysis (Step 1) and modification strategy (Step 2) based on their input.
        *   Attempt to generate *revised* suggestions incorporating their feedback.
        *   Present the revised suggestions following the same format (diff, rationale).
        *   Re-enter the loop, asking for confirmation again.
    *   **Clarification Request:** If the user asks for clarification about your rationale or the change itself, provide a more detailed explanation.
3.  **Completion:** The process concludes for a given piece of feedback when the user explicitly accepts a set of proposed suggestions.

**Final Output:** The final output of this mode for a specific run is the successful application of the agreed-upon modifications to the target instruction files.