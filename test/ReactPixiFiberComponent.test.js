import * as PIXI from "pixi.js";
import * as ReactPixiFiber from "../src/ReactPixiFiber";
import * as ReactPixiFiberComponent from "../src/ReactPixiFiberComponent";
import { __RewireAPI__ as ReactPixiFiberComponentRewireAPI } from "../src/ReactPixiFiberComponent";
import { __RewireAPI__ as ReactPixiFiberUnknownPropertyHookRewireAPI } from "../src/ReactPixiFiberUnknownPropertyHook";
import { TYPES } from "../src/types";

jest.mock("pixi.js", () => {
  return Object.assign({}, jest.requireActual("pixi.js"), {
    Container: jest.fn(),
    Graphics: jest.fn(),
    Sprite: jest.fn(),
    Text: jest.fn(),
    extras: {
      BitmapText: jest.fn(),
      TilingSprite: jest.fn(),
    },
    mesh: {
      NineSlicePlane: jest.fn(),
    },
    particles: {
      ParticleContainer: jest.fn(),
    },
  });
});

describe("ReactPixiFiber", () => {
  beforeEach(() => {
    PIXI.Container.mockClear();
    PIXI.Graphics.mockClear();
    PIXI.Sprite.mockClear();
    PIXI.Text.mockClear();
    PIXI.extras.BitmapText.mockClear();
    PIXI.extras.TilingSprite.mockClear();
    PIXI.particles.ParticleContainer.mockClear();
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
      const createInjectedTypeInstance = jest.fn(() => instance);
      ReactPixiFiberComponentRewireAPI.__Rewire__("createInjectedTypeInstance", createInjectedTypeInstance);
      expect(() => ReactPixiFiberComponent.createInstance("INJECTED_TYPE", {})).not.toThrow();
      ReactPixiFiberComponentRewireAPI.__ResetDependency__("createInjectedTypeInstance");
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
    const isInjectedType = jest.fn();
    const setInitialCustomComponentProperties = jest.fn();
    const setInitialPixiProperties = jest.fn();

    beforeAll(() => {
      ReactPixiFiberComponentRewireAPI.__Rewire__("isInjectedType", isInjectedType);
      ReactPixiFiberComponentRewireAPI.__Rewire__(
        "setInitialCustomComponentProperties",
        setInitialCustomComponentProperties
      );
      ReactPixiFiberComponentRewireAPI.__Rewire__("setInitialPixiProperties", setInitialPixiProperties);
    });

    afterAll(() => {
      ReactPixiFiberComponentRewireAPI.__ResetDependency__("isInjectedType");
      ReactPixiFiberComponentRewireAPI.__ResetDependency__("setInitialCustomComponentProperties");
      ReactPixiFiberComponentRewireAPI.__ResetDependency__("setInitialPixiProperties");
    });

    afterEach(() => {
      setInitialCustomComponentProperties.mockReset();
      setInitialPixiProperties.mockReset();
    });

    it("calls setInitialCustomComponentProperties for injected types with _customApplyProps defined", () => {
      const instance = {
        _customApplyProps: jest.fn(),
      };
      isInjectedType.mockImplementation(() => true);
      ReactPixiFiberComponent.setInitialProperties(type, instance, rawProps, rootContainer, hostContext);

      expect(setInitialPixiProperties).toHaveBeenCalledTimes(0);
      expect(setInitialCustomComponentProperties).toHaveBeenCalledTimes(1);
      expect(setInitialCustomComponentProperties).toHaveBeenCalledWith(
        type,
        instance,
        rawProps,
        rootContainer,
        hostContext
      );
    });

    it("calls setInitialPixiProperties for injected types without _customApplyProps defined", () => {
      isInjectedType.mockImplementation(() => true);
      ReactPixiFiberComponent.setInitialProperties(type, instance, rawProps, rootContainer, hostContext);

      expect(setInitialCustomComponentProperties).toHaveBeenCalledTimes(0);
      expect(setInitialPixiProperties).toHaveBeenCalledTimes(1);
      expect(setInitialPixiProperties).toHaveBeenCalledWith(type, instance, rawProps, rootContainer, hostContext);
    });

    it("calls setInitialPixiProperties for regular types", () => {
      isInjectedType.mockImplementation(() => false);
      ReactPixiFiberComponent.setInitialProperties(type, instance, rawProps, rootContainer, hostContext);

      expect(setInitialCustomComponentProperties).toHaveBeenCalledTimes(0);
      expect(setInitialPixiProperties).toHaveBeenCalledTimes(1);
      expect(setInitialPixiProperties).toHaveBeenCalledWith(type, instance, rawProps, rootContainer, hostContext);
    });
  });

  describe("setInitialCustomComponentProperties", () => {
    const instance = {
      _customApplyProps: jest.fn(),
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
    const setValueForProperty = jest.fn();

    it("calls setValueForProperty for each prop that is not children", () => {
      ReactPixiFiberComponentRewireAPI.__Rewire__("setValueForProperty", setValueForProperty);

      ReactPixiFiberComponent.setInitialPixiProperties(type, instance, rawProps, rootContainerElement);
      expect(setValueForProperty).toHaveBeenCalledTimes(2);
      expect(setValueForProperty).not.toHaveBeenCalledWith(type, instance, "children", rawProps["children"]);
      expect(setValueForProperty).toHaveBeenCalledWith(type, instance, "position", rawProps["position"]);
      expect(setValueForProperty).toHaveBeenCalledWith(type, instance, "scale", rawProps["scale"]);

      ReactPixiFiberComponentRewireAPI.__ResetDependency__("setValueForProperty");
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
    const updatePayload = ["position", "1,1"];
    const updatePixiProperties = jest.fn();
    const isInjectedType = jest.fn(() => true);

    it("calls updatePixiProperties with update payload", () => {
      ReactPixiFiberComponentRewireAPI.__Rewire__("updatePixiProperties", updatePixiProperties);
      ReactPixiFiberUnknownPropertyHookRewireAPI.__Rewire__("isInjectedType", isInjectedType);

      ReactPixiFiberComponent.applyDisplayObjectProps(type, instance, oldProps, newProps);
      expect(updatePixiProperties).toHaveBeenCalledTimes(1);
      expect(updatePixiProperties).toHaveBeenCalledWith(type, instance, updatePayload);

      ReactPixiFiberUnknownPropertyHookRewireAPI.__ResetDependency__("isInjectedType");
      ReactPixiFiberComponentRewireAPI.__ResetDependency__("updatePixiProperties");
    });
  });

  describe("updateProperties", () => {
    const instance = {};
    const type = "type";
    const lastRawProps = { position: "0,0" };
    const nextRawProps = { position: "1,1" };
    const updatePayload = ["position", "1,1"];
    const internalInstanceHandle = {};
    const isInjectedType = jest.fn();
    const updateCustomComponentProperties = jest.fn();
    const updatePixiProperties = jest.fn();

    beforeAll(() => {
      ReactPixiFiberComponentRewireAPI.__Rewire__("isInjectedType", isInjectedType);
      ReactPixiFiberComponentRewireAPI.__Rewire__("updateCustomComponentProperties", updateCustomComponentProperties);
      ReactPixiFiberComponentRewireAPI.__Rewire__("updatePixiProperties", updatePixiProperties);
    });

    afterAll(() => {
      ReactPixiFiberComponentRewireAPI.__ResetDependency__("isInjectedType");
      ReactPixiFiberComponentRewireAPI.__ResetDependency__("updateCustomComponentProperties");
      ReactPixiFiberComponentRewireAPI.__ResetDependency__("updatePixiProperties");
    });

    afterEach(() => {
      updateCustomComponentProperties.mockReset();
      updatePixiProperties.mockReset();
    });

    it("calls updateCustomComponentProperties for injected types with _customApplyProps defined", () => {
      const instance = {
        _customApplyProps: jest.fn(),
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

      expect(updatePixiProperties).toHaveBeenCalledTimes(0);
      expect(updateCustomComponentProperties).toHaveBeenCalledTimes(1);
      expect(updateCustomComponentProperties).toHaveBeenCalledWith(
        type,
        instance,
        updatePayload,
        lastRawProps,
        nextRawProps,
        internalInstanceHandle
      );
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

      expect(updateCustomComponentProperties).toHaveBeenCalledTimes(0);
      expect(updatePixiProperties).toHaveBeenCalledTimes(1);
      expect(updatePixiProperties).toHaveBeenCalledWith(
        type,
        instance,
        updatePayload,
        lastRawProps,
        nextRawProps,
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

      expect(updateCustomComponentProperties).toHaveBeenCalledTimes(0);
      expect(updatePixiProperties).toHaveBeenCalledTimes(1);
      expect(updatePixiProperties).toHaveBeenCalledWith(
        type,
        instance,
        updatePayload,
        lastRawProps,
        nextRawProps,
        internalInstanceHandle
      );
    });
  });

  describe("updateCustomComponentProperties", () => {
    const instance = {
      _customApplyProps: jest.fn(),
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
    const setValueForProperty = jest.fn();

    it("calls setValueForProperty for each prop that is not children", () => {
      ReactPixiFiberComponentRewireAPI.__Rewire__("setValueForProperty", setValueForProperty);

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

      ReactPixiFiberComponentRewireAPI.__ResetDependency__("setValueForProperty");
    });
  });
});
