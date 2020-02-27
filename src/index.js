import CustomPIXIComponent from "./CustomPIXIComponent";
import { AppContext, AppProvider, withApp } from "./AppProvider";
import Stage, { createStageClass } from "./Stage";
import { TYPES } from "./types";
import { usePixiApp, usePixiTicker, usePixiAppCreator } from "./hooks";
import { createRender, createUnmount } from "./render";
import { ReactPixiFiberAsPrimaryRenderer, applyProps, unstable_batchedUpdates } from "./ReactPixiFiber";

const render = createRender(ReactPixiFiberAsPrimaryRenderer);
const unmount = createUnmount(ReactPixiFiberAsPrimaryRenderer);

/* Public API */

export {
  AppContext,
  AppProvider,
  CustomPIXIComponent,
  Stage,
  applyProps,
  createStageClass,
  render,
  unmount,
  withApp,
  usePixiApp,
  usePixiTicker,
  usePixiAppCreator,
  unstable_batchedUpdates,
};

export const BitmapText = TYPES.BITMAP_TEXT;
export const Container = TYPES.CONTAINER;
export const Graphics = TYPES.GRAPHICS;
export const NineSlicePlane = TYPES.NINE_SLICE_PLANE;
export const ParticleContainer = TYPES.PARTICLE_CONTAINER;
export const Sprite = TYPES.SPRITE;
export const Text = TYPES.TEXT;
export const TilingSprite = TYPES.TILING_SPRITE;
