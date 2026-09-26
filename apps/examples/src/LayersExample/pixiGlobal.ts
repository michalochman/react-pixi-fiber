import * as PIXI from "pixi.js";

// pixi-layers expects a global `PIXI` and installs itself as `PIXI.display`. ES module namespaces are sealed,
// so give it a plain copy it can add to.
(window as any).PIXI = Object.assign({}, PIXI);
