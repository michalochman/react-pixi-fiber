import * as PIXI from "pixi.js";
import type { PixiAdapter, PixiComponent } from "react-pixi-fiber";
import { type Compat, createTranslateProps, tables } from "./compat";
import { components } from "./components";
import { properties } from "./properties";
import type {
  DOMContainerProps,
  HTMLTextProps,
  PerspectiveMeshProps,
  RenderContainerProps,
  RenderLayerProps,
} from "./types";
export * from "./types";

// A tag is a string at runtime and a component in the type system, like the core tags.
export const DOMContainer = "DOMContainer" as unknown as PixiComponent<DOMContainerProps, PIXI.DOMContainer>;
export const HTMLText = "HTMLText" as unknown as PixiComponent<HTMLTextProps, PIXI.HTMLText>;
export const PerspectiveMesh = "PerspectiveMesh" as unknown as PixiComponent<
  PerspectiveMeshProps,
  PIXI.PerspectiveMesh
>;
export const RenderContainer = "RenderContainer" as unknown as PixiComponent<
  RenderContainerProps,
  PIXI.RenderContainer
>;
export const RenderLayer = "RenderLayer" as unknown as PixiComponent<RenderLayerProps, PIXI.RenderLayer>;

export interface Pixi8Options {
  compat?: Compat;
  defaults?: Record<string, Record<string, unknown>>;
}

export default function pixi8({ compat, defaults }: Pixi8Options = {}): PixiAdapter {
  const adapter: PixiAdapter = {
    components,
    defaults,
    properties,
    isPoint: (value): value is PIXI.PointData => value instanceof PIXI.Point || value instanceof PIXI.ObservablePoint,
    copyPoint: (target, value) => {
      (target as PIXI.Point).copyFrom(value);
    },
    createApplication: async options => {
      // `view` is the Stage's canvas, or 2.x's name for an external one; PixiJS 8 calls that option `canvas`.
      // Stage passes `view: null` when `options` bring their own canvas.
      const { view, ...rest } = options as { view?: HTMLCanvasElement | null } & Partial<PIXI.ApplicationOptions>;
      const app = new PIXI.Application();
      await app.init(view == null ? rest : { ...rest, canvas: view });
      return app;
    },
    destroyApplication: (app: PIXI.Application, removeView, stageOptions) => {
      // Destroying a WebGL renderer loses its canvas's context for good. A canvas still in the document may already
      // hold the next application on the same context (StrictMode's second mount, a recreate on `options.view`).
      const context = (app.renderer as Partial<PIXI.WebGLRenderer>).context;
      if (context && (context.canvas as HTMLCanvasElement).isConnected) context.extensions.loseContext = undefined;
      app.destroy({ removeView }, stageOptions as PIXI.DestroyOptions);
    },
    isApplication: value => value instanceof PIXI.Application,
  };
  if (compat !== undefined) {
    if (!Object.prototype.hasOwnProperty.call(tables, compat)) {
      throw new Error(
        `\`pixi8({ compat })\` got ${JSON.stringify(compat)}. Pass "pixi6" or "pixi7", or leave \`compat\` out.`
      );
    }
    adapter.translateProps = createTranslateProps(compat);
  }
  return adapter;
}
