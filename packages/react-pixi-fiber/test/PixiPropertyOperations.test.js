import { describe, it, expect, vi, afterEach } from "vitest";
import * as PixiPropertyOperations from "../src/PixiPropertyOperations";
import { shouldIgnoreAttribute, shouldRemoveAttribute } from "../src/PixiProperty";
import { setPixiValue } from "../src/utils";
import { defaultProps } from "../src/props";

vi.mock("../src/PixiProperty", async importOriginal => ({
  ...(await importOriginal()),
  shouldIgnoreAttribute: vi.fn(() => false),
  shouldRemoveAttribute: vi.fn(() => false),
}));
vi.mock("../src/utils", async importOriginal => ({ ...(await importOriginal()), setPixiValue: vi.fn() }));

describe("PixiPropertyOperations", () => {
  describe("setValueForProperty", () => {
    const instance = {};

    afterEach(() => {
      setPixiValue.mockReset();
      shouldIgnoreAttribute.mockReset();
      shouldRemoveAttribute.mockReset();
    });

    it("should not call setPixiValue if property should be ignored", () => {
      shouldIgnoreAttribute.mockImplementation(() => true);
      PixiPropertyOperations.setValueForProperty("Sprite", instance, "ignoredProp", "unsetValue");
      expect(setPixiValue).toHaveBeenCalledTimes(0);
    });

    it("should call setPixiValue with default value if property should be removed and default is available", () => {
      const type = "Sprite";
      const propName = "roundPixels";
      shouldRemoveAttribute.mockImplementation(() => true);
      PixiPropertyOperations.setValueForProperty(type, instance, propName, undefined);
      expect(setPixiValue).toHaveBeenCalledTimes(1);
      expect(setPixiValue).toHaveBeenCalledWith(instance, propName, false);
    });

    it("should not call setPixiValue if property should be removed and default is not available", () => {
      const type = "Sprite";
      const propName = "unknownProp";
      shouldRemoveAttribute.mockImplementation(() => true);
      PixiPropertyOperations.setValueForProperty(type, instance, propName, undefined);
      expect(setPixiValue).toHaveBeenCalledTimes(0);
    });

    it("should not call setPixiValue if property should be removed and defaults are not available", () => {
      const type = "UnknownType";
      const propName = "unknownProp";
      shouldRemoveAttribute.mockImplementation(() => true);
      PixiPropertyOperations.setValueForProperty(type, instance, propName, undefined);
      expect(setPixiValue).toHaveBeenCalledTimes(0);
    });

    it("should call setPixiValue with provided value if property should not be removed", () => {
      const type = "Sprite";
      const propName = "roundPixels";
      PixiPropertyOperations.setValueForProperty(type, instance, propName, true);
      expect(setPixiValue).toHaveBeenCalledTimes(1);
      expect(setPixiValue).toHaveBeenCalledWith(instance, propName, true);
    });
  });

  describe("getDefaultValue", () => {
    it("reads the defaults of the tag a deprecated tag maps to", () => {
      defaultProps.NineSliceSprite = { alpha: 0.7 };
      try {
        expect(PixiPropertyOperations.getDefaultValue("NineSlicePlane", "alpha")).toBe(0.7);
        expect(PixiPropertyOperations.getDefaultValue("NineSliceSprite", "alpha")).toBe(0.7);
      } finally {
        delete defaultProps.NineSliceSprite;
      }
    });
  });
});
