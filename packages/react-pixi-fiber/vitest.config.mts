import { createVitestConfig } from "../../scripts/vitest.config.ts";

// The core tests run on PixiJS 6: setupPixi.js hides its banner, and test/setup.ts configures react-18 and pixi-6.
export default createVitestConfig({
  root: import.meta.dirname,
  setupFiles: ["./config/vitest/setupPixi.js", "./test/setup.ts"],
});
