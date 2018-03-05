import { TYPES } from "../src/types";

describe("TYPES", () => {
  it("is an object mapping of supported types", () => {
    expect(TYPES).toEqual({
      BITMAP_TEXT: "BitmapText",
      CONTAINER: "Container",
      GRAPHICS: "Graphics",
      PARTICLE_CONTAINER: "ParticleContainer",
      SPRITE: "Sprite",
      TEXT: "Text",
      TILING_SPRITE: "TilingSprite",
    });
  });
});
