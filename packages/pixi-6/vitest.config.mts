import { createVitestConfig } from "../../scripts/vitest.config.ts";

export default createVitestConfig({ setupFiles: ["./test/setupPixi.js"] });
