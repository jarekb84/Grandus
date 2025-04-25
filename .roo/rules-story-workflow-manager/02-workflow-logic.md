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
            *   Inform user of the successful completion of the delegated task.
            *   **Process User Feedback (if present):**
                *   Check the `attempt_completion` result for user feedback (expected in a specific XML tag structure).
                *   If feedback is present:
                    *   Identify the target mode (`target_mode_slug`) and the specific feedback content.
                    *   Analyze the `specific feedback content` received. Based on the `target_mode_slug` and the nature of the feedback, attempt to identify a *general theme or pattern* that this specific instance represents.
                    *   **Example Generalizations (for story-groomer feedback):**
                        *   Specific: "Removed placeholder text in AC." -> General: "AC contains placeholder text or lacks clarity."
                        *   Specific: "Only the single stone node should remain visible..." -> General: "Visuals presented in story context are misleading or contain unexpected elements."
                        *   Specific: "Stone node should not overlap home base..." -> General: "Visuals/AC are inconsistent with story intent or project principles."
                        *   Specific: "Node needs to be separate from home base..." -> General: "Story context lacks essential technical/design requirements."
                    *   If you are uncertain about the best generalized description for the feedback:
                        *   Use `ask_followup_question` to present 2-3 potential generalized descriptions to the user and ask which one best captures the issue for future mode refinement. Include your recommended option.
                        *   **STOP** processing this story's workflow until the user provides the generalized feedback description. (The workflow will resume once the user's response is received).
                    *   **(Assuming the generalized feedback description is determined, either by your analysis or user input):** Read the content of `./memory-bank/rooModeFeedback.md` using `read-file`.
                    *   Parse the content to find existing *generalized* feedback entries for the identified `target_mode_slug`.
                    *   Check if the determined *generalized* feedback is similar to any existing *generalized* entries for that mode. Similarity should be based on the generalized description.
                    *   If a similar *generalized* entry exists:
                        *   Increment the count associated with that entry (e.g., update a `(count)` indicator next to the generalized feedback).
                        *   Update the content of `./memory-bank/rooModeFeedback.md` with the incremented count using `write-to-file`.
                        *   Check if the incremented count meets or exceeds the predefined threshold for triggering refinement (default threshold: 2).
                        *   If the threshold is met:
                            *   Spawn a new `mode-refiner` task with the recurring generalized feedback details.
                            *   **`new_task` Details for mode-refiner:**
                                *   `mode`: `mode-refiner`
                                *   `message`: "Recurring user feedback received for mode [target_mode_slug] (count [updated count]): [generalized feedback description]"
                    *   If no similar *generalized* entry exists:
                        *   Add the *generalized* feedback as a distinct entry for the `target_mode_slug` to `./memory-bank/rooModeFeedback.md` with an initial count of `(1)`. Include the specific feedback as an example under the generalized entry if helpful for context, but the primary entry is the generalization.
                        *   Update the content of `./memory-bank/rooModeFeedback.md` using `write_to_file`.
                        *   Do NOT spawn a `mode-refiner` task yet, as the threshold has not been met.
                *   Else (If no feedback is present):
                    *   No feedback processing is required.
            *   **Continue Workflow:** **Re-read the story file** using `read-file` to get the *new* status (which should have been updated by the specialist during their task completion). Continue the loop with the new status.
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
        *   **Communicate:** Inform user: "Story status is '[status]'. Technical plan approved. Initiating task-by-task implementation via `code-executor`."
        *   **Action:** Enter Task Execution Sub-Loop:
            1.  **Read Story File:** Use `read-file` to get the current content of the User Story file.
            2.  **Find Next Task:** Parse the content to find the *first* task listed (e.g., under a `## Tasks` section) that is *not* marked as complete (e.g., status is not `complete`, or checkbox `- [ ]` is unchecked).
            3.  **If Incomplete Task Found:**
                *   **Communicate:** Inform user: "Delegating Task: '[Task Description]' to `code-executor`."
                *   **Delegate:** Call `new_task` for `code-executor`.
                *   **`new_task` Details:**
                    *   `mode`: `code-executor`
                    *   `input_artifact`: [Path to the User Story file]
                    *   `goal`: "Find the next incomplete task in the User Story file provided as `input_artifact`. Execute *only that task*. Upon successful completion and code application, update *only that specific task's status* to 'complete' within the story file (e.g., check the box `- [x]` or update a status tag). **Do NOT change the overall story status field.**"
                *   **Await Result:** Wait for `attempt_completion` from `code-executor`.
                *   **On Success:** Go back to Step 1 of this sub-loop (Read Story File) to check for the next task.
                *   **On Failure:** Update the main story status to `blocked` using `write-to-file`. Report failure/block to user. Halt processing.
            4.  **If No Incomplete Task Found:**
                *   **Communicate:** Inform user: "All implementation tasks reported complete by `code-executor`. Updating story status."
                *   **Update Story Status:** Use `write-to-file` to update the *overall story status* to the next appropriate state (e.g., `coding_complete` or `needs_code_review`).
                *   **Continue Workflow:** Exit this sub-loop and proceed to the next step in the main workflow based on the new overall story status.

    *   **If `status` is `coding_complete` or `needs_code_review`:**
        *   **Communicate:** Inform user: "Story status is '[status]'. Delegating to `code-reviewer` for code review and necessary modifications."
        *   **Action:** Delegate to `code-reviewer`.
        *   **`new_task` Details:**
            *   `mode`: `code-reviewer`
            *   `input_artifact`: [Path to the User Story file]
            *   `goal`: "Review the code changes implemented for this User Story. Identify any necessary modifications based on coding standards or the technical plan. **Apply these modifications directly to the codebase.** Upon successful review and application of changes, update the story file's status to `review_passed` (or `needs_user_feedback` if user validation is required next)."
        *   **(Processing handled by loop logic):** Await `attempt_completion`. On success, re-read status and continue. On failure, set status to `blocked` and halt.

    *   `<!-- ... (Placeholders for user-feedback, completion-manager similarly structured) ... -->`

    *   **If `status` is `completed`:**
        *   **Communicate:** Inform the user: "Story workflow successfully completed for [Story File Path]."
        *   **Action:** Halt processing.

    *   **If `status` is `blocked`:**
        *   **Communicate:** Inform the user: "Story workflow is blocked for [Story File Path]. Manual intervention may be required."
        *   **Action:** Halt processing.

4.  **Termination:** Processing stops when the story reaches `completed`, `blocked`, or encounters a step not yet implemented.