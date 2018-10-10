import CustomPIXIComponent from "./CustomPIXIComponent";
import { AppContext, AppProvider, withApp } from "./AppProvider";
import Stage from "./Stage";
import { TYPES } from "./types";
import { render } from "./render";

/* Public API */

export { AppContext, AppProvider, CustomPIXIComponent, Stage, render, withApp };

export const BitmapText = TYPES.BITMAP_TEXT;
export const Container = TYPES.CONTAINER;
export const Graphics = TYPES.GRAPHICS;
export const ParticleContainer = TYPES.PARTICLE_CONTAINER;
export const Sprite = TYPES.SPRITE;
export const Text = TYPES.TEXT;
export const TilingSprite = TYPES.TILING_SPRITE;
