// pixi-layers augments `PIXI.DisplayObject` at runtime. Its bundled typings target the PixiJS v4/v5 global
// namespace and do not merge with the pixi.js v6 module, so declare the properties this example uses here.
// `CustomPIXIProperty` registers the same properties for react-pixi-fiber at runtime, see `index.tsx`.
import "@pixi/display";

declare module "@pixi/display" {
  interface DisplayObject {
    parentGroup?: unknown;
    zOrder?: number;
  }
}
