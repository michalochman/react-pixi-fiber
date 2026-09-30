import { createVitestConfig } from "../../../scripts/vitest.config.ts";

// RPF_DIST=es runs the suite against the ES builds instead of the sources.
export default createVitestConfig({
  root: import.meta.dirname,
  dist: process.env.RPF_DIST === "es" ? "es" : undefined,
});
