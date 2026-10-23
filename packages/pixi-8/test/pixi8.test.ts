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

describe("pixi8", () => {
  const adapter = pixi8();
  it("implements the 13 core tags and the six PixiJS 8 tags", () => {
    for (const [name, value] of Object.entries(EXTRA_TAGS)) expect(value).toBe(name);
    expect(Object.keys(adapter.components).sort()).toEqual([...Object.keys(TAGS), ...Object.keys(EXTRA_TAGS)].sort());
    for (const tag of Object.keys(adapter.components))
      expect(typeof adapter.components[tag].create, tag).toBe("function");
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
