import { describe, it, expect, vi } from "vitest";
import * as PIXI from "pixi.js";
import { TAGS } from "../../react-pixi-fiber/src/tags";
import pixi8, { DOMContainer, HTMLText, Particle, PerspectiveMesh, RenderContainer, RenderLayer } from "../src/index";

const texture = PIXI.Texture.WHITE;
const EXTRA_TAGS = {
  DOMContainer,
  HTMLText,
  Particle,
  PerspectiveMesh,
  RenderContainer,
  RenderLayer,
} as Record<string, unknown>;
const propsFor: Record<string, Record<string, unknown>> = {
  AnimatedSprite: { textures: [texture] },
  BitmapText: { style: { fill: 0xff0000 }, text: "t" },
  Container: {},
  DOMContainer: { element: document.createElement("div") },
  Graphics: {},
  HTMLText: { text: "t" },
  Mesh: { geometry: new PIXI.PlaneGeometry({ height: 1, verticesX: 2, verticesY: 2, width: 1 }), texture },
  MeshPlane: { texture, verticesX: 2, verticesY: 2 },
  MeshRope: { points: [new PIXI.Point(0, 0), new PIXI.Point(1, 0)], texture },
  MeshSimple: { texture, vertices: new Float32Array([0, 0, 1, 0, 1, 1]) },
  NineSliceSprite: { bottomHeight: 1, leftWidth: 1, rightWidth: 1, texture, topHeight: 1 },
  Particle: { texture },
  ParticleContainer: { texture },
  PerspectiveMesh: { texture, x1: 10 },
  RenderContainer: { render: () => {} },
  RenderLayer: {},
  Sprite: { texture },
  Text: { style: { fill: 0xff0000 }, text: "t" },
  TilingSprite: { height: 1, texture, width: 1 },
};
const classFor: Record<string, new (...args: any[]) => unknown> = {
  AnimatedSprite: PIXI.AnimatedSprite,
  BitmapText: PIXI.BitmapText,
  Container: PIXI.Container,
  DOMContainer: PIXI.DOMContainer,
  Graphics: PIXI.Graphics,
  HTMLText: PIXI.HTMLText,
  Mesh: PIXI.Mesh,
  MeshPlane: PIXI.MeshPlane,
  MeshRope: PIXI.MeshRope,
  MeshSimple: PIXI.MeshSimple,
  NineSliceSprite: PIXI.NineSliceSprite,
  Particle: PIXI.Particle,
  ParticleContainer: PIXI.ParticleContainer,
  PerspectiveMesh: PIXI.PerspectiveMesh,
  RenderContainer: PIXI.RenderContainer,
  RenderLayer: PIXI.RenderLayer,
  Sprite: PIXI.Sprite,
  Text: PIXI.Text,
  TilingSprite: PIXI.TilingSprite,
};

describe("pixi8", () => {
  const adapter = pixi8();
  it("implements the 13 core tags and the six PixiJS 8 tags", () => {
    for (const [name, value] of Object.entries(EXTRA_TAGS)) expect(value).toBe(name);
    expect(Object.keys(adapter.components).sort()).toEqual([...Object.keys(TAGS), ...Object.keys(EXTRA_TAGS)].sort());
    for (const tag of Object.keys(adapter.components))
      expect(typeof adapter.components[tag].create, tag).toBe("function");
  });
  it("creates every tag with the PixiJS 8 class", () => {
    for (const tag of Object.keys(classFor)) {
      expect(adapter.components[tag].create(propsFor[tag]), tag).toBeInstanceOf(classFor[tag]);
    }
  });
  it("leaves out constructor options that are not set, so the PixiJS defaults apply", () => {
    const mesh = adapter.components.PerspectiveMesh.create({ texture }) as PIXI.PerspectiveMesh;
    expect(mesh.geometry.positions.every(Number.isFinite)).toBe(true);
    expect((adapter.components.Text.create({}) as PIXI.Text).text).toBe("");
  });
  it("ParticleContainer throws when it inserts before a particle it does not hold", () => {
    const { create, insertBefore } = adapter.components.ParticleContainer;
    const container = create({});
    expect(() => insertBefore?.(container, new PIXI.Particle(texture), new PIXI.Particle(texture))).toThrow(
      "`ParticleContainer` cannot insert a `Particle` before one it does not hold."
    );
  });
  it("lists the on-prefixed event properties as callbacks", () => {
    expect(adapter.properties.callback).toContain("onclick");
    expect(adapter.properties.callback).not.toContain("click");
  });
  it("passes the defaults override through", () => {
    expect(pixi8({ defaults: { Text: { text: "" } } }).defaults).toEqual({ Text: { text: "" } });
    expect(adapter.defaults).toBeUndefined();
  });
  it("createApplication is async and destroyApplication forwards removeView", async () => {
    const pending = adapter.createApplication({ width: 4, height: 4 });
    expect(pending).toBeInstanceOf(Promise);
    const app = (await pending) as PIXI.Application;
    expect(app).toBeInstanceOf(PIXI.Application);
    expect(adapter.isApplication(app)).toBe(true);
    expect(adapter.isApplication({})).toBe(false);
    adapter.destroyApplication(app, false, true);
  });
  it("passes the view option as the canvas", async () => {
    const view = document.createElement("canvas");
    const app = (await adapter.createApplication({ height: 4, view, width: 4 })) as PIXI.Application;
    expect(app.canvas).toBe(view);
    adapter.destroyApplication(app, false, true);
  });
  it("keeps the WebGL context of a canvas still in the document when it destroys an application", async () => {
    const lost = async (connected: boolean) => {
      const view = document.createElement("canvas");
      if (connected) document.body.appendChild(view);
      const app = (await adapter.createApplication({ height: 4, view, width: 4 })) as PIXI.Application;
      const ext = (app.renderer as PIXI.WebGLRenderer).context.extensions.loseContext!;
      const loseContext = vi.spyOn(ext, "loseContext");
      adapter.destroyApplication(app, false, true);
      view.remove();
      return loseContext.mock.calls.length;
    };
    expect(await lost(true)).toBe(0);
    expect(await lost(false)).toBe(1);
    const gpuApp = { destroy: vi.fn(), renderer: {} };
    adapter.destroyApplication(gpuApp, false, true);
    expect(gpuApp.destroy).toHaveBeenCalledWith({ removeView: false }, true);
  });
  it("handles points", () => {
    expect(adapter.isPoint(new PIXI.ObservablePoint({ _onUpdate: () => {} }))).toBe(true);
    expect(adapter.isPoint([1, 2])).toBe(false);
    const target = new PIXI.Point();
    adapter.copyPoint(target, { x: 1, y: 2 });
    expect([target.x, target.y]).toEqual([1, 2]);
  });
  it("has no translateProps without compat", () => {
    expect(adapter.translateProps).toBeUndefined();
  });
});

describe("pixi8 prop writes", () => {
  it("sets a color string tint, which PixiJS 8 accepts", async () => {
    const { configure } = await import("react-pixi-fiber");
    const react18 = (await import("@react-pixi-fiber/react-18")).default;
    const { setValueForProperty } = await import("../../react-pixi-fiber/src/PixiPropertyOperations");
    configure({ react: react18(), pixi: pixi8() });
    const sprite = new PIXI.Sprite(texture);
    setValueForProperty("Sprite", sprite, "tint", "#ff0000");
    expect(sprite.tint).toBe(0xff0000);
  });
});
