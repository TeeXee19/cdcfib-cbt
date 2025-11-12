// https://vitejs.dev/config/
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load the correct environment variables based on mode
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    define: {
      "process.env": env,
    },
    resolve: {
      alias: {
        "@": "/src", // Adjust based on your project structure
         '@asset':'/public',
      },
    },
    optimizeDeps: {
      include: ["@mui/material/Box"],
    },
    envPrefix: "APP",
  };
});

