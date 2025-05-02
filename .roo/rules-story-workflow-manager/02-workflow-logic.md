# Workflow Logic and State Machine

This document details the step-by-step workflow you must follow, driven by the `status:` field in the User Story file.

## Required Tools

*   `read-file`: To read the User Story content *for analysis* (e.g., by specialists, or if you need content beyond status/tasks). **Not for reading status/tasks.**
*   **Story MCP Server**: tool commands to interact with story and task statuses (e.g., `getStatus`, `setStatus`, `getPendingTasks`).
*   `new_task`: To delegate tasks to specialist modes.
*   `ask-followup-question`: To communicate status, progress, and blocking issues to the user.

## Workflow Steps

1.  **Initialization:**
    *   Receive the input User Story file path.
    *   Use `getStatus <filePath>` tool to call Story MCP
    *   If it fails (e.g., `ERR_NO_STATUS_HEADER`), consider calling MCP `initializeStatus <filePath>` and then `getStatus` again. If still no status, treat as `needs_grooming`.

2.  **State Evaluation and Delegation Loop:**
    *   Read the current status using MCP `getStatus <filePath>`.
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
            *   **Continue Workflow:**
                *   **Continue Workflow:** Get the current status using MCP `getStatus <filePath>`. Continue the loop based on this status. (The logic for handling `code-executor` specifically is now within the `coding_in_progress` state).
        *   On **Failure**: Use MCP `setStatus <filePath> blocked`. Report failure/block to user. Halt processing.
    *   Loop continues until status is `completed`, `blocked`, or an unimplemented step is reached.

3.  **Workflow Steps by Status:**

    *   **If `status` is `(None)`, `defined`, or `needs_grooming`:**
        *   **Communicate:** Inform user: "Story status is '[status]'. Delegating to `story-groomer`."
        *   **Action:** Delegate to `story-groomer`.
        *   **`new_task` Details:**
            *   `mode`: `story-groomer`
            *   `input_artifact`: [Path to the User Story file]
            *   `goal`: "Groom this user story. Ensure clarity, add acceptance criteria, and verify readiness. **Update the story file content as needed. Do NOT update the overall story status field.**"
        *   **(Processing handled by loop logic)**

    *   **If `status` is `groomed` or `needs_architect_plan`:**
        *   **Communicate:** Inform user: "Story status is '[status]'. Delegating to `architect-planner` for technical planning."
        *   **Action:** Delegate to `architect-planner`.
        *   **`new_task` Details:**
            *   `mode`: `architect-planner`
            *   `input_artifact`: [Path to the User Story file]
            *   `goal`: "Analyze this groomed user story and create a high-level technical implementation plan (Story-level plan). Embed this plan within the story file (e.g., under '## Technical Plan'). **Update the story file content as needed. Do NOT update the overall story status field.**"
        *   **(Processing handled by loop logic)**

    *   **If `status` is `plan_approved`:**
        *   **Communicate:** Inform user: "Story status is 'plan_approved'. Plan approved. Updating status to 'Coding In Progress' and initiating implementation."
        *   **Action:**
            1.  **Update Status:** Use MCP `setStatus <filePath> coding_in_progress`.
            2.  **Initiate Coding:** Continue the loop; the next iteration will enter the `coding_in_progress` state.

    *   **If `status` is `coding_in_progress`:**
        *   **Action:** Execute Task Sequence:
            1.  **Check for Pending Tasks:** Use MCP `getPendingTasks <filePath>`.
            2.  **Evaluate Result:**
                *   If the command fails or returns an empty list `[]`:
                    *   **Communicate:** Inform user: "All implementation tasks completed. Updating story status to 'Code Complete'."
                    *   **Update Story Status:** Use MCP `setStatus <filePath> code_complete`.
                    *   **Continue Workflow:** Exit this `coding_in_progress` block and continue the main loop (will read new status).
                *   If the command returns a list of pending task IDs:
                    *   Identify the **first** task ID in the list (e.g., `nextTaskId`).
                    *   **Communicate:** Inform user: "Story status is 'Coding In Progress'. Delegating task '[nextTaskId]' to `code-executor`."
                    *   **Delegate Task:** Call `new_task` for `code-executor`.
                        *   **`new_task` Details:**
                            *   `mode`: `code-executor`
                            *   `input_artifact`: [Path to the User Story file]
                            *   `task_id`: `[nextTaskId]` (Pass the specific ID)
                            *   `goal`: "Execute the technical task identified by `task_id: [nextTaskId]` found within the User Story file (`input_artifact`). Apply the necessary code changes. **Upon successful completion, use the Story MCP Server command `completeTask [input_artifact] [nextTaskId]` to mark this specific task as done.** Do NOT modify the overall story status or other tasks."
                    *   **Await Result:** Wait for `attempt_completion` from `code-executor`.
                    *   **On Success:**
                        *   **(Process User Feedback if present - as per existing logic)**
                        *   **Communicate:** Inform user: "`code-executor` completed task '[nextTaskId]'."
                        *   **Loop:** Stay in the `coding_in_progress` state. The loop will re-run Step 1 (Check for Pending Tasks).
                    *   **On Failure:**
                        *   Use MCP `setStatus <filePath> blocked`. Report failure/block to user. Halt processing.

    *   **If `status` is `code_complete`:**
        *   **Communicate:** Inform user: "Coding phase complete for [Story File Path]."
        *   **Action:** Ask user for next steps.
            *   Use `ask_followup_question` with:
                *   `question`: "Is there anything else you'd like me to do for this story?"
                *   `follow_up`:
                    *   `<suggest>No, create commit message and proceed to completion.</suggest>`
                    *   `<suggest>Yes, I have further instructions.</suggest>`
            *   **Await User Response:**
                *   If user selects "No":
                    *   **Communicate:** Inform user: "Okay, providing commit message suggestion and marking story as complete."
                    *   **Commit Message:**  Generate a concise commit message (5-10 words) summarizing the changes from [Story File Path]."
                    *   **Update Status:** Use MCP `setStatus <filePath> completed`.
                *   If user selects "Yes":
                    *   **Communicate:** Inform user: "Okay, awaiting your further instructions for [Story File Path]."
                    *   **Action:** Halt processing and wait for the user's next message.

    *   **If `status` is `completed`:**
        *   **Communicate:** Inform the user: "Story workflow successfully completed for [Story File Path]."
        *   **Action:** Halt processing.

    *   **If `status` is `blocked`:**
        *   **Communicate:** Inform the user: "Story workflow is blocked for [Story File Path]. Manual intervention may be required."
        *   **Action:** Halt processing.

4.  **Termination:** Processing stops when the story reaches `completed`, `blocked`, or encounters a step not yet implemented.