import { TYPES } from "./types";
import * as PIXI from "pixi.js";

export const CHILDREN = "children";

// https://pixijs.download/v6.5.10/docs/PIXI.DisplayObject.html
const displayObjectDefaultProps = {
  alpha: 1,
  angle: 0,
  buttonMode: false,
  cacheAsBitmap: false,
  cursor: "auto",
  interactive: false,
  pivot: 0,
  position: 0,
  renderable: true,
  rotation: 0,
  scale: 1,
  skew: 0,
  visible: true,
  x: 0,
  y: 0,
};

// https://pixijs.download/v6.5.10/docs/PIXI.Container.html
const containerDefaultProps = {
  ...displayObjectDefaultProps,
  interactiveChildren: true,
};

// https://pixijs.download/v6.5.10/docs/PIXI.Sprite.html
const spriteDefaultProps = {
  ...containerDefaultProps,
  anchor: 0,
  blendMode: PIXI.BLEND_MODES.NORMAL,
  pluginName: "batch",
  roundPixels: false,
  tint: 0xffffff,
};

// https://pixijs.download/v6.5.10/docs/PIXI.BitmapText.html
const bitmapTextDefaultProps = {
  ...containerDefaultProps,
  align: "left",
  anchor: 0,
  letterSpacing: 0,
  maxWidth: 0,
  roundPixels: false,
  text: "",
  tint: 0xffffff,
};

// https://pixijs.download/v6.5.10/docs/PIXI.Graphics.html
const graphicsDefaultProps = {
  ...containerDefaultProps,
  blendMode: PIXI.BLEND_MODES.NORMAL,
  pluginName: "batch",
  tint: 0xffffff,
};

// https://pixijs.download/v6.5.10/docs/PIXI.ParticleContainer.html
const particleContainerDefaultProps = {
  ...containerDefaultProps,
  autoResize: false,
  batchSize: 16384,
  blendMode: PIXI.BLEND_MODES.NORMAL,
  interactiveChildren: true,
  maxSize: 1500,
  roundPixels: true,
  tint: 0xffffff,
};

// https://pixijs.download/v6.5.10/docs/PIXI.Text.html
const textDefaultProps = {
  ...spriteDefaultProps,
  resolution: 1,
  text: "",
};

// https://pixijs.download/v6.5.10/docs/PIXI.TilingSprite.html
const tilingSpriteDefaultProps = {
  ...spriteDefaultProps,
  clampMargin: 0.5,
  uvRespectAnchor: false,
};

export const defaultProps = {
  [TYPES.BITMAP_TEXT]: bitmapTextDefaultProps,
  [TYPES.CONTAINER]: containerDefaultProps,
  [TYPES.GRAPHICS]: graphicsDefaultProps,
  [TYPES.PARTICLE_CONTAINER]: particleContainerDefaultProps,
  [TYPES.SPRITE]: spriteDefaultProps,
  [TYPES.TEXT]: textDefaultProps,
  [TYPES.TILING_SPRITE]: tilingSpriteDefaultProps,
};
