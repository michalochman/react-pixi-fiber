export const CHILDREN = "children";

// List of props that should be handled in a specific way
export const RESERVED_PROPS = {
  [CHILDREN]: true, // special handling in React
};

// List of default values for DisplayObject members
export const DEFAULT_PROPS = {
  alpha: 1,
  buttonMode: false,
  cacheAsBitmap: false,
  cursor: "auto",
  filterArea: null,
  filters: null,
  hitArea: null,
  interactive: false,
  // localTransform  // readonly
  mask: null,
  // TODO move parent to RESERVED_PROPS?
  // parent  // readonly
  pivot: 0,
  position: 0,
  renderable: true,
  rotation: 0,
  scale: 1,
  skew: 0,
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
  "removed",
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
