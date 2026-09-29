import { describe, it, expect, vi, afterEach } from "vitest";
import * as PIXI from "pixi.js";
import * as PixiPropertyOperations from "../src/PixiPropertyOperations";
import { setValueForProperty } from "../src/PixiPropertyOperations";
import { shouldIgnoreAttribute, shouldRemoveAttribute } from "../src/PixiProperty";
import { setPixiValue } from "../src/utils";
import { getPixiAdapter } from "../src/configure";
import { strictModeBit } from "@react-pixi-fiber/react-18";

// The mocks call the real implementations unless a test overrides them; `mockReset` restores that.
vi.mock("../src/PixiProperty", async importOriginal => {
  const actual = await importOriginal();
  return {
    ...actual,
    shouldIgnoreAttribute: vi.fn(actual.shouldIgnoreAttribute),
    shouldRemoveAttribute: vi.fn(actual.shouldRemoveAttribute),
  };
});
vi.mock("../src/utils", async importOriginal => {
  const actual = await importOriginal();
  return { ...actual, setPixiValue: vi.fn(actual.setPixiValue) };
});

// Fresh modules whose adapter has the given `defaults` override. The adapter has no `NineSlicePlane` alias, so the
// core's deprecated tag map is what resolves that tag.
async function withDefaults(defaults) {
  vi.resetModules();
  vi.doMock("../src/configure", async () => {
    const pixi = (await vi.importActual("@react-pixi-fiber/pixi-6")).default();
    const { NineSlicePlane, ...components } = pixi.components;
    const adapter = { ...pixi, components };
    const { registerAdapterComponents } = await import("../src/registry");
    registerAdapterComponents(components);
    return { getPixiAdapter: () => ({ ...adapter, defaults }), getStrictModeBit: () => strictModeBit };
  });
  return {
    ...(await import("../src/PixiPropertyOperations")),
    ...(await import("../src/ReactPixiFiberComponent")),
    ...(await import("../src/PIXIComponent")),
  };
}

describe("PixiPropertyOperations", () => {
  afterEach(() => {
    setPixiValue.mockReset();
    shouldIgnoreAttribute.mockReset();
    shouldRemoveAttribute.mockReset();
    vi.doUnmock("../src/configure");
    vi.restoreAllMocks();
  });

  describe("setValueForProperty", () => {
    it("should not call setPixiValue if property should be ignored", () => {
      shouldIgnoreAttribute.mockImplementation(() => true);
      PixiPropertyOperations.setValueForProperty("Sprite", {}, "ignoredProp", "unsetValue");
      expect(setPixiValue).toHaveBeenCalledTimes(0);
    });

    it("should call setPixiValue with default value if property should be removed and default is available", () => {
      const instance = { roundPixels: false };
      shouldRemoveAttribute.mockImplementation(() => true);
      PixiPropertyOperations.setValueForProperty("Sprite", instance, "roundPixels", undefined);
      expect(setPixiValue).toHaveBeenCalledTimes(1);
      expect(setPixiValue).toHaveBeenCalledWith(instance, "roundPixels", false, getPixiAdapter());
    });

    it("should not call setPixiValue if property should be removed and default is not available", () => {
      shouldRemoveAttribute.mockImplementation(() => true);
      PixiPropertyOperations.setValueForProperty("Sprite", {}, "unknownProp", undefined);
      expect(setPixiValue).toHaveBeenCalledTimes(0);
    });

    it("should not call setPixiValue if property should be removed and defaults are not available", () => {
      shouldRemoveAttribute.mockImplementation(() => true);
      PixiPropertyOperations.setValueForProperty("UnknownType", {}, "unknownProp", undefined);
      expect(setPixiValue).toHaveBeenCalledTimes(0);
    });

    it("should call setPixiValue with provided value if property should not be removed", () => {
      const instance = {};
      PixiPropertyOperations.setValueForProperty("Sprite", instance, "roundPixels", true);
      expect(setPixiValue).toHaveBeenCalledTimes(1);
      expect(setPixiValue).toHaveBeenCalledWith(instance, "roundPixels", true, getPixiAdapter());
    });
  });

  describe("resetting a prop to its default", () => {
    it("restores the value PixiJS had before the first write", () => {
      const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
      setValueForProperty("Sprite", sprite, "alpha", 0.5);
      setValueForProperty("Sprite", sprite, "alpha", undefined);
      expect(sprite.alpha).toBe(1);
      setValueForProperty("Sprite", sprite, "blendMode", PIXI.BLEND_MODES.ADD);
      setValueForProperty("Sprite", sprite, "blendMode", undefined);
      expect(sprite.blendMode).toBe(PIXI.BLEND_MODES.NORMAL);
    });
    it("restores a point from the recorded { x, y }", () => {
      const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
      setValueForProperty("Sprite", sprite, "scale", [2, 3]);
      setValueForProperty("Sprite", sprite, "scale", undefined);
      expect([sprite.scale.x, sprite.scale.y]).toEqual([1, 1]);
    });
    it("restores a constructor-consumed prop to the initial prop value", () => {
      const text = new PIXI.Text("hello");
      setValueForProperty("Text", text, "text", "hello");
      setValueForProperty("Text", text, "text", "changed");
      setValueForProperty("Text", text, "text", undefined);
      expect(text.text).toBe("hello");
    });
    it("prefers the adapter defaults override over the recorded value", async () => {
      vi.resetModules();
      vi.doMock("../src/configure", async () => {
        const adapter = (await vi.importActual("@react-pixi-fiber/pixi-6")).default();
        return {
          getPixiAdapter: () => ({ ...adapter, defaults: { Sprite: { alpha: 0.25 } } }),
          getStrictModeBit: () => strictModeBit,
        };
      });
      const { setValueForProperty } = await import("../src/PixiPropertyOperations");
      const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
      setValueForProperty("Sprite", sprite, "alpha", 0.5);
      setValueForProperty("Sprite", sprite, "alpha", undefined);
      expect(sprite.alpha).toBe(0.25);
      vi.doUnmock("../src/configure");
    });
    it("warns under StrictMode about an invalid value it resets, not about an undefined one", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      const strict = { mode: strictModeBit, return: null };
      const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
      setValueForProperty("Sprite", sprite, "alpha", 0.5, strict);
      setValueForProperty("Sprite", sprite, "alpha", undefined, strict);
      expect(error).not.toHaveBeenCalled();
      setValueForProperty("Sprite", sprite, "alpha", -1, strict);
      expect(sprite.alpha).toBe(1);
      const warnings = error.mock.calls.filter(c => /Received `-1` for prop `alpha`/.test(String(c[0])));
      expect(warnings).toHaveLength(__DEV__ ? 1 : 0);
    });
    it("ignores an undefined value when nothing was recorded and no override exists", () => {
      const instance = new PIXI.Container();
      setValueForProperty("Container", instance, "nothingHere", undefined);
      expect("nothingHere" in instance).toBe(false);
    });
    it("clears a prop whose recorded default is undefined", () => {
      const instance = new PIXI.Container();
      setValueForProperty("Container", instance, "custom", "set");
      setValueForProperty("Container", instance, "custom", undefined);
      expect("custom" in instance).toBe(true);
      expect(instance.custom).toBeUndefined();
    });
    it("reads the override of the tag a deprecated tag maps to", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      const m = await withDefaults({ NineSliceSprite: { alpha: 0.25 } });
      const texture = PIXI.Texture.WHITE;
      const plane = m.createInstance("NineSlicePlane", {
        texture,
        leftWidth: 1,
        topHeight: 1,
        rightWidth: 1,
        bottomHeight: 1,
      });
      m.setValueForProperty("NineSlicePlane", plane, "alpha", 0.5);
      m.setValueForProperty("NineSlicePlane", plane, "alpha", undefined);
      expect(plane.alpha).toBe(0.25);
    });
    it("reads the override of the tag a user registered, without mapping it", async () => {
      const m = await withDefaults({ NineSliceSprite: { alpha: 0.25 }, NineSlicePlane: { alpha: 0.75 } });
      m.PIXIComponent("NineSlicePlane", { create: () => new PIXI.Container() });
      const instance = m.createInstance("NineSlicePlane", {});
      m.setValueForProperty("NineSlicePlane", instance, "alpha", 0.5);
      m.setValueForProperty("NineSlicePlane", instance, "alpha", undefined);
      expect(instance.alpha).toBe(0.75);
    });
  });
});
