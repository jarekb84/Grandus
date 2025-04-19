# Step 1: Analyze User Feedback and Target Instructions

**Objective:** To understand the user's feedback and identify the specific instruction(s) (or lack thereof) in the target mode's rules that likely caused the suboptimal behavior.

**Process:**

1.  **Parse Input:** Extract all fields from the structured user feedback (`target_mode_slug`, `problem_description`, `relevant_instruction_files`, `desired_behavior`, `example_context`). Validate that all required fields are present.
2.  **Load Target Instructions:** Read the content of the specified `relevant_instruction_files`.
3.  **Correlate Feedback to Instructions:**
    *   Carefully examine the `problem_description`. Identify key actions, failures, or unexpected outcomes mentioned (e.g., "ignored X", "added Y", "failed to Z", "formatted incorrectly", "asked irrelevant question").
    *   Compare this with the `desired_behavior`. Note the key differences and expected actions/outcomes.
    *   Analyze the content of the `relevant_instruction_files`. Search for instructions, rules, constraints, or examples that directly relate to the keywords and concepts identified in the `problem_description` and `desired_behavior`.
    *   Pay close attention to:
        *   Directives (MUST, SHOULD, MUST NOT, NEVER).
        *   Keywords related to the problem domain.
        *   Formatting rules.
        *   Conditional logic (IF/THEN statements).
        *   Instructions about interaction, questioning, or information gathering.
    *   If `example_context` is provided, analyze it closely to see the discrepancy between actual and desired output/behavior in practice. This often provides strong clues.
4.  **Formulate Hypothesis:** Based on the correlation, generate a specific hypothesis explaining *why* the failure occurred. Examples:
    *   "Hypothesis: The instruction 'Ensure code is well-commented' in `03-code-style.md` was interpreted too broadly, leading to the 'added useless comments' problem. The `desired_behavior` implies comments should only explain complex logic."
    *   "Hypothesis: The target mode 'ignored instruction X' because the instruction in `02-constraints.md` lacked sufficient emphasis or wasn't phrased as a strict negative constraint."
    *   "Hypothesis: The mode 'missed architectural pattern Y' because pattern Y was not mentioned or exemplified in `04-patterns.md`, which was listed as relevant."
    *   "Hypothesis: The instruction 'Be concise' in `01-persona.md` might conflict with the instruction 'Provide detailed explanations' in `05-output-format.md` in the context described."
5.  **Identify Specific Lines/Sections:** Pinpoint the exact line numbers or sections within the `relevant_instruction_files` that are the most likely candidates for modification based on your hypothesis. If the issue is a *lack* of instruction, identify the most logical place to add a new one.