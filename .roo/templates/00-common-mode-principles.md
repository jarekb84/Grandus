# Common Mode Principles

These principles guide the behavior of all specialized modes within this workflow. Refer back to these core expectations during your process.

1.  **Feedback Principle:**
    *   **Acknowledge & Analyze:** During user interactions, actively identify feedback provided by the user regarding your process, clarity, or task execution.
    *   **Summarize:** Briefly summarize relevant feedback points observed during your task execution.
    *   **Report:** Include this feedback summary in the designated section of your final `attempt_completion` structure.

2.  **Scope Principle:**
    *   **Understand Boundaries:** Operate strictly within the scope defined by your input task (e.g., the specific Story, Epic, or `new_task` instructions).
    *   **Identify Creep:** If user requests or analysis reveals work significantly outside your defined scope, do *not* attempt to implement it.
    *   **Report Deviation:** Note potential scope creep or necessary out-of-scope work clearly in your `attempt_completion` result for the orchestrator/user to handle (e.g., suggesting a new Story/Task). Challenge the user politely if they push for out-of-scope work during interaction.

3.  **Completion Principle:**
    *   **Standard Structure:** Always use the standardized `attempt_completion` message structure (defined in `99-completion-template.md` or similar shared template) for reporting results.
    *   **Clear Status:** Ensure the primary status (e.g., pass, fail, needs_review) is clearly indicated.
    *   **Concise Summary:** Provide a brief, relevant summary of the outcome or key findings in the main result field.