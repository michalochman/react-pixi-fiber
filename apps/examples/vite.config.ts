import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // animated reads Node's `global`, which webpack used to provide.
  define: {
    global: "globalThis",
  },
});
