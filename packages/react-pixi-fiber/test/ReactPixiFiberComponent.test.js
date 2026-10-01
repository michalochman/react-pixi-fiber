import { describe, it, expect, vi, afterAll, beforeEach } from "vitest";
import * as PIXI from "pixi.js";
import * as ReactPixiFiber from "../src/ReactPixiFiber";
import * as ReactPixiFiberComponent from "../src/ReactPixiFiberComponent";
import { createInjectedTypeInstance, isInjectedType } from "../src/inject";
import { setValueForProperty } from "../src/PixiPropertyOperations";
import { TYPES } from "../src/types";

vi.mock("../src/inject", async importOriginal => {
  const actual = await importOriginal();
  return {
    ...actual,
    createInjectedTypeInstance: vi.fn(actual.createInjectedTypeInstance),
    isInjectedType: vi.fn(actual.isInjectedType),
  };
});
vi.mock("../src/PixiPropertyOperations", async importOriginal => ({
  ...(await importOriginal()),
  setValueForProperty: vi.fn(),
}));

vi.mock("pixi.js", async importOriginal => {
  return Object.assign({}, await importOriginal(), {
    Container: vi.fn(),
    Graphics: vi.fn(),
    Sprite: vi.fn(),
    Text: vi.fn(),
    extras: {
      BitmapText: vi.fn(),
      TilingSprite: vi.fn(),
    },
    mesh: {
      NineSlicePlane: vi.fn(),
    },
    particles: {
      ParticleContainer: vi.fn(),
    },
  });
});

describe("ReactPixiFiber", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createInstance", () => {
    it("returns PIXI.BitmapText if type is BITMAP_TEXT with style prop", () => {
      const text = "Hello World";
      const style = { font: "16 Arial", align: "left", tint: 0x421337 };
      ReactPixiFiberComponent.createInstance(TYPES.BITMAP_TEXT, { text, style });

      expect(PIXI.extras.BitmapText).toHaveBeenCalledTimes(1);
      expect(PIXI.extras.BitmapText).toHaveBeenCalledWith(text, style);
    });

    it("returns PIXI.BitmapText if type is BITMAP_TEXT with font prop", () => {
      const text = "Hello World";
      const style = { font: "16 Arial", align: "left", tint: 0x421337 };
      ReactPixiFiberComponent.createInstance(TYPES.BITMAP_TEXT, {
        text,
        font: style.font,
        align: style.align,
        tint: style.tint,
      });

      expect(PIXI.extras.BitmapText).toHaveBeenCalledTimes(1);
      expect(PIXI.extras.BitmapText).toHaveBeenCalledWith(text, style);
    });

    it("returns PIXI.Container if type is CONTAINER", () => {
      ReactPixiFiberComponent.createInstance(TYPES.CONTAINER, {});

      expect(PIXI.Container).toHaveBeenCalledTimes(1);
      expect(PIXI.Container).toHaveBeenCalledWith();
    });

    it("returns PIXI.Graphics if type is GRAPHICS", () => {
      ReactPixiFiberComponent.createInstance(TYPES.GRAPHICS, {});

      expect(PIXI.Graphics).toHaveBeenCalledTimes(1);
      expect(PIXI.Graphics).toHaveBeenCalledWith();
    });

    it("returns PIXI.NineSlicePlane if type is NINE_SLICE_PLANE", () => {
      const texture = "TEXTURE";
      const leftWidth = 15;
      const topHeight = 20;
      const rightWidth = 25;
      const bottomHeight = 30;
      ReactPixiFiberComponent.createInstance(TYPES.NINE_SLICE_PLANE, {
        texture,
        leftWidth,
        topHeight,
        rightWidth,
        bottomHeight,
      });

      expect(PIXI.mesh.NineSlicePlane).toHaveBeenCalledTimes(1);
      expect(PIXI.mesh.NineSlicePlane).toHaveBeenCalledWith(texture, leftWidth, topHeight, rightWidth, bottomHeight);
    });

    it("returns PIXI.ParticleContainer if type is PARTICLE_CONTAINER", () => {
      const maxSize = 1024;
      const properties = { rotation: true };
      const batchSize = 128;
      const autoResize = false;
      ReactPixiFiberComponent.createInstance(TYPES.PARTICLE_CONTAINER, { autoResize, batchSize, maxSize, properties });

      expect(PIXI.particles.ParticleContainer).toHaveBeenCalledTimes(1);
      expect(PIXI.particles.ParticleContainer).toHaveBeenCalledWith(maxSize, properties, batchSize, autoResize);
    });

    it("returns PIXI.Sprite if type is SPRITE", () => {
      const texture = "TEXTURE";
      ReactPixiFiberComponent.createInstance(TYPES.SPRITE, { texture });

      expect(PIXI.Sprite).toHaveBeenCalledTimes(1);
      expect(PIXI.Sprite).toHaveBeenCalledWith(texture);
    });

    it("returns PIXI.Text if type is TEXT", () => {
      const text = "Hello World";
      const style = { fontFamily: "Arial" };
      const canvas = document.createElement("canvas");
      ReactPixiFiberComponent.createInstance(TYPES.TEXT, { text, style, canvas });

      expect(PIXI.Text).toHaveBeenCalledTimes(1);
      expect(PIXI.Text).toHaveBeenCalledWith(text, style, canvas);
    });

    it("returns PIXI.TilingSprite if type is TILING_SPRITE", () => {
      const texture = "TEXTURE";
      const height = 16;
      const width = 32;
      ReactPixiFiberComponent.createInstance(TYPES.TILING_SPRITE, { height, texture, width });

      expect(PIXI.extras.TilingSprite).toHaveBeenCalledTimes(1);
      expect(PIXI.extras.TilingSprite).toHaveBeenCalledWith(texture, width, height);
    });

    it("returns injected instance if type was injected", () => {
      const instance = {};
      createInjectedTypeInstance.mockImplementationOnce(() => instance);
      expect(() => ReactPixiFiberComponent.createInstance("INJECTED_TYPE", {})).not.toThrow();
    });

    it("throws if type is not supported", () => {
      expect(() => ReactPixiFiberComponent.createInstance("INJECTED_TYPE", {})).toThrow(
        "ReactPixiFiber does not support the type: `INJECTED_TYPE`."
      );
    });
  });

  describe("setInitialProperties", () => {
    const instance = {};
    const type = "type";
    const rawProps = { position: "0,0" };
    const rootContainer = {};
    const hostContext = {};

    // setInitialCustomComponentProperties and setInitialPixiProperties are internal to the module, so the tests
    // observe what they do: call instance._customApplyProps or setValueForProperty for each prop
    afterAll(() => {
      isInjectedType.mockReset();
    });

    it("calls setInitialCustomComponentProperties for injected types with _customApplyProps defined", () => {
      const instance = {
        _customApplyProps: vi.fn(),
      };
      isInjectedType.mockImplementation(() => true);
      ReactPixiFiberComponent.setInitialProperties(type, instance, rawProps, rootContainer, hostContext);

      expect(setValueForProperty).toHaveBeenCalledTimes(0);
      expect(instance._customApplyProps).toHaveBeenCalledTimes(1);
      expect(instance._customApplyProps).toHaveBeenCalledWith(instance, undefined, rawProps);
    });

    it("calls setInitialPixiProperties for injected types without _customApplyProps defined", () => {
      isInjectedType.mockImplementation(() => true);
      ReactPixiFiberComponent.setInitialProperties(type, instance, rawProps, rootContainer, hostContext);

      expect(setValueForProperty).toHaveBeenCalledTimes(1);
      expect(setValueForProperty).toHaveBeenCalledWith(type, instance, "position", rawProps.position);
    });

    it("calls setInitialPixiProperties for regular types", () => {
      isInjectedType.mockImplementation(() => false);
      ReactPixiFiberComponent.setInitialProperties(type, instance, rawProps, rootContainer, hostContext);

      expect(setValueForProperty).toHaveBeenCalledTimes(1);
      expect(setValueForProperty).toHaveBeenCalledWith(type, instance, "position", rawProps.position);
    });
  });

  describe("setInitialCustomComponentProperties", () => {
    const instance = {
      _customApplyProps: vi.fn(),
    };
    const type = "type";
    const rawProps = { position: "0,0" };
    const rootContainerElement = {};

    it("calls _customApplyProps on instance", () => {
      ReactPixiFiberComponent.setInitialCustomComponentProperties(type, instance, rawProps, rootContainerElement);

      expect(instance._customApplyProps).toHaveBeenCalledTimes(1);
      expect(instance._customApplyProps).toHaveBeenCalledWith(instance, undefined, rawProps);
    });
  });

  describe("setInitialPixiProperties", () => {
    const instance = {};
    const type = "type";
    const rawProps = { children: [], position: "0,0", scale: 2 };
    const rootContainerElement = {};

    it("calls setValueForProperty for each prop that is not children", () => {
      ReactPixiFiberComponent.setInitialPixiProperties(type, instance, rawProps, rootContainerElement);
      expect(setValueForProperty).toHaveBeenCalledTimes(2);
      expect(setValueForProperty).not.toHaveBeenCalledWith(type, instance, "children", rawProps["children"]);
      expect(setValueForProperty).toHaveBeenCalledWith(type, instance, "position", rawProps["position"]);
      expect(setValueForProperty).toHaveBeenCalledWith(type, instance, "scale", rawProps["scale"]);
    });
  });

  describe("diffProperties", () => {
    const oldProps = { children: [1, 2], position: "0,0", scale: 2, text: "Hello World!" };
    const newProps = { children: [2], pivot: "0,0", scale: 2, text: "Goodbye World!" };

    it("returns null if props did not change", () => {
      expect(ReactPixiFiberComponent.diffProperties("Text", {}, {}, {})).toBeNull();
    });

    it("returns changed prop keys and values list if props changed", () => {
      expect(ReactPixiFiberComponent.diffProperties("Text", {}, oldProps, newProps)).toEqual([
        "position",
        null,
        "pivot",
        "0,0",
        "text",
        "Goodbye World!",
      ]);
    });
  });

  describe("applyDisplayObjectProps", () => {
    const instance = {};
    const type = "type";
    const oldProps = { position: "0,0" };
    const newProps = { position: "1,1" };

    it("calls updatePixiProperties with update payload", () => {
      ReactPixiFiberComponent.applyDisplayObjectProps(type, instance, oldProps, newProps);

      // updatePixiProperties is internal to the module, it calls setValueForProperty for each changed prop
      expect(setValueForProperty).toHaveBeenCalledTimes(1);
      expect(setValueForProperty).toHaveBeenCalledWith(type, instance, "position", newProps.position, undefined);
    });
  });

  describe("updateProperties", () => {
    const instance = {};
    const type = "type";
    const lastRawProps = { position: "0,0" };
    const nextRawProps = { position: "1,1" };
    const updatePayload = ["position", "1,1"];
    const internalInstanceHandle = {};

    // updateCustomComponentProperties and updatePixiProperties are internal to the module, so the tests observe
    // what they do: call instance._customApplyProps or setValueForProperty for each prop
    afterAll(() => {
      isInjectedType.mockReset();
    });

    it("calls updateCustomComponentProperties for injected types with _customApplyProps defined", () => {
      const instance = {
        _customApplyProps: vi.fn(),
      };
      isInjectedType.mockImplementation(() => true);
      ReactPixiFiberComponent.updateProperties(
        type,
        instance,
        updatePayload,
        lastRawProps,
        nextRawProps,
        internalInstanceHandle
      );

      expect(setValueForProperty).toHaveBeenCalledTimes(0);
      expect(instance._customApplyProps).toHaveBeenCalledTimes(1);
      expect(instance._customApplyProps).toHaveBeenCalledWith(instance, lastRawProps, nextRawProps);
    });

    it("calls updatePixiProperties for injected types without _customApplyProps defined", () => {
      isInjectedType.mockImplementation(() => true);
      ReactPixiFiberComponent.updateProperties(
        type,
        instance,
        updatePayload,
        lastRawProps,
        nextRawProps,
        internalInstanceHandle
      );

      expect(setValueForProperty).toHaveBeenCalledTimes(1);
      expect(setValueForProperty).toHaveBeenCalledWith(
        type,
        instance,
        "position",
        nextRawProps.position,
        internalInstanceHandle
      );
    });

    it("calls updatePixiProperties for regular types", () => {
      isInjectedType.mockImplementation(() => false);
      ReactPixiFiberComponent.updateProperties(
        type,
        instance,
        updatePayload,
        lastRawProps,
        nextRawProps,
        internalInstanceHandle
      );

      expect(setValueForProperty).toHaveBeenCalledTimes(1);
      expect(setValueForProperty).toHaveBeenCalledWith(
        type,
        instance,
        "position",
        nextRawProps.position,
        internalInstanceHandle
      );
    });
  });

  describe("updateCustomComponentProperties", () => {
    const instance = {
      _customApplyProps: vi.fn(),
    };
    const type = "type";
    const lastRawProps = { position: "0,0" };
    const nextRawProps = { position: "1,1" };
    const updatePayload = ["position", "1,1"];
    const internalInstanceHandle = {};

    it("calls _customApplyProps on instance", () => {
      ReactPixiFiberComponent.updateCustomComponentProperties(
        type,
        instance,
        updatePayload,
        lastRawProps,
        nextRawProps,
        internalInstanceHandle
      );

      expect(instance._customApplyProps).toHaveBeenCalledTimes(1);
      expect(instance._customApplyProps).toHaveBeenCalledWith(instance, lastRawProps, nextRawProps);
    });
  });

  describe("updatePixiProperties", () => {
    const instance = {};
    const type = "type";
    const lastRawProps = { children: [1, 2], position: "0,0", scale: 2 };
    const nextRawProps = { children: [2], position: "1,1", scale: 1 };
    const updatePayload = ["children", [2], "position", "1,1", "scale", 1];
    const internalInstanceHandle = {};

    it("calls setValueForProperty for each prop that is not children", () => {
      ReactPixiFiberComponent.updatePixiProperties(
        type,
        instance,
        updatePayload,
        lastRawProps,
        nextRawProps,
        internalInstanceHandle
      );
      expect(setValueForProperty).toHaveBeenCalledTimes(2);
      expect(setValueForProperty).not.toHaveBeenCalledWith(
        type,
        instance,
        "children",
        nextRawProps["children"],
        internalInstanceHandle
      );
      expect(setValueForProperty).toHaveBeenCalledWith(
        type,
        instance,
        "position",
        nextRawProps["position"],
        internalInstanceHandle
      );
      expect(setValueForProperty).toHaveBeenCalledWith(
        type,
        instance,
        "scale",
        nextRawProps["scale"],
        internalInstanceHandle
      );
    });
  });
});
