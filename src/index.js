import CustomPIXIComponent from "./CustomPIXIComponent";
import { AppContext, AppProvider, withApp } from "./AppProvider";
import Stage from "./Stage";
import { TYPES } from "./types";
import { createRender, createUnmount } from "./render";
import { ReactPixiFiberAsPrimaryRenderer, applyProps, unstable_batchedUpdates } from "./ReactPixiFiber";

const render = createRender(ReactPixiFiberAsPrimaryRenderer)
const unmount = createUnmount(ReactPixiFiberAsPrimaryRenderer)

/* Public API */

export { AppContext, AppProvider, CustomPIXIComponent, Stage, applyProps, render, unmount, withApp, unstable_batchedUpdates };

export const BitmapText = TYPES.BITMAP_TEXT;
export const Container = TYPES.CONTAINER;
export const Graphics = TYPES.GRAPHICS;
export const ParticleContainer = TYPES.PARTICLE_CONTAINER;
export const Sprite = TYPES.SPRITE;
export const Text = TYPES.TEXT;
export const TilingSprite = TYPES.TILING_SPRITE;
