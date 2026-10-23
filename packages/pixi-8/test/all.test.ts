import * as PIXI from "pixi.js";
import { describe, expect, it } from "vitest";
import { allComponents } from "../src/all";

const KEYS = [
  "AnimatedSprite",
  "Application",
  "BitmapText",
  "Container",
  "DOMContainer",
  "Graphics",
  "HTMLText",
  "Mesh",
  "MeshPlane",
  "MeshRope",
  "MeshSimple",
  "NineSliceSprite",
  "Particle",
  "ParticleContainer",
  "PerspectiveMesh",
  "RenderContainer",
  "RenderLayer",
  "Sprite",
  "Text",
  "TilingSprite",
];

// The display classes of pixi.js that are no tag: base classes, internal classes, the deprecated name that the core
// maps to `NineSliceSprite`, and classes that no tag creates yet.
const NOT_TAGS = [
  "AbstractSplitText",
  "AbstractText",
  "BitmapTextGraphics",
  "NineSlicePlane",
  "SplitBitmapText",
  "SplitText",
  "ViewContainer",
];

describe("allComponents", () => {
  it("lists the 19 tags and Application, alphabetical", () => {
    expect(Object.keys(allComponents)).toEqual(KEYS);
  });

  it("maps every key to the pixi.js class of that name", () => {
    for (const key of KEYS) {
      expect(allComponents[key as keyof typeof allComponents], key).toBe(PIXI[key as keyof typeof PIXI]);
    }
  });

  it("lists every display class of pixi.js that is no entry of NOT_TAGS", () => {
    const display = Object.entries(PIXI)
      .filter(
        ([, value]) =>
          typeof value === "function" &&
          (value === PIXI.Container ||
            value === PIXI.Particle ||
            value.prototype instanceof PIXI.Container ||
            value.prototype instanceof PIXI.Particle)
      )
      .map(([key]) => key)
      .filter(key => !NOT_TAGS.includes(key));
    expect(display.sort()).toEqual(KEYS.filter(key => key !== "Application"));
  });
});
