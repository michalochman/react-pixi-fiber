import type * as PIXI from "pixi.js";
import type { InteractionEventTypes, Props } from "react-pixi-fiber";

// Importing this package fills the core's augmentable interfaces with the PixiJS 6 classes.
declare module "react-pixi-fiber" {
  interface PixiExtraProps extends InteractiveComponent {}
  interface PixiInstances {
    AnimatedSprite: PIXI.AnimatedSprite;
    BitmapText: PIXI.BitmapText;
    Container: PIXI.Container;
    Graphics: PIXI.Graphics;
    Mesh: PIXI.Mesh;
    MeshPlane: PIXI.SimplePlane;
    MeshRope: PIXI.SimpleRope;
    MeshSimple: PIXI.SimpleMesh;
    NineSlicePlane: PIXI.NineSlicePlane;
    NineSliceSprite: PIXI.NineSlicePlane;
    ParticleContainer: PIXI.ParticleContainer;
    SimpleMesh: PIXI.SimpleMesh;
    SimplePlane: PIXI.SimplePlane;
    SimpleRope: PIXI.SimpleRope;
    Sprite: PIXI.Sprite;
    Text: PIXI.Text;
    TilingSprite: PIXI.TilingSprite;
  }
  interface PixiTypes {
    Application: PIXI.Application;
    ApplicationOptions: PIXI.IApplicationOptions;
    InteractionEvent: PIXI.InteractionEvent;
    Point: PIXI.Point | PIXI.ObservablePoint | PIXI.IPointData;
  }
}

// PixiJS 6 has no `PIXI.interaction` namespace, so its key union is `string`.
export type InteractionCompatibility = string;
export type InteractionEventCompatibility = Exclude<keyof typeof PIXI.InteractionEvent, number | symbol>;
export type InteractiveComponent = { [P in InteractionEventTypes]?: (event: PIXI.InteractionEvent) => void };
export type NineSlicePlaneProps = Props<PIXI.NineSlicePlane>;
export type PixiTypeFallback<T, U> = T extends PIXI.DisplayObject ? T : U;
export type SimpleMeshProps = Props<PIXI.SimpleMesh> & {
  // Constructor arguments that are not properties on the instance
  indices?: Uint16Array | number[];
  uvs?: Float32Array | number[];
};
export type SimplePlaneProps = Props<PIXI.SimplePlane> & {
  // Constructor arguments that are not properties on the instance
  verticesX?: number;
  verticesY?: number;
};
export type SimpleRopeProps = Props<PIXI.SimpleRope> & {
  // Constructor arguments that are not properties on the instance
  points?: PIXI.IPoint[];
  textureScale?: number;
};
// `Text` props with `style` narrowed to the PixiJS 6 text style types.
export type TextProps = Omit<Props<PIXI.Text>, "style"> & {
  style?: PIXI.TextStyle | Partial<PIXI.ITextStyle>;
};
