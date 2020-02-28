// Based on: https://github.com/facebook/react/blob/27535e7bfcb63e8a4d65f273311e380b4ca12eff/packages/react-dom/src/shared/possibleStandardNames.js
import { TYPES } from "./types";

// http://pixijs.download/release/docs/PIXI.DisplayObject.html
const eventsStandardNames = {
  added: "added",
  click: "click",
  mousedown: "mousedown",
  mousemove: "mousemove",
  mouseout: "mouseout",
  mouseover: "mouseover",
  mouseup: "mouseup",
  mouseupoutside: "mouseupoutside",
  pointercancel: "pointercancel",
  pointerdown: "pointerdown",
  pointermove: "pointermove",
  pointerout: "pointerout",
  pointerover: "pointerover",
  pointertap: "pointertap",
  pointerup: "pointerup",
  pointerupoutside: "pointerupoutside",
  removed: "removed",
  rightclick: "rightclick",
  rightdown: "rightdown",
  rightup: "rightup",
  rightupoutside: "rightupoutside",
  tap: "tap",
  touchcancel: "touchcancel",
  touchend: "touchend",
  touchendoutside: "touchendoutside",
  touchmove: "touchmove",
  touchstart: "touchstart",
};

// http://pixijs.download/release/docs/PIXI.DisplayObject.html
const displayObjectStandardNames = {
  ...eventsStandardNames,
  alpha: "alpha",
  angle: "angle",
  buttonmode: "buttonMode",
  cacheasbitmap: "cacheAsBitmap",
  cursor: "cursor",
  filterarea: "filterArea",
  filters: "filters",
  hitarea: "hitArea",
  interactive: "interactive",
  mask: "mask",
  name: "name",
  pivot: "pivot",
  position: "position",
  renderable: "renderable",
  rotation: "rotation",
  scale: "scale",
  skew: "skew",
  transform: "transform",
  visible: "visible",
  x: "x",
  y: "y",
};

// http://pixijs.download/release/docs/PIXI.Container.html
const containerStandardNames = {
  ...displayObjectStandardNames,
  height: "height",
  interactivechildren: "interactiveChildren",
  sortablechildren: "sortableChildren",
  sortdirty: "sortDirty",
  width: "width",
};

// http://pixijs.download/release/docs/PIXI.Sprite.html
const spriteStandardNames = {
  ...containerStandardNames,
  anchor: "anchor",
  blendmode: "blendMode",
  pluginname: "pluginName",
  roundpixels: "roundPixels",
  shader: "shader",
  texture: "texture",
  tint: "tint",
};

// http://pixijs.download/release/docs/PIXI.extras.BitmapText.html
const bitmapTextStandardNames = {
  ...containerStandardNames,
  align: "align",
  anchor: "anchor",
  font: "font",
  letterspacing: "letterSpacing",
  maxwidth: "maxWidth",
  roundpixels: "roundPixels",
  style: "style",
  text: "text",
  tint: "tint",
};

// http://pixijs.download/release/docs/PIXI.Graphics.html
const graphicsStandardNames = {
  ...containerStandardNames,
  blendmode: "blendMode",
  geometry: "geometry",
  pluginname: "pluginName",
  tint: "tint",
};

// http://pixijs.download/release/docs/PIXI.particles.ParticleContainer.html
const particleContainerStandardNames = {
  ...containerStandardNames,
  autoresize: "autoResize",
  batchsize: "batchSize",
  blendmode: "blendMode",
  interactivechildren: "interactiveChildren",
  maxsize: "maxSize",
  properties: "properties",
  roundpixels: "roundPixels",
  tint: "tint",
};

// http://pixijs.download/release/docs/PIXI.Text.html
const textStandardNames = {
  ...spriteStandardNames,
  canvas: "canvas",
  context: "context",
  resolution: "resolution",
  style: "style",
  text: "text",
};

// http://pixijs.download/release/docs/PIXI.extras.TilingSprite.html
const tilingSpriteStandardNames = {
  ...spriteStandardNames,
  clampmargin: "clampMargin",
  tileposition: "tilePosition",
  tilescale: "tileScale",
  tiletransform: "tileTransform",
  uvrespectanchor: "uvRespectAnchor",
  uvmatrix: "uvMatrix",
};

const possibleStandardNames = {
  [TYPES.BITMAP_TEXT]: bitmapTextStandardNames,
  [TYPES.CONTAINER]: containerStandardNames,
  [TYPES.GRAPHICS]: graphicsStandardNames,
  [TYPES.PARTICLE_CONTAINER]: particleContainerStandardNames,
  [TYPES.SPRITE]: spriteStandardNames,
  [TYPES.TEXT]: textStandardNames,
  [TYPES.TILING_SPRITE]: tilingSpriteStandardNames,
};

export default possibleStandardNames;
