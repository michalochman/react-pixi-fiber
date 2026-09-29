import * as PIXI from "pixi.js";
import type { PixiAdapter, PixiComponent } from "react-pixi-fiber";
import { components } from "./components";
import { properties } from "./properties";
import type { HTMLTextProps, NineSlicePlaneProps, SimpleMeshProps, SimplePlaneProps, SimpleRopeProps } from "./types";
export * from "./types";

// A tag is a string at runtime and a component in the type system, like the core tags.
export const HTMLText = "HTMLText" as unknown as PixiComponent<HTMLTextProps, PIXI.HTMLText>;
export const NineSlicePlane = "NineSlicePlane" as unknown as PixiComponent<NineSlicePlaneProps, PIXI.NineSlicePlane>;
export const SimpleMesh = "SimpleMesh" as unknown as PixiComponent<SimpleMeshProps, PIXI.SimpleMesh>;
export const SimplePlane = "SimplePlane" as unknown as PixiComponent<SimplePlaneProps, PIXI.SimplePlane>;
export const SimpleRope = "SimpleRope" as unknown as PixiComponent<SimpleRopeProps, PIXI.SimpleRope>;

export interface Pixi7Options {
  defaults?: Record<string, Record<string, unknown>>;
}

export default function pixi7({ defaults }: Pixi7Options = {}): PixiAdapter {
  return {
    components,
    defaults,
    properties,
    isPoint: (value): value is PIXI.IPointData => value instanceof PIXI.Point || value instanceof PIXI.ObservablePoint,
    copyPoint: (target, value) => {
      (target as PIXI.Point).copyFrom(value);
    },
    createApplication: options => new PIXI.Application(options as Partial<PIXI.IApplicationOptions>),
    destroyApplication: (app: PIXI.Application, removeView, stageOptions) => {
      // Destroying a WebGL renderer loses its canvas's context for good. A canvas still in the document may already
      // hold the next application on the same context (StrictMode's second mount, a recreate on `options.view`).
      const renderer = app.renderer as any;
      if (renderer.type === PIXI.RENDERER_TYPE.WEBGL && (app.view as HTMLCanvasElement).isConnected) {
        renderer.context.extensions.loseContext = null;
      }
      app.destroy(removeView, stageOptions as any);
    },
    isApplication: value => value instanceof PIXI.Application,
  };
}
