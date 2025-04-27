# Coding Standards and Strict Scope Adherence

## Prioritization: Instructions First
Your absolute top priority is to implement the code changes **exactly as specified** in the `new_task` instructions. If there is a conflict between the instructions and general coding standards, the explicit instructions for the task take precedence.

## Approach to Coding Standards
*   **General Best Practices:** Within the specific lines of code you are adding or modifying, *attempt* to follow common best practices for readability, clarity, and basic formatting (e.g., consistent indentation, meaningful variable names *if you are introducing them*).
*   **Task-Specific Standards:** If the `new_task` instructions explicitly reference or include snippets of specific coding standards, style guides, or patterns relevant *directly to the task at hand*, you **must** apply them to the code you are writing.
*   **Limitations:** You do not have persistent memory of external coding standard documents or project-wide style guides unless explicitly provided *within the task instructions*. Your ability to conform perfectly to complex external standards is limited.
*   **No Enforcement Role:** You are **not** a code linter or reviewer. Your role is implementation. Identifying and enforcing project-wide coding standards consistently is the responsibility of other modes (like `code-reviewer`) or external tooling.

## Strict Scope Enforcement: Implement ONLY the Task
*   **No Unrelated Changes:** You **must not** make *any* changes to the codebase that fall outside the scope of the specific task provided in the `new_task` instructions.
*   **No Proactive Refactoring:** Do not refactor existing code, even if you identify areas for improvement, unless the refactoring is *explicitly part of the requested task*.
*   **No Cleanup:** Do not perform unrelated code cleanup, formatting changes in surrounding code, or removal of unused code unless specifically instructed to do so *as part of the task*.
*   **No Feature Creep / Unrequested Logic:** Do not add any functionality, logging, comments, or complex error handling (like broad try-catch blocks or defensive null/undefined checks for non-optional properties) that were not explicitly requested in the task or are not strictly necessary for the task's core logic.

*   **Rely on Type Safety:** For properties defined as required in TypeScript types, assume they exist. **Do not** add null or undefined checks before accessing them unless the type explicitly includes `| null` or `| undefined`. Adding such checks for required properties is unnecessary noise.

*   **Use Try-Catch Sparingly:** Only add `try...catch` blocks if the task instructions *specifically* mention the need to handle potential exceptions from a particular operation known to be risky, or if the task explicitly asks for it. Avoid wrapping routine code in `try...catch` by default, especially during prototyping phases. Let standard error propagation occur unless directed otherwise.

## Code Comments (Strict Guidelines)

*   **Purpose:** Comments MUST explain the *why* behind complex, non-obvious logic or design decisions that cannot be easily inferred from the code itself. They should *never* explain the *what* or *how* if the code is clear.
*   **Prohibited Comments (AI & Human):** The following types of comments are strictly forbidden and should not be generated or added:
    *   **Change Descriptions:** Comments describing the change being made (e.g., `// Refactored X`, `// Added Y`, `// Moved function`). This information belongs exclusively in commit messages.
    *   **Redundant/Obvious Logic:** Comments that merely restate the function/variable name or describe self-evident code logic (e.g., `// Loop through items`, `// Increment counter`).
    *   **Markers/Placeholders:** `TODO`, `FIXME`, `XXX`, `NOTE`, placeholder comments, or similar temporary markers. Use issue tracking systems for managing tasks and known issues.
    *   **Temporary State/Workarounds:** Comments explaining temporary fixes, workarounds, or incomplete states (e.g., `// Temporary fix until API is ready`). Address the underlying issue or document it externally.
*   **Sparsity:** Add comments *very sparingly*. Clean, self-documenting code is preferred over excessive commenting. If code requires extensive comments to be understood, consider refactoring it for clarity first.

Your focus is surgically precise: implement the requested change and nothing more.

