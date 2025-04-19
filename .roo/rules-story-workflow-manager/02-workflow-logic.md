# Workflow Logic and State Machine

This document details the step-by-step workflow you must follow, driven by the `status:` field in the User Story file.

## Required Tools

*   `read-file`: To read the User Story content and determine its current status.
*   `write-to-file`: **Used ONLY to update the status to `blocked` if a sub-task fails.**
*   `new_task`: To delegate tasks to specialist modes.
*   `ask-followup-question`: To communicate status, progress, and blocking issues to the user.

## Workflow Steps

1.  **Initialization:**
    *   Receive the input User Story file path.
    *   Use `read-file` to load the content and identify the current `status:`. If missing, treat as `needs_grooming`.

2.  **State Evaluation and Delegation Loop:**
    *   Read the current `status:` from the story file using `read-file`.
    *   Based on the status, execute the corresponding step below.
    *   If a step involves delegation:
        *   Call `new_task` with the specified details.
        *   Await `attempt_completion` result.
        *   On **Success**:
            *   Inform user.
            *   Check the result for user feedback. If feedback is present (e.g., in a specific XML tag structure in the response):
                *   Identify the target mode from the feedback structure.
                *   Spawn a new `mode-refiner` task with the feedback details.
                *   **`new_task` Details for mode-refiner:**
                    *   `mode`: `mode-refiner`
                    *   `message`: "User feedback received for mode [target_mode_slug]: [feedback content]"
                *   After spawning the mode-refiner task, **re-read the story file** using `read-file` to get the *new* status (which should have been updated by the specialist). Continue the loop with the new status.
            *   If no user feedback is present:
                *   **Re-read the story file** using `read-file` to get the *new* status (which should have been updated by the specialist). Continue the loop with the new status.
        *   On **Failure**: Use `write-to-file` to update the story file's status to `blocked`. Report failure/block to user. Halt processing.
    *   Loop continues until status is `completed`, `blocked`, or an unimplemented step is reached.

3.  **Workflow Steps by Status:**

    *   **If `status` is `(None)`, `defined`, or `needs_grooming`:**
        *   **Communicate:** Inform user: "Story status is '[status]'. Delegating to `story-groomer`."
        *   **Action:** Delegate to `story-groomer`.
        *   **`new_task` Details:**
            *   `mode`: `story-groomer`
            *   `input_artifact`: [Path to the User Story file]
            *   `goal`: "Groom this user story. Ensure clarity, add acceptance criteria, and verify readiness. **Upon successful completion, update the story file content AND set its status to `groomed` (or `needs_architect_plan` if appropriate).**"
        *   **(Processing handled by loop logic)**

    *   **If `status` is `groomed` or `needs_architect_plan`:**
        *   **Communicate:** Inform user: "Story status is '[status]'. Delegating to `architect-planner` for technical planning."
        *   **Action:** Delegate to `architect-planner`.
        *   **`new_task` Details:**
            *   `mode`: `architect-planner`
            *   `input_artifact`: [Path to the User Story file]
            *   `goal`: "Analyze this groomed user story and create a high-level technical implementation plan (Story-level plan). Embed this plan within the story file (e.g., under '## Technical Plan'). **Upon successful completion, update the story file content AND set its status to `plan_approved` (or `ready_for_coding`).**"
        *   **(Processing handled by loop logic)**

    *   **If `status` is `plan_approved` or `ready_for_coding`:**
        *   **Communicate:** Inform user: "Story status is '[status]'. Technical plan approved. Delegating implementation to `code-executor`."
        *   **Action:** Delegate to `code-executor`.
        *   **`new_task` Details:**
            *   `mode`: `code-executor`
            *   `input_artifact`: [Path to the User Story file]
            *   `goal`: "Execute the implementation plan detailed within this User Story file. Apply the necessary code changes to the codebase. **Upon successful completion of all implementation tasks, update the story file's status to `coding_complete` (or `needs_code_review` if review is the immediate next step).** Ensure all code changes are saved/staged as appropriate."
        *   **(Processing handled by loop logic):** Await `attempt_completion`. On success, re-read status and continue. On failure, set status to `blocked` and halt.

    *   **If `status` is `coding_complete` or `needs_code_review`:**
        *   **Communicate:** Inform user: "Story status is '[status]'."
        *   **Action:** **[Placeholder]** Delegate to `code-reviewer`.
        *   `<!-- TODO: Define new_task call for code-reviewer -->`
        *   `<!-- Goal should instruct code-reviewer to update status to review_passed/needs_user_feedback on success -->`
        *   **(For now): Report to user that this step is not yet implemented and halt processing.**

    *   `<!-- ... (Placeholders for user-feedback, completion-manager similarly structured) ... -->`

    *   **If `status` is `completed`:**
        *   **Communicate:** Inform the user: "Story workflow successfully completed for [Story File Path]."
        *   **Action:** Halt processing.

    *   **If `status` is `blocked`:**
        *   **Communicate:** Inform the user: "Story workflow is blocked for [Story File Path]. Manual intervention may be required."
        *   **Action:** Halt processing.

4.  **Termination:** Processing stops when the story reaches `completed`, `blocked`, or encounters a step not yet implemented.