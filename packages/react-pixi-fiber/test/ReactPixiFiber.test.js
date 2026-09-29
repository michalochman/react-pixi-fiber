import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import React from "react";
import emptyObject from "fbjs/lib/emptyObject";
import * as PIXI from "pixi.js";
import * as ReactPixiFiber from "../src/ReactPixiFiber";
import * as ReactPixiFiberComponent from "../src/ReactPixiFiberComponent";
import { diffProperties, setInitialProperties, updateProperties } from "../src/ReactPixiFiberComponent";
import { validateProperties } from "../src/ReactPixiFiberUnknownPropertyHook";
import { createRender } from "../src/render";
import { TYPES } from "../src/tags";
import { findStrictRoot } from "../src/utils";

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
    particles: {
      ParticleContainer: vi.fn(),
    },
  });
});
vi.mock("../src/utils", async importOriginal => {
  return Object.assign({}, await importOriginal(), {
    findStrictRoot: vi.fn(),
    setPixiValue: vi.fn(),
  });
});
// The ReactPixiFiber tests stub these, ReactPixiFiberComponent.diffProperties is real until then
vi.mock("../src/ReactPixiFiberComponent", async importOriginal => {
  const actual = await importOriginal();
  return {
    ...actual,
    diffProperties: vi.fn(actual.diffProperties),
    setInitialProperties: vi.fn(actual.setInitialProperties),
    updateProperties: vi.fn(actual.updateProperties),
  };
});
vi.mock("../src/ReactPixiFiberUnknownPropertyHook", async importOriginal => ({
  ...(await importOriginal()),
  validateProperties: vi.fn(),
}));

// validatePropertiesInDevelopment is internal to ReactPixiFiber: in development it looks for a strict root
// and validates the properties when there is one
const strictRoot = {};

describe("ReactPixiFiber", () => {
  describe("appendChild", () => {
    const parent = {
      addChild: vi.fn(),
      removeChild: vi.fn(),
    };
    const child = { id: 1 };

    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("removes child from parentInstance", () => {
      ReactPixiFiber.appendChild(parent, child);

      expect(parent.removeChild).toHaveBeenCalledTimes(1);
      expect(parent.removeChild).toHaveBeenCalledWith(child);
    });

    it("adds child to parentInstance", () => {
      ReactPixiFiber.appendChild(parent, child);

      expect(parent.addChild).toHaveBeenCalledTimes(1);
      expect(parent.addChild).toHaveBeenCalledWith(child);
    });

    it("delegates custom attach to child if _customDidAttach is defined", () => {
      const child = {
        _customDidAttach: vi.fn(),
      };
      ReactPixiFiber.appendChild(parent, child);

      expect(child._customDidAttach).toHaveBeenCalledTimes(1);
      expect(child._customDidAttach).toHaveBeenCalledWith(child);
    });
  });

  describe("removeChild", () => {
    const parent = {
      removeChild: vi.fn(),
    };
    const child = {
      destroy: vi.fn(),
      id: 1,
    };

    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("removes child from parentInstance", () => {
      ReactPixiFiber.removeChild(parent, child);

      expect(parent.removeChild).toHaveBeenCalledTimes(1);
      expect(parent.removeChild).toHaveBeenCalledWith(child);
    });

    it("delegates destruction to child", () => {
      ReactPixiFiber.removeChild(parent, child);

      expect(child.destroy).toHaveBeenCalledTimes(1);
      expect(child.destroy).toHaveBeenCalledWith({ children: true });
    });

    it("delegates custom detach to child if _customWillDetach is defined", () => {
      const child = {
        _customWillDetach: vi.fn(),
        destroy: vi.fn(),
      };
      ReactPixiFiber.removeChild(parent, child);

      expect(child._customWillDetach).toHaveBeenCalledTimes(1);
      expect(child._customWillDetach).toHaveBeenCalledWith(child);
    });
  });

  describe("insertBefore", () => {
    const child1 = {
      idx: 0,
    };
    const child2 = {
      idx: 1,
    };

    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("adds child at specified index if child is already added to parent", () => {
      const parent = {
        addChildAt: vi.fn(),
        removeChild: vi.fn(),
        children: [child1, child2],
        getChildIndex: vi.fn(child => child.idx),
      };

      ReactPixiFiber.insertBefore(parent, child1, child2);
      expect(parent.removeChild).toHaveBeenCalledTimes(1);
      expect(parent.removeChild).toHaveBeenCalledWith(child1);
      expect(parent.addChildAt).toHaveBeenCalledTimes(1);
      expect(parent.addChildAt).toHaveBeenCalledWith(child1, child2.idx);
    });

    it("adds child at specified index if child is not already added to parent", () => {
      const parent = {
        addChildAt: vi.fn(),
        removeChild: vi.fn(),
        children: [child2],
        getChildIndex: vi.fn(child => child.idx),
      };

      ReactPixiFiber.insertBefore(parent, child1, child2);
      expect(parent.removeChild).not.toHaveBeenCalled();
      expect(parent.addChildAt).toHaveBeenCalledTimes(1);
      expect(parent.addChildAt).toHaveBeenCalledWith(child1, child2.idx);
    });

    it("throws if child and beforeChild is the same instance", () => {
      const parent = {};
      expect(() => ReactPixiFiber.insertBefore(parent, child1, child1)).toThrow(
        "ReactPixiFiber cannot insert node before itself"
      );
    });
  });

  describe("commitUpdate", () => {
    const type = "type";
    const instance = {};

    afterEach(() => {
      updateProperties.mockClear();
      findStrictRoot.mockClear();
      validateProperties.mockClear();
    });

    beforeAll(() => {
      updateProperties.mockImplementation(() => {});
      findStrictRoot.mockImplementation(() => strictRoot);
    });

    afterAll(() => {
      updateProperties.mockReset();
      findStrictRoot.mockReset();
    });

    it("calls updateProperties with all props for injected types", () => {
      const oldProps = { answer: 42 };
      const newProps = { answer: 1337, scale: 2 };
      const updatePayload = ReactPixiFiberComponent.diffProperties(type, instance, oldProps, newProps);
      ReactPixiFiber.commitUpdate(instance, updatePayload, type, oldProps, newProps);

      expect(updateProperties).toHaveBeenCalledTimes(1);
      expect(updateProperties).toHaveBeenCalledWith(type, instance, updatePayload, oldProps, newProps, undefined);
    });

    it("calls updateProperties with only changed props for regular types", () => {
      const type = TYPES.TEXT;
      const oldProps = { text: "42" };
      const newProps = { text: "42", scale: 2 };
      const updatePayload = ReactPixiFiberComponent.diffProperties(type, instance, oldProps, newProps);
      ReactPixiFiber.commitUpdate(instance, updatePayload, type, oldProps, newProps);

      expect(updateProperties).toHaveBeenCalledTimes(1);
      expect(updateProperties).toHaveBeenCalledWith(type, instance, updatePayload, oldProps, newProps, undefined);
    });

    it("validates properties in development", () => {
      const internalHandle = {};
      const type = TYPES.TEXT;
      const oldProps = { text: "42" };
      const newProps = { text: "42", scale: 2 };
      const updatePayload = ReactPixiFiberComponent.diffProperties(type, instance, oldProps, newProps);
      ReactPixiFiber.commitUpdate(instance, updatePayload, type, oldProps, newProps, internalHandle);

      if (__DEV__) {
        expect(findStrictRoot).toHaveBeenCalledWith(internalHandle);
        expect(validateProperties).toHaveBeenCalledTimes(1);
        expect(validateProperties).toHaveBeenCalledWith("Text", newProps);
      } else {
        expect(validateProperties).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe("createTextInstance", () => {
    it("throws", () => {
      expect(() => ReactPixiFiber.createTextInstance()).toThrow(
        "ReactPixiFiber does not support text instances. Use `Text` component instead."
      );
    });
  });

  describe("finalizeInitialChildren", () => {
    const instance = {};
    const type = "type";
    const props = {};
    const rootContainer = {};
    const hostContext = {};

    beforeEach(() => {
      setInitialProperties.mockClear();
    });

    it("returns true", () => {
      expect(ReactPixiFiber.finalizeInitialChildren(instance, type, props, rootContainer)).toBeTruthy();
    });

    it("calls setInitialProperties", () => {
      ReactPixiFiber.finalizeInitialChildren(instance, type, props, rootContainer, hostContext);
      expect(setInitialProperties).toHaveBeenCalledTimes(1);
      expect(setInitialProperties).toHaveBeenCalledWith(type, instance, props, rootContainer, hostContext);
    });
  });

  describe("getChildHostContext", () => {
    it("returns parent hostContext", () => {
      const parentHostContext = { foo: "bar" };
      expect(ReactPixiFiber.getChildHostContext(parentHostContext)).toEqual(parentHostContext);
    });
  });

  describe("getRootHostContext", () => {
    it("returns empty object", () => {
      expect(ReactPixiFiber.getRootHostContext()).toEqual(emptyObject);
    });
  });

  describe("getPublicInstance", () => {
    it("returns first argument", () => {
      const fortyTwo = "Answer to the Ultimate Question of Life, the Universe, and Everything";
      const number = 42;
      const obj = { answer: number };

      expect(ReactPixiFiber.getPublicInstance(number)).toEqual(number);
      expect(ReactPixiFiber.getPublicInstance(fortyTwo)).toEqual(fortyTwo);
      expect(ReactPixiFiber.getPublicInstance(obj)).toEqual(obj);
    });
  });

  describe("prepareForCommit", () => {
    it("does nothing", () => {
      expect(() => ReactPixiFiber.prepareForCommit()).not.toThrow();
      expect(ReactPixiFiber.prepareForCommit()).toBeNull();
    });
  });

  describe("prepareUpdate", () => {
    const instance = {};
    const type = "type";
    const returnValue = ["scale", 2];

    beforeEach(() => {
      diffProperties.mockClear();
    });

    beforeAll(() => {
      diffProperties.mockImplementation(() => returnValue);
    });

    afterAll(() => {
      diffProperties.mockReset();
    });

    it("calls diffProperties", () => {
      const oldProps = { answer: 42 };
      const newProps = { answer: 1337, scale: 2 };
      const rootContainer = null;
      const hostContext = {};
      const result = ReactPixiFiber.prepareUpdate(instance, type, oldProps, newProps, rootContainer, hostContext);

      expect(diffProperties).toHaveBeenCalledTimes(1);
      expect(diffProperties).toHaveBeenCalledWith(type, instance, oldProps, newProps);
    });
  });

  describe("resetAfterCommit", () => {
    it("does nothing", () => {
      expect(() => ReactPixiFiber.resetAfterCommit()).not.toThrow();
      expect(ReactPixiFiber.resetAfterCommit()).toBeUndefined();
    });
  });

  describe("resetTextContent", () => {
    it("does nothing", () => {
      expect(() => ReactPixiFiber.resetTextContent()).not.toThrow();
      expect(ReactPixiFiber.resetTextContent()).toBeUndefined();
    });
  });

  describe("shouldSetTextContent", () => {
    it("returns false", () => {
      expect(ReactPixiFiber.shouldSetTextContent()).toBeFalsy();
    });
  });

  describe("commitTextUpdate", () => {
    it("does nothing", () => {
      expect(() => ReactPixiFiber.commitTextUpdate()).not.toThrow();
      expect(ReactPixiFiber.commitTextUpdate()).toBeUndefined();
    });
  });

  describe("commitMount", () => {
    afterEach(() => {
      findStrictRoot.mockClear();
      validateProperties.mockClear();
    });

    beforeAll(() => {
      findStrictRoot.mockImplementation(() => strictRoot);
    });

    afterAll(() => {
      findStrictRoot.mockReset();
    });

    it("does nothing", () => {
      expect(() => ReactPixiFiber.commitMount()).not.toThrow();
      expect(ReactPixiFiber.commitMount()).toBeUndefined();
    });

    it("validates properties in development", () => {
      const internalHandle = {};
      const instance = new PIXI.Text();
      const type = TYPES.TEXT;
      const props = { text: "42" };
      ReactPixiFiber.commitMount(instance, type, props, internalHandle);

      if (__DEV__) {
        expect(findStrictRoot).toHaveBeenCalledWith(internalHandle);
        expect(validateProperties).toHaveBeenCalledTimes(1);
        expect(validateProperties).toHaveBeenCalledWith("Text", props);
      } else {
        expect(validateProperties).toHaveBeenCalledTimes(0);
      }
    });
  });
});
