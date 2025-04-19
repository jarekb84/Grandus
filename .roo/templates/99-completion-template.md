# Standard Completion Response Template

This file defines the standard XML structure to be used within the `<attempt_completion>` tool call for reporting final success or failure. All modes, including this `mode-refiner`, should adhere to this structure for their final response.

```xml
<attempt_completion>
    <result>
        <!-- EITHER <success> OR <error> should be present, not both -->

        <success>
            <!-- Mandatory: Short summary of the successful outcome -->
            <summary><![CDATA[Concise summary of success (e.g., Task completed, Plan generated, Files created)]]></summary>

            <!-- Optional: Detailed report, often Markdown or potentially structured data -->
            <report format="markdown"><![CDATA[## Detailed Report Title
            - Point 1
            - Point 2
            (Can be empty if no detailed report is generated)
            ]]></report>

            <!-- Optional: List of files created -->
            <artifacts_generated>
                <file path="./docs/projects/proj-a/project-01-alpha.md"/>
                <file path="./docs/projects/proj-a/project-02-beta.md"/>
                <!-- Add more <file> elements as needed -->
            </artifacts_generated>

            <!-- Optional: List of files significantly modified (if not handled before the call) -->
            <artifacts_modified>
                 <file path="./src/feature/component.tsx"/>
                 <file path="./src/utils/helper.ts"/>
                 <!-- Add more <file> elements as needed -->
            </artifacts_modified>

             <!-- Optional: Structured user feedback about the mode's performance -->
            <userFeedback>
                <!-- target_mode_slug helps the orchestrator route the feedback -->
                <feedback target_mode_slug="architect-planner">
                    <comment><![CDATA[The architect planner was helpful but the report formatting was a bit dense. Maybe use more headings?]]></comment>
                </feedback>
                <!-- Can have multiple feedback elements if needed, though typically one per task -->
            </userFeedback>
        </success>

        <error>
            <!-- Mandatory: Clear message explaining the failure -->
            <message><![CDATA[Specific reason why the task failed (e.g., File not found, Ambiguous instructions, Prerequisite missing)]]></message>

            <!-- Optional: More technical details or context for the error -->
            <details><![CDATA[Optional additional details, like conflicting file state, specific missing function name, etc. (Could be empty)]]></details>

             <!-- Optional: Even on error, user might provide feedback -->
             <userFeedback>
                <feedback target_mode_slug="code-executor">
                    <comment><![CDATA[The code-executor failed because the instructions were apparently unclear. The mode should ask for clarification instead of just failing.]]></comment>
                </feedback>
            </userFeedback>
        </error>

    </result>
</attempt_completion>
```