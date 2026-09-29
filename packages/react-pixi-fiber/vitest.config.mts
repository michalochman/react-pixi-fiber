import { createVitestConfig } from "../../scripts/vitest.config.ts";

// The core stays on PixiJS 6, so the banner setup file stays. test/setup.ts configures react-18 and the builtins.
export default createVitestConfig({ setupFiles: ["./config/vitest/setupPixi.js", "./test/setup.ts"] });
