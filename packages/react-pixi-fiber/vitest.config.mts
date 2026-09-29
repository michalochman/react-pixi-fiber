import { createVitestConfig } from "../../scripts/vitest.config.ts";

// The core stays on PixiJS 6, so the banner setup file stays.
export default createVitestConfig({ setupFiles: ["./config/vitest/setupPixi.js"] });
