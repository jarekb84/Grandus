import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths"; // Import the plugin

// https://vitejs.dev/config/
export default defineConfig({
  // Add tsconfigPaths() to the plugins array
  plugins: [react(), tsconfigPaths()],
});
