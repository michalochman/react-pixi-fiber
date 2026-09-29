import type * as PIXI from "pixi.js";
import type * as React from "react";
import CustomPIXIComponent, { CustomPIXIProperty } from "./CustomPIXIComponent";
import { AppContext, AppProvider, withApp } from "./AppProvider";
import Stage, { createStageClass } from "./Stage";
import { TYPES } from "./tags";
import { usePixiApp, usePixiTicker } from "./hooks";
import { createRender, createUnmount } from "./render";
import { ReactPixiFiberAsPrimaryRenderer } from "./ReactPixiFiber";
import { applyDisplayObjectProps } from "./ReactPixiFiberComponent";
import type {
  BitmapTextProps,
  ContainerProps,
  GraphicsProps,
  NineSlicePlaneProps,
  ParticleContainerProps,
  PixiComponent,
  SpriteProps,
  StageComponent,
  TextProps,
  TilingSpriteProps,
} from "./types";

export * from "./types";

// Standalone ReactPixiFiber render method.
const render: (
  pixiElement: React.ReactElement<any> | React.ReactElement<any>[] | PIXI.DisplayObject | PIXI.DisplayObject[],
  stage: PIXI.Container,
  callback?: Function
) => void = createRender(ReactPixiFiberAsPrimaryRenderer);
// Standalone ReactPixiFiber unmount method.
const unmount: (stage: PIXI.Container) => void = createUnmount(ReactPixiFiberAsPrimaryRenderer);

// `Stage` is both the component and its type; `export { Stage }` below exports both.
// The declaration bundler drops the value in this form, see `stageTypePlugin` in tsdown.config.mts.
type Stage = StageComponent;

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
};

// A tag is a string at runtime and a component in the type system, as index.d.ts declared it.
export const BitmapText = TYPES.BITMAP_TEXT as unknown as PixiComponent<BitmapTextProps, PIXI.BitmapText>;
export type BitmapText = BitmapTextProps;
export const Container = TYPES.CONTAINER as unknown as PixiComponent<ContainerProps, PIXI.Container>;
export type Container = ContainerProps;
export const Graphics = TYPES.GRAPHICS as unknown as PixiComponent<GraphicsProps, PIXI.Graphics>;
export type Graphics = GraphicsProps;
export const NineSlicePlane = TYPES.NINE_SLICE_PLANE as unknown as PixiComponent<
  NineSlicePlaneProps,
  PIXI.NineSlicePlane
>;
export type NineSlicePlane = NineSlicePlaneProps;
export const ParticleContainer = TYPES.PARTICLE_CONTAINER as unknown as PixiComponent<
  ParticleContainerProps,
  PIXI.ParticleContainer
>;
export type ParticleContainer = ParticleContainerProps;
export const Sprite = TYPES.SPRITE as unknown as PixiComponent<SpriteProps, PIXI.Sprite>;
export type Sprite = SpriteProps;
export const Text = TYPES.TEXT as unknown as PixiComponent<TextProps, PIXI.Text>;
export type Text = TextProps;
export const TilingSprite = TYPES.TILING_SPRITE as unknown as PixiComponent<TilingSpriteProps, PIXI.TilingSprite>;
export type TilingSprite = TilingSpriteProps;
