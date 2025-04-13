# Mode: epic-story-generator - Step 4: User Confirmation and Refinement (Post-Subtask)

## Goal

To refine the initial User Story plan based on the architectural feedback received from the completed `architect-planner` subtask, present the architecturally-informed plan clearly to the user (explaining changes), and obtain explicit confirmation before generating the final Story definition files.

## Process

1.  **Refine the Initial Plan (Using Subtask Result):**
    *   Start with the initial User Story plan generated in Step 2.
    *   Retrieve the architectural feedback Markdown **report** received from the `architect-planner` subtask via `attempt_completion` in Step 3.
    *   Systematically apply the changes **suggested within the architect's report**. This involves:
        *   **Splitting stories:** Replace the original story with the new, smaller stories as recommended in the report.
        *   **Merging stories:** Combine the specified stories into a single one, adjusting the title and goal as per the report's rationale.
        *   **Reordering stories:** Update the sequence numbers/order based on dependencies or prerequisites identified in the report.
        *   **Adding stories:** Insert any new technical enablement or prerequisite stories detailed in the report, using the suggested titles/goals or formulating appropriate ones based on the report's description.
        *   **Modifying titles/goals:** Update titles or goals if the report suggested clarifications or adjustments for technical accuracy or scope definition.
    *   Ensure the refined plan still comprehensively covers the original Epic's scope, now incorporating the architect's structural recommendations.

2.  **Prepare Presentation for User:**
    *   Format the *refined* User Story plan clearly (numbered list with titles and goals).
    *   Prepare a concise summary explaining the **source** and **nature** of the changes. Explicitly reference the architectural review subtask. Example phrasing:
        *   "The `architect-planner` subtask reviewed the initial plan and provided the following feedback, which has been incorporated:"
        *   "Based on the architectural report: Story '[Original Title]' was split into '[New Title 1]' and '[New Title 2]' to manage complexity."
        *   "Architectural review identified dependencies requiring stories '[Title A]' and '[Title B]' to be reordered."
        *   "The architectural report recommended adding a prerequisite story '[New Technical Story Title]' to address necessary refactoring."
        *   "Per the architect's analysis, Story '[Title C]' was merged with '[Title D]' due to tightly coupled functionality."

3.  **Present Refined Plan and Changes to User:**
    *   Display the refined User Story plan.
    *   Display the summary of changes, clearly attributing them to the architectural feedback received from the subtask.
    *   Ask the user for confirmation: "The initial plan has been refined based on feedback from the `architect-planner`. Does this updated User Story plan accurately reflect the breakdown of the Epic? Please confirm to proceed, or provide specific feedback for adjustments."

4.  **Handle User Feedback:**
    *   **Confirmation:** If the user confirms (e.g., replies "yes", "confirmed", "approved", "proceed"), move to the final step (`05-story-file-generation.md`).
    *   **Minor Adjustments:** If the user requests minor changes, make the adjustments, present the updated plan briefly, and seek confirmation again. Ensure minor changes don't contradict key architectural points from the report without acknowledgement.
    *   **Significant Objections/Changes:** If the user requests changes that conflict significantly with the architect's report (e.g., ignoring a prerequisite, merging stories flagged for splitting due to complexity), explicitly state the conflict: "The architect's report recommended [action X] due to [reason Y]. Your requested change [change Z] differs from this. Proceeding might re-introduce the architectural concerns raised. Please confirm how you'd like to proceed." Aim to resolve or escalate if necessary. **Prioritize proceeding with the user-confirmed plan that respects the architectural input.**

5.  **Final Confirmation:** Ensure explicit confirmation is received before proceeding.