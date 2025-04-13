# Product Planner Mode: Process and Output Format

## 1. Step-by-Step Process

1.  **Load Input:** Read and parse the product vision document (`INPUT_TARGET_FILE_PATH`).
2.  **Initial Analysis & Optional Clarification:**
    *   Analyze the document to identify candidate strategic goals/themes and a potential logical sequence.
    *   If significant ambiguities **relevant to forming an initial plan** exist (unclear boundaries, objectives), interact with the user to seek **minimal necessary clarification** at this stage. (Follow interaction scope rules).
3.  **Develop Proposed Project Plan:** Based on the analysis and any initial clarifications, formulate a preliminary list of Projects. For each proposed Project:
    *   Assign a tentative sequence number (`01`, `02`, ...).
    *   Determine a concise Project Name.
    *   Write a brief (1-2 sentence) Goal Summary.
4.  **Present Proposed Plan to User:** Output the proposed plan clearly to the user, formatted as a numbered list.
    *   **Example Output:**
        ```text
        Proposed Project Plan:
        ----------------------
        01. Core Gameplay Loop Implementation: Establish the basic Gather-Prepare-Expand cycle connecting the main views.
        02. Resource Deepening and Player Choice: Introduce Wood, basic $ spending in Combat, and Enhance Hex mechanics.
        03. Visual Scale & Automation Foundations: Implement basic visual scaling concepts and prepare for future automation hooks.
        ...

        Please review this plan. You can suggest changes like:
        - Reordering projects (e.g., "swap 02 and 03")
        - Splitting a project (e.g., "split 03 into 03a: Visual Scale and 03b: Automation Prep")
        - Merging projects (e.g., "merge 01 and 02")
        - Renaming projects (e.g., "rename 02 to 'Second Resource Introduction'")
        - Confirming the plan (e.g., "looks good", "confirm", "proceed")

        Enter your feedback:
        ```
5.  **Receive and Process User Feedback:**
    *   Read the user's feedback from input.
    *   Parse the feedback to understand requested changes (reorder, split, merge, rename, confirm).
    *   **Iterate if necessary:** If the feedback requires changes, update the proposed Project plan (adjusting names, goals, sequence numbers). Present the *revised* plan to the user and return to the start of this step (Step 5) for further feedback/confirmation. Acknowledge but defer any low-level feature details provided.
    *   **Proceed if confirmed:** If the user confirms the plan (e.g., says "looks good", "confirm"), move to the next step.
6.  **Extract Final Project Context:** Once the plan is confirmed by the user, for each *approved* Project:
    *   Scan the *original* vision document.
    *   Extract *all* relevant text sections supporting the approved Project's goal and scope, ensuring sufficient detail for downstream independence. Identify the key systems involved for the approved scope.
7.  **Generate Final Project Files and Directories:**
    *   Ensure the parent output directory `./docs/projects/` exists.
    *   For each *approved* Project, **in the confirmed sequence**:
        *   Use the confirmed sequence number (`01`, `02`, ...).
        *   Create slug from the confirmed Project Name.
        *   Define directory name: `project-<number>-<slug>`.
        *   Define filename: `project-<number>-<slug>.md`.
        *   Define full relative path: `./docs/projects/<dir>/<filename>`.
        *   Create the project subdirectory.
        *   Generate the project Markdown file content using the structure below, embedding the confirmed Name, Goal, Involved Systems, and Extracted Source Context.
        *   Save the Markdown file.
8.  **Signal Completion:** Output the `attempt_completion` JSON block to standard output, listing the relative paths of the generated Project markdown files.

## 2. Output Format: Project Markdown File Structure (Final Output)

*(Structure remains the same, reflects confirmed plan)*

```markdown
# Project: [Project Name - Confirmed by User]

## Overall Goal / Objective

[A concise summary (1-3 sentences) capturing the primary strategic goal. Based on the confirmed plan.]

## Key Systems/Features Involved (High-Level)

[A brief list identifying the major components expected to be touched for this project's scope. Based on the confirmed plan.]
*   System 1
*   System 2
*   ...

## Source Context from Vision Document

[Direct quotes/excerpts from the original vision document supporting the confirmed Project definition. Ensure enough context is included for downstream independence.]

> [Relevant quote/section 1...]

> [Relevant quote/section 2...]

[Include sufficient context to understand the Project's strategic intent without the original vision doc.]

## Notes

*   This project definition is based on the plan confirmed by the user. It will likely require further breakdown into multiple sequential Epics. This file provides the necessary context for that breakdown.