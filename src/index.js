import CustomPIXIComponent, { CustomPIXIProperty } from "./CustomPIXIComponent";
import { AppContext, AppProvider, withApp } from "./AppProvider";
import Stage, { createStageClass } from "./Stage";
import { TYPES } from "./types";
import { usePixiApp, usePixiTicker } from "./hooks";
import { createRender, createUnmount } from "./render";
import { ReactPixiFiberAsPrimaryRenderer, unstable_batchedUpdates } from "./ReactPixiFiber";
import { applyDisplayObjectProps } from "./ReactPixiFiberComponent";

const render = createRender(ReactPixiFiberAsPrimaryRenderer);
const unmount = createUnmount(ReactPixiFiberAsPrimaryRenderer);

/* Public API */

export {
  AppContext,
  AppProvider,
  CustomPIXIComponent,
  CustomPIXIProperty,
  Stage,
  applyDisplayObjectProps,
  createStageClass,
  render,
  unmount,
  withApp,
  usePixiApp,
  usePixiTicker,
  unstable_batchedUpdates,
};

export const BitmapText = TYPES.BITMAP_TEXT;
export const Container = TYPES.CONTAINER;
export const Graphics = TYPES.GRAPHICS;
export const ParticleContainer = TYPES.PARTICLE_CONTAINER;
export const Sprite = TYPES.SPRITE;
export const Text = TYPES.TEXT;
export const TilingSprite = TYPES.TILING_SPRITE;
