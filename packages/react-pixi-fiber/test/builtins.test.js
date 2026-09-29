import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import * as PIXI from "pixi.js";
import { act } from "react-test-renderer";
import { TAGS } from "../src/tags";
import builtins from "../src/builtins";
import { PIXIComponent, applyProps, getInstanceTag, render, unmount } from "../src/index";
import { createInstance } from "../src/ReactPixiFiberComponent";
import { validateProperties } from "../src/ReactPixiFiberUnknownPropertyHook";

const texture = PIXI.Texture.WHITE;
const nineSliceProps = { texture, leftWidth: 1, topHeight: 1, rightWidth: 1, bottomHeight: 1 };
const propsFor = {
  Container: {},
  Sprite: { texture },
  AnimatedSprite: { textures: [texture] },
  Text: { text: "t" },
  BitmapText: { text: "t", style: { fontName: "test" } },
  Graphics: {},
  TilingSprite: { texture, width: 1, height: 1 },
  NineSliceSprite: nineSliceProps,
  ParticleContainer: {},
  Mesh: { geometry: new PIXI.PlaneGeometry(1, 1, 2, 2), shader: new PIXI.MeshMaterial(texture) },
  MeshSimple: { texture },
  MeshPlane: { texture, verticesX: 2, verticesY: 2 },
  MeshRope: { texture, points: [new PIXI.Point(0, 0), new PIXI.Point(1, 1)] },
};
const classFor = {
  Container: PIXI.Container,
  Sprite: PIXI.Sprite,
  AnimatedSprite: PIXI.AnimatedSprite,
  Text: PIXI.Text,
  BitmapText: PIXI.BitmapText,
  Graphics: PIXI.Graphics,
  TilingSprite: PIXI.TilingSprite,
  NineSliceSprite: PIXI.NineSlicePlane,
  ParticleContainer: PIXI.ParticleContainer,
  Mesh: PIXI.Mesh,
  MeshSimple: PIXI.SimpleMesh,
  MeshPlane: PIXI.SimplePlane,
  MeshRope: PIXI.SimpleRope,
};

PIXI.BitmapFont.from("test", { fontFamily: "Arial" }, { chars: [["a", "z"]] });

describe("builtins", () => {
  afterEach(() => vi.restoreAllMocks());

  it("implements every core tag with the PixiJS 6 class", () => {
    expect(PIXI.BitmapFont.available.test).toBeDefined();
    for (const tag of Object.keys(TAGS)) {
      expect(builtins.components[tag].create(propsFor[tag]), tag).toBeInstanceOf(classFor[tag]);
    }
    expect(Object.keys(builtins.components).sort()).toEqual(Object.keys(TAGS).sort());
  });

  it("has the five property lists and the point helpers", () => {
    expect(Object.keys(builtins.properties).sort()).toEqual([
      "boolean",
      "callback",
      "numeric",
      "positiveNumeric",
      "vector",
    ]);
    expect(builtins.isPoint(new PIXI.Point(1, 2))).toBe(true);
    expect(builtins.isPoint({ x: 1, y: 2 })).toBe(false);
    const target = new PIXI.Point();
    builtins.copyPoint(target, { x: 3, y: 4 });
    expect([target.x, target.y]).toEqual([3, 4]);
    expect(builtins.isApplication(new PIXI.Application())).toBe(true);
  });

  it("creates every core tag through createInstance and records its tag", () => {
    for (const tag of Object.keys(TAGS)) {
      const instance = createInstance(tag, propsFor[tag]);
      expect(instance, tag).toBeInstanceOf(classFor[tag]);
      expect(getInstanceTag(instance)).toBe(tag);
    }
  });

  it("records the deprecated NineSlicePlane tag as NineSliceSprite", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const instance = createInstance("NineSlicePlane", nineSliceProps);
    expect(instance).toBeInstanceOf(PIXI.NineSlicePlane);
    expect(getInstanceTag(instance)).toBe("NineSliceSprite");
  });

  it("applyProps works on built-in tag instances", () => {
    const sprite = createInstance("Sprite", { texture });
    applyProps(sprite, {}, { alpha: 0.5, position: "3,4" });
    expect(sprite.alpha).toBe(0.5);
    expect([sprite.x, sprite.y]).toEqual([3, 4]);
  });

  // `validateProperties` is what the reconciler runs under a <StrictMode> ancestor in development. It is called
  // directly: until Task 6 `findStrictRoot` tests mode bit 1, which is not StrictMode on React 18.
  it("does not report plain props on a PIXIComponent tag, but still checks the casing of typed names", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    PIXIComponent("StrictThing", () => new PIXI.Container());
    validateProperties("StrictThing", { anything: 1, textur: texture });
    const messages = error.mock.calls.map(call => String(call[0])).join("\n");
    expect(messages).not.toMatch(/does not recognize/);
    validateProperties("StrictThing", { buttonmode: true });
    if (__DEV__)
      expect(error.mock.calls.at(-1)[0]).toMatch(
        /Invalid prop `buttonmode` on `<StrictThing \/>`. Did you mean `buttonMode`\?/
      );
  });

  it("sets a plain prop on the instance as-is", () => {
    const Thing = PIXIComponent("PlainThing", () => new PIXI.Container());
    const stage = new PIXI.Container();
    act(() => render(React.createElement(Thing, { anything: 1 }), stage));
    expect(stage.children[0].anything).toBe(1);
    act(() => unmount(stage));
  });
});
