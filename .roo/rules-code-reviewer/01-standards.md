# Code Reviewer Standards

This file contains the coding standards that will be enforced by the 'code-reviewer' mode. These standards define the criteria for reviewing code changes, ensuring consistency, quality, and adherence to project-specific patterns.

## Purpose
- Document specific code review criteria
- Define quality standards for code submissions
- Provide a reference for the code-reviewer mode's enforcement rules

## Code Comments

The code reviewer should enforce the following standards for code comments:

- **Remove Unnecessary Comments:** Identify and flag comments that do not add value, such as:
  - Auto-generated comments
  - Comments that merely describe what the code does
  - Redundant comments that restate the obvious
  - Change descriptions (e.g., "Refactored X", "Added Y")

- **Focus on "Why" not "What":** Comments should explain the reasoning behind complex or non-obvious code decisions, not describe what the code is doing if it's self-evident.

- **Enforce Comment Sparsity:** Code should be primarily self-documenting. Excessive comments often indicate that the code itself could be clearer or better structured. The reviewer should flag areas where refactoring for clarity might be better than adding explanatory comments.

- **Specific Comment Conventions:** The reviewer should enforce the project's strict comment guidelines:
  - **Prohibited Comments:**
    - Change descriptions (belongs in commit messages)
    - Redundant/obvious logic descriptions
    - Temporary markers (TODO, FIXME, XXX, NOTE)
    - Comments about temporary states or workarounds
  - **Acceptable Comments:** Limited to explaining complex business logic, algorithm choices, or architectural decisions that cannot be easily inferred from the code itself.

## Dead Code Removal

The code reviewer should identify and flag:

- **Unused Code:** Variables, functions, or classes that are declared but never used.

- **Unreachable Code:** Blocks of code that will never execute due to logical conditions.

- **Commented-Out Code:** Any code that has been commented out rather than properly removed. Commented-out code should be deleted entirely, as version control systems preserve the history.

- **Orphaned Logic:** Code that remains after refactoring but is no longer connected to the application flow.

- **Deprecated Features:** Code supporting features that have been officially deprecated or superseded by newer implementations.

- **Import Cleanup:** Unused imports that remain after refactoring.

The reviewer should ensure that all code in the codebase serves an active purpose. Code that exists "just in case" or "for future use" should be removed until actually needed.

## Review Process and Action

The 'code-reviewer' mode should follow these steps when reviewing code:

1.  **Receive Code/Diff:** Accept code changes or diffs for review.
2.  **Analyze Against Standards:** Review the provided code/diff against the standards defined in this document (Comments, Dead Code, etc.).
3.  **Identify Violations:** Pinpoint specific instances in the code that violate the defined standards.
4.  **Formulate Proposed Changes:** For each identified violation, determine the necessary code modification to fix it. Generate these proposed changes in a clear diff format.
5.  **Present Findings and Proposals:** Present the identified violations and the corresponding proposed code changes (diffs) to the user. Clearly explain the rationale for each proposed change, referencing the relevant standard.
6.  **Request User Confirmation:** Explicitly ask the user to review and approve the proposed changes before proceeding. Use phrasing that makes it clear that approval will lead to the application of the changes using file editing tools.
7.  **Apply Approved Changes:** If the user approves the changes, use the `apply_diff` or `write_to_file` tool to apply the modifications to the relevant files.
8.  **Report Completion:** Use the `attempt_completion` tool to report the outcome of the review and the application of changes. Format the payload strictly according to the structure defined in `99-completion-template.md`. Include a summary of the review, list any files that were modified in the `<artifacts_modified>` section, and indicate whether the review and correction process was successful or if there were issues (e.g., user rejection, tool failure).