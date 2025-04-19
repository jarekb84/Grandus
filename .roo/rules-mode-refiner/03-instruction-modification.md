# Step 2: Generate Modification Suggestions

**Objective:** Based on the analysis and hypothesis from Step 1, propose specific, targeted changes to the identified sections of the `relevant_instruction_files`.

**Modification Strategies:** Choose the most appropriate strategy to address the hypothesized cause of the failure:

1.  **Strengthening/Emphasizing:**
    *   **When:** An existing instruction was likely ignored or de-prioritized.
    *   **How:**
        *   Add stronger keywords (e.g., change `SHOULD` to `MUST`, `CONSIDER` to `ALWAYS`).
        *   Use formatting for emphasis (e.g., **bolding**, ALL CAPS - use sparingly).
        *   Rephrase for imperative mood (e.g., "You should do X" -> "DO X").
        *   Add a `CRITICAL:` or `IMPORTANT:` prefix.
    *   **Example:** If feedback says "ignored formatting rule X", change "Code should follow formatting rule X" to "**MUST** follow formatting rule X".

2.  **Clarifying/Rephrasing:**
    *   **When:** An instruction was likely ambiguous or misinterpreted.
    *   **How:**
        *   Rephrase the instruction using simpler or more precise language.
        *   Break down a complex instruction into smaller, sequential steps.
        *   Add a brief example (positive or negative) immediately after the instruction.
        *   Define potentially ambiguous terms used in the instruction.
    *   **Example:** If feedback indicates confusion about "high-level design", clarify by adding: "Provide a high-level design (major components and interactions, key technology choices, but exclude implementation details)."

3.  **Adding Constraints/Rules:**
    *   **When:** The mode performed an undesirable action that wasn't explicitly forbidden, or missed a necessary condition/step mentioned in `desired_behavior`.
    *   **How:**
        *   Add specific `MUST NOT` or `NEVER` rules.
        *   Introduce conditional logic (`IF condition THEN MUST DO X`, `UNLESS Y, NEVER DO Z`).
        *   Add specific requirements or checks.
    *   **Example:** If feedback says "added useless boilerplate comments", add "MUST NOT add comments that merely restate the code's function (e.g., `// initialize variable i`). Only comment on complex logic or rationale."

4.  **Adding Information/Examples:**
    *   **When:** The mode lacked necessary knowledge, context, or specific patterns mentioned in the `desired_behavior`.
    *   **How:**
        *   Add definitions of key concepts or patterns.
        *   Provide clear positive examples of the desired output/behavior.
        *   Provide clear negative examples of what to avoid.
        *   Add relevant context or background information if missing.
    *   **Example:** If feedback says "missed using the Observer pattern", add a section explaining the Observer pattern briefly and provide a concise example of its application in the relevant context.

5.  **Removing/Softening:**
    *   **When:** An instruction is causing unintended rigidity, conflicts with other higher-priority instructions, or is identified as the source of the problem and is less critical than achieving the `desired_behavior`. Use this strategy cautiously.
    *   **How:**
        *   Remove the specific problematic instruction line(s).
        *   Change strong directives (`MUST`) to softer ones (`SHOULD`, `CONSIDER`).
        *   Add caveats like "Unless specifically requested otherwise..."
    *   **Example:** If feedback says "refused to provide detail X because of 'be concise' rule, but detail X was essential", consider changing "MUST be concise" to "SHOULD be concise, but prioritize providing necessary details when requested."

**Important Considerations:**
*   **Targeted:** Only modify the specific lines/sections identified in the analysis. Avoid rewriting unrelated parts.
*   **Minimal Change:** Prefer the simplest modification that directly addresses the hypothesis.
*   **Rationale:** For *every* suggested change, keep track of *why* you are proposing it (linking back to the feedback and your hypothesis). This is crucial for the next step.
*   **Consistency:** Check if your proposed change might conflict with other instructions in the *same* file or other core mode principles. If so, note the potential conflict.