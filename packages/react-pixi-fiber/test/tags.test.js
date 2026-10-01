import { describe, it, expect } from "vitest";
import { TAGS, DEPRECATED_TAGS } from "../src/tags";

describe("TAGS", () => {
  it("names the 13 concepts every PixiJS major has, PixiJS 8 spelling", () => {
    expect(Object.keys(TAGS).sort()).toEqual([
      "AnimatedSprite",
      "BitmapText",
      "Container",
      "Graphics",
      "Mesh",
      "MeshPlane",
      "MeshRope",
      "MeshSimple",
      "NineSliceSprite",
      "ParticleContainer",
      "Sprite",
      "Text",
      "TilingSprite",
    ]);
    for (const [key, value] of Object.entries(TAGS)) expect(value).toBe(key);
  });
  it("maps the 2.x NineSlicePlane tag to NineSliceSprite", () => {
    expect(DEPRECATED_TAGS).toEqual({ NineSlicePlane: "NineSliceSprite" });
  });
});
