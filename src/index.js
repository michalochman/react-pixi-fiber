import CustomPIXIComponent from "./CustomPIXIComponent";
import { AppContext, AppProvider, withApp } from "./AppProvider";
import Stage, { createStageClass } from "./Stage";
import { TYPES } from "./types";
import { usePixiApp, usePixiTicker } from "./hooks";
import ReactPixiFiberLegacyFactory from "./ReactPixiFiberLegacyFactory";
import ReactPixiFiberRootFactory from "./ReactPixiFiberRootFactory";
import { ReactPixiFiberAsPrimaryRenderer, unstable_batchedUpdates } from "./ReactPixiFiber";
import { applyDisplayObjectProps } from "./ReactPixiFiberComponent";

const ReactPixiFiberRoot = ReactPixiFiberRootFactory(ReactPixiFiberAsPrimaryRenderer);
const createBlockingRoot = ReactPixiFiberRoot.createBlockingRoot;
const createRoot = ReactPixiFiberRoot.createRoot;
const ReactPixiFiberLegacy = ReactPixiFiberLegacyFactory(ReactPixiFiberAsPrimaryRenderer);
const render = ReactPixiFiberLegacy.render;
const unmount = ReactPixiFiberLegacy.unmount;

/* Public API */

export {
  AppContext,
  AppProvider,
  CustomPIXIComponent,
  Stage,
  applyDisplayObjectProps,
  createBlockingRoot,
  createRoot,
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
