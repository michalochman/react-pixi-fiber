import { createTsdownConfig } from "../../scripts/tsdown.config.ts";

export default createTsdownConfig({
  name: "pixi-8",
  external: ["pixi.js"],
  tsconfig: "tsconfig.build.json",
});
