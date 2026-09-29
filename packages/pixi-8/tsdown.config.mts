import { createTsdownConfig } from "../../scripts/tsdown.config.ts";

export default createTsdownConfig({
  name: "pixi-8",
  entries: { "compat/pixi6": "src/compat/pixi6.ts" },
  external: ["pixi.js"],
  tsconfig: "tsconfig.build.json",
});
