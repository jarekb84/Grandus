# Mode: epic-story-generator - Step 5: Story File Generation

## Goal

To generate individual User Story markdown files based on the user-confirmed, architecturally-informed plan. Each file must contain the core story definition and embed essential context from the parent Epic to facilitate independent processing by downstream modes.

## Trigger

This process begins **only after** receiving explicit user confirmation of the refined User Story plan in Step 4 (`04-user-confirmation-refinement.md`).

## Process

1.  **Iterate Through Confirmed Plan:**
    *   Process each User Story (title and goal) listed in the final, confirmed plan.

2.  **Determine File Naming and Location:**
    *   **Location:** Create each User Story file directly within the directory containing the parent Epic file (e.g., alongside `epic-01-mvp-core.md`).
    *   **Naming Convention:** Use the format `story-<zero_padded_number>-<slugified_title>.md`.
        *   `<zero_padded_number>`: The sequence number from the confirmed plan (e.g., `01`, `02`, `10`). Use zero-padding for consistent sorting (e.g., two digits: 01-99).
        *   `<slugified_title>`: A URL-friendly version of the Story title (lowercase, spaces replaced with hyphens, special characters removed). Example: "User Registration Process" becomes `user-registration-process`.
        *   **Example:** `./docs/projects/project-01/epic-01-mvp-core/story-01-user-registration-process.md`

3.  **Define File Content Structure and Embed Context:**
    *   For each story, generate a markdown file with the following minimum structure and embedded context:

    ```markdown
    # User Story: [Story Title from Plan]

    **Epic:** [Link to Parent Epic File] (e.g., `../epic-01-mvp-core.md`)
    **Epic Goal:** [Copy the Core Goal statement from the parent Epic file]

    ---

    ## Story Goal

    [Copy the Brief Goal defined for this story in the confirmed plan]

    ---

    ## Initial Acceptance Criteria (Optional Placeholder)

    *   [Placeholder: To be detailed during story grooming/refinement]
    *   *(Consider deriving very high-level criteria from related Epic ACs if obvious, but mark clearly as initial/provisional)*

    ---

    ## Notes / Context

    *   *(Optional: Add any specific notes derived during the planning or architect feedback relevant ONLY to this story)*
    *   This story was derived from Epic '[Epic Title]' as part of the initial breakdown.

    ---

    ## Embedded Epic Context for Downstream Processing

    <!-- ROO CONTEXT - DO NOT MODIFY MANUALLY -->
    <!--
    Epic Path: [Relative path to Epic file]
    Epic Title: [Epic Title]
    Epic Goal Summary: [Epic Goal]
    Project Context (if available in Epic):
      Project Title: [Project Title from Epic's embedded context]
      Project Goal: [Project Goal from Epic's embedded context]
    -->
    ```

4.  **Context Embedding Details:**
    *   **Mandatory:**
        *   `[Story Title from Plan]`: The confirmed title for this specific story.
        *   `[Link to Parent Epic File]`: A relative markdown link back to the Epic file it belongs to.
        *   `[Copy the Core Goal statement from the parent Epic file]`: Transcribe the main goal from the Epic definition for immediate context.
        *   `[Copy the Brief Goal defined for this story in the confirmed plan]`: The specific goal agreed upon for this story.
        *   **Embedded Context Block (`<!-- ROO CONTEXT ... -->`)**: This structured comment block is crucial for automated processing by downstream tools like `story-workflow-manager`. It should capture key identifiers and goals programmatically. Include:
            *   Relative path to the Epic file.
            *   Full Epic Title.
            *   Epic Goal Summary.
            *   If the Epic file contains embedded context from its parent Project, include the Project Title and Project Goal here as well.
    *   **Optional/Placeholders:**
        *   Initial Acceptance Criteria section: Acts as a placeholder for later refinement (e.g., by `story-groomer` mode). You *may* attempt to derive *very high-level* ACs from the Epic's ACs if there's a direct mapping, but this is not the primary goal.
        *   Notes/Context: For any specific relevant information captured during planning.

5.  **Completion:**
    *   Once all story files for the confirmed plan have been generated according to the structure and naming convention, the `epic-story-generator` mode has completed its task for this Epic.