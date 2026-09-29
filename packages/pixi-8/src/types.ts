import type * as PIXI from "pixi.js";
import type { Props } from "react-pixi-fiber";

// Importing this package fills the core's augmentable interfaces with the PixiJS 8 classes.
declare module "react-pixi-fiber" {
  interface PixiInstances {
    AnimatedSprite: PIXI.AnimatedSprite;
    BitmapText: PIXI.BitmapText;
    Container: PIXI.Container;
    DOMContainer: PIXI.DOMContainer;
    Graphics: PIXI.Graphics;
    HTMLText: PIXI.HTMLText;
    Mesh: PIXI.Mesh;
    MeshPlane: PIXI.MeshPlane;
    MeshRope: PIXI.MeshRope;
    MeshSimple: PIXI.MeshSimple;
    NineSliceSprite: PIXI.NineSliceSprite;
    Particle: PIXI.Particle;
    ParticleContainer: PIXI.ParticleContainer;
    PerspectiveMesh: PIXI.PerspectiveMesh;
    RenderContainer: PIXI.RenderContainer;
    RenderLayer: PIXI.RenderLayer;
    Sprite: PIXI.Sprite;
    Text: PIXI.Text;
    TilingSprite: PIXI.TilingSprite;
  }
  interface PixiTypes {
    Application: PIXI.Application;
    ApplicationOptions: Partial<PIXI.ApplicationOptions>;
    Point: PIXI.Point | PIXI.ObservablePoint | PIXI.PointData;
  }
}

export type DOMContainerProps = Props<PIXI.DOMContainer>;
export type HTMLTextProps = Props<PIXI.HTMLText>;
export type ParticleProps = Omit<Props<PIXI.Particle>, "texture"> & { texture: PIXI.Texture };
export type ParticleContainerProps = Props<PIXI.ParticleContainer> & {
  // Constructor argument that is not a property on the instance
  dynamicProperties?: PIXI.ParticleContainerOptions["dynamicProperties"];
};
export type PerspectiveMeshProps = Props<PIXI.PerspectiveMesh> & {
  // Constructor arguments that are not properties on the instance
  verticesX?: number;
  verticesY?: number;
  x0?: number;
  x1?: number;
  x2?: number;
  x3?: number;
  y0?: number;
  y1?: number;
  y2?: number;
  y3?: number;
};
export type RenderContainerProps = Props<PIXI.RenderContainer> & {
  // Constructor arguments that are not properties on the instance
  addBounds?: PIXI.RenderContainerOptions["addBounds"];
  containsPoint?: PIXI.RenderContainerOptions["containsPoint"];
  render?: PIXI.RenderContainerOptions["render"];
};
export type RenderLayerProps = Props<PIXI.RenderLayer>;
