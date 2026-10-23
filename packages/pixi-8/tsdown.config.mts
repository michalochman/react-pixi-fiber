import { createTsdownConfig } from "../../scripts/tsdown.config.ts";

export default createTsdownConfig({
  name: "pixi-8",
  // `all` is its own chunk, so a bundler drops it, and every PixiJS class it lists, when the app calls only
  // `pixi8WithComponents`. In the same chunk as the factory, every class stays.
  entries: { all: "src/all.ts", "compat/pixi6": "src/compat/pixi6.ts" },
  external: ["pixi.js"],
  tsconfig: "tsconfig.build.json",
});
