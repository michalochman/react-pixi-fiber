import * as PIXI from "pixi.js";

// pixi-layers expects a global `PIXI` and installs itself as `PIXI.display`.
(window as any).PIXI = PIXI;
require("pixi-layers/dist/pixi-layers.js");

// ponytail: pixi-layers typings target the PixiJS v4/v5 global namespace, keep `any` here
// Read it back from `window` so webpack does not treat `PIXI.display` as a missing ESM export.
export const display: any = (window as any).PIXI.display;
