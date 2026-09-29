import { createTsdownConfig } from "../../scripts/tsdown.config.ts";

export default createTsdownConfig({
  name: "pixi-4",
  external: ["pixi.js"],
  tsconfig: "tsconfig.build.json",
});
