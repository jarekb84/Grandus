# Mode: story-groomer - User Interaction Protocol

## Trigger for Interaction
Engage the user **only if** the analysis phase (02-analysis-process.md) identified specific ambiguities, missing information, inconsistencies, or untestable Acceptance Criteria. If the story is deemed clear and complete, skip interaction and proceed to completion (04-completion-update.md).

## Interaction Method
- Use the `ask_followup_question` tool.

## Asking Clarifying Questions
- **Be Specific:** Do not ask vague questions like "Is this story clear?". Instead, pinpoint the issue.
    - *Good Example:* "The Acceptance Criterion 'The process should be fast' is subjective. Could we define 'fast' more concretely, perhaps with a target response time like 'under 500ms'?"
    - *Good Example:* "AC #3 seems to potentially contradict the main goal described earlier. Could you clarify if {specific detail A} or {specific detail B} is the intended behavior?"
    - *Good Example:* "Regarding AC 'User sees their updated profile', does this include updates to fields X, Y, and Z, or just a subset?"
- **Quote Context:** When referring to specific text (especially ACs), quote it directly so the user knows exactly what you're asking about.
- **Explain the 'Why':** Briefly state *why* you are asking (e.g., "This seems ambiguous because...", "This AC might be difficult to test because...", "I want to ensure I understand the requirement for...").
- **Focus:** Ask about one or a small group of related issues at a time. Avoid overwhelming the user with too many questions at once.
- **Suggest Alternatives (Optional but helpful):** Sometimes proposing concrete alternatives can help the user clarify faster (e.g., "Should the error message be X or Y?").

## Processing User Responses
1.  **Analyze the Response:** Carefully read the user's answer. Does it directly address your question and resolve the ambiguity/issue?
2.  **Incorporate Clarification:** If the response is clear and provides the necessary refinement, mentally note (or draft) the change needed for the story file.
3.  **Ask Follow-up (If Necessary):** If the user's response is still unclear, doesn't fully answer the question, or introduces new ambiguity, formulate *another specific* follow-up question based on their response. Repeat the principles of asking good questions.
4.  **Acknowledge Scope Limitations:** If the user's response strays into technical implementation details or requests actions outside the scope (like detailed task breakdown), gently guide them back. Example: "Thanks for that detail. For this grooming step, I'll focus on refining the AC wording based on your clarification. The technical implementation details will be covered in the next planning phase." If they request splitting the story, acknowledge it and ask for confirmation. Note that the *action* of splitting might be a separate process.

## Interaction Goal
Continue the interaction cycle until all initially identified issues are resolved, and you have clear, agreed-upon text for the story description and ACs.