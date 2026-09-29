import { describe, it, expect, vi, beforeEach } from "vitest";
import * as PIXI from "pixi.js";
import * as ReactPixiFiber from "../src/ReactPixiFiber";
import * as ReactPixiFiberComponent from "../src/ReactPixiFiberComponent";
import { createRegisteredInstance, normalizeBehavior, registerComponent } from "../src/registry";
import { setValueForProperty } from "../src/PixiPropertyOperations";
import { TYPES } from "../src/tags";

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

    it("returns the registered instance if type was registered", () => {
      const instance = {};
      const create = vi.fn(() => instance);
      registerComponent("REGISTERED_TYPE", create);
      const props = { prop: "value" };
      expect(ReactPixiFiberComponent.createInstance("REGISTERED_TYPE", props)).toBe(instance);
      expect(create).toHaveBeenCalledWith(props);
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

    // setInitialPixiProperties is internal to the module, so the tests observe what it does: call the bound
    // applyProps of a registered instance, or setValueForProperty for each prop
    it("calls the bound applyProps for registered instances with applyProps defined", () => {
      const applyProps = vi.fn();
      const instance = createRegisteredInstance(
        type,
        normalizeBehavior(type, { create: () => ({}), applyProps }),
        {},
        () => {}
      );
      ReactPixiFiberComponent.setInitialProperties(type, instance, rawProps, rootContainer, hostContext);

      expect(setValueForProperty).toHaveBeenCalledTimes(0);
      expect(applyProps).toHaveBeenCalledTimes(1);
      expect(applyProps).toHaveBeenCalledWith(instance, undefined, rawProps);
    });

    it("calls setInitialPixiProperties for registered instances without applyProps defined", () => {
      const instance = createRegisteredInstance(
        type,
        normalizeBehavior(type, () => ({})),
        {},
        () => {}
      );
      ReactPixiFiberComponent.setInitialProperties(type, instance, rawProps, rootContainer, hostContext);

      expect(setValueForProperty).toHaveBeenCalledTimes(1);
      expect(setValueForProperty).toHaveBeenCalledWith(type, instance, "position", rawProps.position);
    });

    it("calls setInitialPixiProperties for regular types", () => {
      ReactPixiFiberComponent.setInitialProperties(type, instance, rawProps, rootContainer, hostContext);

      expect(setValueForProperty).toHaveBeenCalledTimes(1);
      expect(setValueForProperty).toHaveBeenCalledWith(type, instance, "position", rawProps.position);
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

    // updatePixiProperties is internal to the module, so the tests observe what it does: call the bound
    // applyProps of a registered instance, or setValueForProperty for each prop
    it("calls the bound applyProps for registered instances with applyProps defined", () => {
      const applyProps = vi.fn();
      const instance = createRegisteredInstance(
        type,
        normalizeBehavior(type, { create: () => ({}), applyProps }),
        {},
        () => {}
      );
      ReactPixiFiberComponent.updateProperties(
        type,
        instance,
        updatePayload,
        lastRawProps,
        nextRawProps,
        internalInstanceHandle
      );

      expect(setValueForProperty).toHaveBeenCalledTimes(0);
      expect(applyProps).toHaveBeenCalledTimes(1);
      expect(applyProps).toHaveBeenCalledWith(instance, lastRawProps, nextRawProps);
    });

    it("calls updatePixiProperties for registered instances without applyProps defined", () => {
      const instance = createRegisteredInstance(
        type,
        normalizeBehavior(type, () => ({})),
        {},
        () => {}
      );
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

  describe("applyProps", () => {
    it("applyProps delegates to the component's applyProps or to the display-object pipeline", () => {
      const custom = vi.fn();
      registerComponent("WithApply", { create: () => ({ kind: "custom" }), applyProps: custom });
      registerComponent("Plain", () => ({ kind: "plain" }));
      const a = ReactPixiFiberComponent.createInstance("WithApply", {});
      ReactPixiFiberComponent.applyProps(a, { x: 1 }, { x: 2 });
      expect(custom).toHaveBeenCalledWith(a, { x: 1 }, { x: 2 });
      const b = ReactPixiFiberComponent.createInstance("Plain", {});
      ReactPixiFiberComponent.applyProps(b, undefined, { x: 3 });
      expect(setValueForProperty).toHaveBeenCalledWith("Plain", b, "x", 3, undefined);
      expect(() => ReactPixiFiberComponent.applyProps({}, {}, {})).toThrow("react-pixi-fiber created");
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
