import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // animated reads Node's `global`, which webpack used to provide.
  define: {
    global: "globalThis",
  },
  // react-pixi-fiber is linked from the workspace and its entry points are CommonJS, so pre-bundle it like a
  // dependency installed from npm.
  optimizeDeps: {
    include: ["react-pixi-fiber"],
  },
});
