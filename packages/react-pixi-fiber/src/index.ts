import type * as PIXI from "pixi.js";
import type * as React from "react";
import { CustomPIXIComponent, CustomPIXIProperty, PIXIComponent, PIXIProperty } from "./PIXIComponent";
import { getInstanceTag } from "./registry";
import { AppContext, AppProvider, withApp } from "./AppProvider";
import Stage, { createStageClass } from "./Stage";
import { TAGS } from "./tags";
import { usePixiApp, usePixiTicker } from "./hooks";
import { createRender, createUnmount } from "./render";
import { ReactPixiFiberAsPrimaryRenderer } from "./ReactPixiFiber";
import { applyDisplayObjectProps, applyProps } from "./ReactPixiFiberComponent";
import type {
  AnimatedSpriteProps,
  BitmapTextProps,
  ContainerProps,
  GraphicsProps,
  MeshPlaneProps,
  MeshProps,
  MeshRopeProps,
  MeshSimpleProps,
  NineSlicePlaneProps,
  NineSliceSpriteProps,
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
  PIXIComponent,
  PIXIProperty,
  Stage,
  applyDisplayObjectProps,
  applyProps,
  createStageClass,
  getInstanceTag,
  render,
  unmount,
  withApp,
  usePixiApp,
  usePixiTicker,
};

// A tag is a string at runtime and a component in the type system, as index.d.ts declared it.
export const AnimatedSprite = TAGS.AnimatedSprite as unknown as PixiComponent<AnimatedSpriteProps, PIXI.AnimatedSprite>;
export type AnimatedSprite = AnimatedSpriteProps;
export const BitmapText = TAGS.BitmapText as unknown as PixiComponent<BitmapTextProps, PIXI.BitmapText>;
export type BitmapText = BitmapTextProps;
export const Container = TAGS.Container as unknown as PixiComponent<ContainerProps, PIXI.Container>;
export type Container = ContainerProps;
export const Graphics = TAGS.Graphics as unknown as PixiComponent<GraphicsProps, PIXI.Graphics>;
export type Graphics = GraphicsProps;
export const Mesh = TAGS.Mesh as unknown as PixiComponent<MeshProps, PIXI.Mesh>;
export type Mesh = MeshProps;
export const MeshPlane = TAGS.MeshPlane as unknown as PixiComponent<MeshPlaneProps, PIXI.SimplePlane>;
export type MeshPlane = MeshPlaneProps;
export const MeshRope = TAGS.MeshRope as unknown as PixiComponent<MeshRopeProps, PIXI.SimpleRope>;
export type MeshRope = MeshRopeProps;
export const MeshSimple = TAGS.MeshSimple as unknown as PixiComponent<MeshSimpleProps, PIXI.SimpleMesh>;
export type MeshSimple = MeshSimpleProps;
export const NineSliceSprite = TAGS.NineSliceSprite as unknown as PixiComponent<
  NineSliceSpriteProps,
  PIXI.NineSlicePlane
>;
export type NineSliceSprite = NineSliceSpriteProps;
/** @deprecated Use `NineSliceSprite`. Removed in 4.0.0. */
export const NineSlicePlane = "NineSlicePlane" as unknown as PixiComponent<NineSliceSpriteProps, PIXI.NineSlicePlane>;
/** @deprecated Use `NineSliceSprite`. Removed in 4.0.0. */
export type NineSlicePlane = NineSlicePlaneProps;
export const ParticleContainer = TAGS.ParticleContainer as unknown as PixiComponent<
  ParticleContainerProps,
  PIXI.ParticleContainer
>;
export type ParticleContainer = ParticleContainerProps;
export const Sprite = TAGS.Sprite as unknown as PixiComponent<SpriteProps, PIXI.Sprite>;
export type Sprite = SpriteProps;
export const Text = TAGS.Text as unknown as PixiComponent<TextProps, PIXI.Text>;
export type Text = TextProps;
export const TilingSprite = TAGS.TilingSprite as unknown as PixiComponent<TilingSpriteProps, PIXI.TilingSprite>;
export type TilingSprite = TilingSpriteProps;
