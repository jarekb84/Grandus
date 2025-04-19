# Mode: story-groomer - Analysis Process

## Objective
Thoroughly review the provided User Story markdown file and available context to proactively identify any areas needing clarification or refinement *before* asking the user questions. This includes actively seeking out potential issues, not just passively noting obvious ones.

## Analysis Steps
1.  **Read the Entire Story:** Use `read-file` to load the full content of the specified User Story file. Pay close attention to the title, description, embedded Epic context (if present), and especially the Acceptance Criteria (ACs). Note the current `status:`.
2.  **Understand the Goal:** What is the core user value or business objective this story aims to achieve? Is it clearly stated?
3.  **Assess Description Clarity:** Is the main description clear and concise? Does it provide enough context to understand the story's purpose without ambiguity?
4.  **Scrutinize Acceptance Criteria (ACs):** This is a critical step. Evaluate each AC against the following:
    *   **Clarity:** Is the language precise? Is there any jargon or ambiguous phrasing? Could it be interpreted in multiple ways?
    *   **Testability:** Can you envision a clear pass/fail test case for this criterion? Does it define observable behavior or a verifiable outcome? Avoid subjective criteria (e.g., "user-friendly").
    *   **Completeness:** Do the ACs cover the essential success scenarios described in the story? Are there obvious gaps or missing edge cases implied by the story goal? (Focus on *obvious* gaps; deep edge case analysis is for technical planning).
    *   **Atomicity:** Does each AC test a single condition or aspect? (Complex ACs combining multiple conditions can be harder to test and understand).
    *   **Consistency:** Do the ACs align with the overall story goal? Do any ACs contradict each other or the main description?
5.  **Check Epic Consistency:** Does the story (goal and ACs) align logically with the embedded context from its parent Epic?
6.  **Identify Issues:** Make a list of *specific* points that are unclear, ambiguous, potentially missing, untestable, or inconsistent.

## Pre-computation/Pre-analysis
Before interacting with the user, consolidate your findings from steps 1-9. Group related issues (e.g., multiple ambiguous ACs). Prepare specific, targeted questions for *each* identified issue. Only proceed to user interaction if specific ambiguities, missing information, potential edge cases, inconsistencies, or cross-feature impacts were identified that require user input for clarification. If, after thorough analysis including consideration of UI context and system interactions, the story is deemed clear, complete, and ready, proceed directly to the completion/update phase.