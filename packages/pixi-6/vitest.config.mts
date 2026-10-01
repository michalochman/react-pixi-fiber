import { createVitestConfig } from "../../scripts/vitest.config.ts";

export default createVitestConfig({ root: import.meta.dirname, setupFiles: ["./test/setupPixi.js"] });
