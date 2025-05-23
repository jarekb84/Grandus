import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { spawnSync } from "child_process";
import { z } from "zod";

/** Helper: call your existing CLI script and parse JSON or raw stdout */
function callTool(cmd, filePath, extra) {
  const args = [cmd, filePath].concat(extra != null ? [extra] : []);
  const proc = spawnSync("node", [".roo\\mcp-servers\\story-mcp\\story-mcp.js", ...args], { encoding: "utf8" });
  if (proc.status !== 0) {
    throw new Error(proc.stderr.trim() || `exit code ${proc.status}`);
  }
  return proc.stdout.trim();
}

const server = new McpServer({ name: "StoryMCP", version: "1.0.0" });

// Expose `getStatus(filePath)`
server.tool("getStatus", { filePath: z.string() }, async ({ filePath }) => {
  const out = callTool("getStatus", filePath);
  return { content: [{ type: "text", text: out }] };
});

// Expose `setStatus(filePath,newStatus)`
server.tool("setStatus", {
  filePath: z.string(),
  newStatus: z.string()
}, async ({ filePath, newStatus }) => {
  const out = callTool("setStatus", filePath, newStatus);
  return { content: [{ type: "text", text: out }] };
});

// Expose `getPendingTasks(filePath)`
server.tool("getPendingTasks", { filePath: z.string() }, async ({ filePath }) => {
  const out = callTool("getPendingTasks", filePath);
  return { content: [{ type: "text", text: out }] };
});

// Expose `completeTask(filePath,id)`
server.tool("completeTask", {
  filePath: z.string(),
  id: z.string()
}, async ({ filePath, id }) => {
  const out = callTool("completeTask", filePath, id);
  return { content: [{ type: "text", text: out }] };
});
// Expose `initializeStatus(filePath)`
server.tool("initializeStatus", { filePath: z.string() }, async ({ filePath }) => {
  const out = callTool("initializeStatus", filePath);
  // Attempt to parse potential JSON output from the script
  try {
    const parsedOut = JSON.parse(out);
     // Check if the script signaled an error we should bubble up
     if (parsedOut.error) {
        throw new Error(parsedOut.error);
     }
     // If it's success JSON, return it as text for now
     return { content: [{ type: "text", text: JSON.stringify(parsedOut) }] };
  } catch (e) {
     // If output wasn't JSON or script threw raw error via stderr (handled by callTool)
     // Return raw output or let callTool's error propagate
     return { content: [{ type: "text", text: out }] };
  }
});

// Expose `addTask(filePath, task)`
server.tool("addTask", {
  filePath: z.string(),
  task: z.string()
}, async ({ filePath, task }) => {
  const out = callTool("addTask", filePath, task);
  // Consider parsing 'out' to return structured JSON if needed,
  // but for now, returning raw text output is consistent.
  return { content: [{ type: "text", text: out }] };
});

// Expose `addTasks(filePath, tasks)`
server.tool("addTasks", {
  filePath: z.string(),
  tasks: z.array(z.string()) // Expect an array of strings
}, async ({ filePath, tasks }) => {
  // Convert the tasks array back to a JSON string for the CLI tool
  const tasksJson = JSON.stringify(tasks);
  const out = callTool("addTasks", filePath, tasksJson);
  // Consider parsing 'out' to return structured JSON if needed.
  return { content: [{ type: "text", text: out }] };
});

// Expose `getStoryDetails(filePath)`
server.tool("getStoryDetails", { filePath: z.string() }, async ({ filePath }) => {
const out = callTool("getStoryDetails", filePath);
// The underlying script should output JSON directly for status and tasks
return { content: [{ type: "text", text: out }] };
});

// Hook up stdio transport and start
await server.connect(new StdioServerTransport());
console.error("📖 StoryMCP server listening on stdio");
