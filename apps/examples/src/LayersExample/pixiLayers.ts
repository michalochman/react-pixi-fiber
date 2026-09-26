// pixiGlobal has to run before pixi-layers, so it is a separate module imported first.
import "./pixiGlobal";
import "pixi-layers/dist/pixi-layers.js";

// pixi-layers typings target the PixiJS v4/v5 global namespace, keep `any` here
// pixi-layers adds `display` to the global copy, not to the pixi.js module, so read it from there.
export const display: any = (window as any).PIXI.display;
