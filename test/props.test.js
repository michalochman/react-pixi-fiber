import { CHILDREN, DEFAULT_PROPS, RESERVED_PROPS } from "../src/props";

describe("props", () => {
  describe("CHILDREN", () => {
    it("equals `children`", () => {
      expect(CHILDREN).toEqual("children");
    });
  });
  describe("RESERVED_PROPS", () => {
    it("contain `children`", () => {
      expect(RESERVED_PROPS).toHaveProperty(CHILDREN);
    });
  });
  describe("DEFAULT_PROPS", () => {
    it("should be an object defining default values for DisplayObject props", () => {
      expect(DEFAULT_PROPS).toEqual({
        alpha: 1,
        buttonMode: false,
        cacheAsBitmap: false,
        cursor: "auto",
        filterArea: null,
        filters: null,
        hitArea: null,
        interactive: false,
        mask: null,
        pivot: 0,
        position: 0,
        renderable: true,
        rotation: 0,
        scale: 1,
        skew: 0,
        transform: null,
        visible: true,
        x: 0,
        y: 0,
      });
    });
  });
});
