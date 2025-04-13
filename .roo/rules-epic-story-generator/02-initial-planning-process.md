# Mode: epic-story-generator - Step 2: Initial Planning Process

## Goal

To analyze the input Epic definition and generate a *preliminary* list of User Story goals/titles that logically breaks down the Epic's scope. This initial list serves as the basis for architectural review.

## Process

1.  **Load and Parse Epic:**
    *   Read the specified Epic markdown file (e.g., `epic-01-mvp-core.md`).
    *   Identify key sections: Epic Goal, Acceptance Criteria, Non-Functional Requirements, Scope (In/Out), and any embedded parent Project context.

2.  **Identify Core Functionality:**
    *   Analyze the Epic Goal and Acceptance Criteria to understand the primary user-facing value and the essential steps required to achieve it.
    *   Consider the Non-Functional Requirements (NFRs) that might influence the breakdown (e.g., performance NFRs might suggest separating a complex calculation).

3.  **Break Down into Logical Steps:**
    *   Decompose the Epic's overall goal into smaller, manageable, and potentially deliverable increments of value from a user's perspective.
    *   Think in terms of distinct user actions, features, or workflows described or implied in the Epic.
    *   Aim for stories that are relatively independent, although dependencies will exist and will be considered later.
    *   Consider the "INVEST" principles (Independent, Negotiable, Valuable, Estimable, Small, Testable) as a guideline, but don't enforce them strictly at this *initial* stage. The focus is on logical decomposition first.

4.  **Formulate Initial Story Titles/Goals:**
    *   For each identified step/increment, formulate a concise User Story title (e.g., "User Registration Process", "Product Catalog Display", "Basic Search Functionality").
    *   Write a brief (1-2 sentence) goal for each story, summarizing the intended outcome or value for the user (e.g., "Allow new users to create an account.", "Display available products with basic details.", "Enable users to search products by name.").
    *   Maintain a clear link between the story goals and the overall Epic goal and acceptance criteria.

5.  **Structure the Initial Plan:**
    *   Compile the list of proposed User Story titles and their brief goals.
    *   Assign a preliminary sequence number (e.g., Story 01, Story 02). This initial order might change based on feedback.
    *   Present this list clearly. Example format:
        ```
        Proposed Initial Story Plan for Epic [Epic Title/ID]:

        1.  **Story Title:** [Title 1]
            *   **Goal:** [Brief Goal 1]
        2.  **Story Title:** [Title 2]
            *   **Goal:** [Brief Goal 2]
        3.  **Story Title:** [Title 3]
            *   **Goal:** [Brief Goal 3]
        ...
        ```

6.  **Prepare for Architect Interaction:**
    *   This structured list, along with the full context of the Epic file, is now ready to be passed to the `architect-planner` mode for review (as detailed in `03-architect-interaction.md`). **Do not proceed to user confirmation or file generation yet.**