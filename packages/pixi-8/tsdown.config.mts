import { createTsdownConfig } from "../../scripts/tsdown.config.ts";

export default createTsdownConfig({
  name: "pixi-8",
  external: ["pixi.js", "react-pixi-fiber"],
  tsconfig: "tsconfig.build.json",
});
