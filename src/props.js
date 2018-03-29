export const CHILDREN = "children";

// List of default values for DisplayObject members
// TODO set different default props for different types
export const DEFAULT_PROPS = {
  alpha: 1,
  anchor: 0,
  buttonMode: false,
  cacheAsBitmap: false,
  cursor: "auto",
  filterArea: null,
  filters: null,
  hitArea: null,
  interactive: false,
  // localTransform  // readonly
  mask: null,
  // parent  // readonly
  pivot: 0,
  position: 0,
  renderable: true,
  rotation: 0,
  scale: 1,
  skew: 0,
  tint: 0xffffff,
  transform: null,
  visible: true,
  // worldAlpha  // readonly
  // worldTransform  // readonly
  // worldVisible  // readonly
  x: 0,
  y: 0,
};

// List of all Pixi events
export const EVENT_PROPS = [
  "added",
  "click",
  "mousedown",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "mouseupoutside",
  "pointercancel",
  "pointerdown",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointertap",
  "pointerup",
  "pointerupoutside",
  "removed",
  "rightclick",
  "rightdown",
  "rightup",
  "rightupoutside",
  "tap",
  "touchcancel",
  "touchend",
  "touchendoutside",
  "touchmove",
  "touchstart",
];
