import { describe, it, expect, vi } from "vitest";
import * as PIXI from "pixi.js";
import { TAGS } from "../../react-pixi-fiber/src/tags";
import pixi5, { NineSlicePlane, SimpleMesh, SimplePlane, SimpleRope } from "../src/index";

const texture = PIXI.Texture.WHITE;
const propsFor: Record<string, Record<string, unknown>> = {
  AnimatedSprite: { textures: [texture] },
  BitmapText: { style: { fontName: "test" }, text: "t" },
  Container: {},
  Graphics: {},
  Mesh: {
    geometry: new PIXI.MeshGeometry(new Float32Array(6), new Float32Array(6), new Uint16Array([0, 1, 2])),
    shader: new PIXI.MeshMaterial(texture),
  },
  MeshPlane: { texture, verticesX: 2, verticesY: 2 },
  MeshRope: { points: [new PIXI.Point(0, 0), new PIXI.Point(1, 1)], texture },
  MeshSimple: { texture },
  NineSliceSprite: { bottomHeight: 1, leftWidth: 1, rightWidth: 1, texture, topHeight: 1 },
  ParticleContainer: {},
  Sprite: { texture },
  Text: { text: "t" },
  TilingSprite: { height: 1, texture, width: 1 },
};
const classFor: Record<string, new (...args: any[]) => unknown> = {
  AnimatedSprite: PIXI.AnimatedSprite,
  BitmapText: PIXI.BitmapText,
  Container: PIXI.Container,
  Graphics: PIXI.Graphics,
  Mesh: PIXI.Mesh,
  MeshPlane: PIXI.SimplePlane,
  MeshRope: PIXI.SimpleRope,
  MeshSimple: PIXI.SimpleMesh,
  NineSliceSprite: PIXI.NineSlicePlane,
  ParticleContainer: PIXI.ParticleContainer,
  Sprite: PIXI.Sprite,
  Text: PIXI.Text,
  TilingSprite: PIXI.TilingSprite,
};

PIXI.BitmapFont.from("test", { fontFamily: "Arial" }, { chars: [["a", "z"]] });

describe("pixi5", () => {
  const adapter = pixi5();
  it("implements the 13 core tags and the four PixiJS 5 class-name aliases", () => {
    for (const tag of Object.keys(TAGS)) expect(typeof adapter.components[tag].create, tag).toBe("function");
    const aliases = { NineSlicePlane, SimpleMesh, SimplePlane, SimpleRope } as Record<string, unknown>;
    for (const [name, value] of Object.entries(aliases)) expect(value).toBe(name);
    expect(adapter.components.NineSlicePlane).toBe(adapter.components.NineSliceSprite);
    expect(adapter.components.SimpleMesh).toBe(adapter.components.MeshSimple);
    expect(adapter.components.SimplePlane).toBe(adapter.components.MeshPlane);
    expect(adapter.components.SimpleRope).toBe(adapter.components.MeshRope);
    expect(Object.keys(adapter.components).sort()).toEqual([...Object.keys(TAGS), ...Object.keys(aliases)].sort());
  });
  it("creates every core tag with the PixiJS 5 class", () => {
    for (const tag of Object.keys(TAGS)) {
      expect(adapter.components[tag].create(propsFor[tag]), tag).toBeInstanceOf(classFor[tag]);
    }
  });
  it("creates a BitmapText from a fontName prop without a style, the props winning over the style", () => {
    const text = adapter.components.BitmapText.create({ fontName: "test", text: "t" }) as PIXI.BitmapText;
    expect(text.fontName).toBe("test");
    const sized = adapter.components.BitmapText.create({
      fontSize: 20,
      style: { fontName: "test", fontSize: 10 },
      text: "t",
    });
    expect((sized as PIXI.BitmapText).fontSize).toBe(20);
  });
  it("lists the event names as callbacks, without an on prefix", () => {
    expect(adapter.properties.callback).toContain("click");
    expect(adapter.properties.callback).not.toContain("onclick");
  });
  it("passes the defaults override through", () => {
    expect(pixi5({ defaults: { Text: { text: "" } } }).defaults).toEqual({ Text: { text: "" } });
    expect(adapter.defaults).toBeUndefined();
  });
  it("creates and destroys a PIXI.Application synchronously", () => {
    const app = adapter.createApplication({ width: 1, height: 1 });
    expect(app).toBeInstanceOf(PIXI.Application);
    expect(adapter.isApplication(app)).toBe(true);
    adapter.destroyApplication(app, false, true);
  });
  it("keeps the WebGL context of a canvas still in the document when it destroys an application", () => {
    const lost = (connected: boolean) => {
      const view = document.createElement("canvas");
      if (connected) document.body.appendChild(view);
      const app = adapter.createApplication({ height: 1, view, width: 1 }) as PIXI.Application;
      const loseContext = vi.spyOn((app.renderer as PIXI.Renderer).context.extensions.loseContext!, "loseContext");
      adapter.destroyApplication(app, false, true);
      view.remove();
      return loseContext.mock.calls.length;
    };
    expect(lost(true)).toBe(0);
    expect(lost(false)).toBe(1);
    const view = document.body.appendChild(document.createElement("canvas"));
    const canvasApp = { destroy: vi.fn(), renderer: { context: {} }, view };
    adapter.destroyApplication(canvasApp, false, true);
    expect(canvasApp.destroy).toHaveBeenCalledWith(false, true);
    view.remove();
  });
  it("handles points", () => {
    expect(adapter.isPoint(new PIXI.ObservablePoint(() => {}, null))).toBe(true);
    expect(adapter.isPoint([1, 2])).toBe(false);
    const target = new PIXI.Point();
    adapter.copyPoint(target, { x: 1, y: 2 });
    expect([target.x, target.y]).toEqual([1, 2]);
  });
});
