import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // animated reads Node's `global`, which webpack used to provide.
  define: {
    global: "globalThis",
  },
  // pixi.js and @pixi/layers must share one copy of @pixi/core and @pixi/display: @pixi/layers patches the Renderer
  // it imports, so a second copy leaves the Renderer that pixi.js creates unpatched.
  optimizeDeps: {
    include: ["pixi.js", "@pixi/layers"],
  },
});
