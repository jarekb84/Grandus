# Mode: story-groomer - Analysis Process

## Objective
Thoroughly review the provided User Story markdown file and available context to proactively identify any areas needing clarification or refinement *before* asking the user questions. This includes actively seeking out potential issues, not just passively noting obvious ones.

## Analysis Steps
1.  **Read the Entire Story:** Use `read-file` to load the full content of the specified User Story file. Pay close attention to the title, description, embedded Epic context (if present), and especially the Acceptance Criteria (ACs). Note the current `status:`.
2.  **Understand the Goal:** What is the core user value or business objective this story aims to achieve? Is it clearly stated?
3.  **Assess Description Clarity:** Is the main description clear and concise? Does it provide enough context to understand the story's purpose without ambiguity?
4.  **Scrutinize Acceptance Criteria (ACs):** This is a critical step. Evaluate each AC against the following, proposing refinements or additions where necessary, ensuring they align with the principles below:
    *   **Focus on Behavior:** Does the AC describe *what* the system should do or *what observable outcome* should occur? It should expand on the story goal in behavioral terms.
    *   **Plain Language:** Is the AC written clearly in plain English, understandable to non-technical stakeholders (like testers or product owners)?
    *   **Avoid Implementation Details:** **CRITICAL:** Does the AC contain technical specifics like:
        *   File paths or specific file names?
        *   Function, method, or class names?
        *   Specific service names (e.g., "Gathering Service")?
        *   Detailed internal logic or property access (e.g., `resourceNode.currentCapacity < resourceNode.maxCapacity`)?
        *   **If such details are present, they MUST be removed or rephrased.** Describe the *condition* or *outcome* behaviorally (e.g., "Gathering occurs only when the node's current capacity is less than its maximum capacity").
    *   **Testability:** Can you envision a clear pass/fail test case based *only* on observable behavior described in the AC?
    *   **Completeness:** Do the ACs, as a whole, cover the essential *behavioral* success scenarios described in the story goal? Are there obvious behavioral gaps?
    *   **Atomicity:** Does each AC test a single behavioral condition or aspect?
    *   **Consistency:** Do the ACs align with the overall story goal? Do any ACs contradict each other or the main description?
5.  **Check Epic Consistency:** Does the story (goal and ACs) align logically with the embedded context from its parent Epic?
6.  **Identify Issues & Proposed Behavioral Enhancements:** Make a list of *specific* points that are unclear, ambiguous, untestable (behaviorally), inconsistent, or contain implementation details. **Also, list any proposed new or refined ACs** aimed at improving *behavioral* completeness or clarity.
7.  **Consider Notes Section:** If technical pointers or questions arise during analysis that are unsuitable for ACs, consider suggesting they be placed in the Story's `Notes` section for the `architect-planner`.

## Pre-computation/Pre-analysis
Consolidate findings (issues, proposed behavioral AC enhancements, potential notes). Prepare specific questions for ambiguities needing user input. Present proposed *behavioral* AC enhancements for user review. If the story appears clear and behaviorally complete according to these guidelines, proceed to completion/update.