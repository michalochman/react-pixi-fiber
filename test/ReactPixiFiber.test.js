import emptyObject from "fbjs/lib/emptyObject";
import * as PIXI from "pixi.js";
import * as ReactPixiFiber from "../src/ReactPixiFiber";
import * as inject from "../src/inject";
import { DEFAULT_PROPS } from "../src/props";
import { TYPES } from "../src/types";
import * as utils from "../src/utils";

jest.mock("pixi.js", () => {
  return {
    ...require.requireActual("pixi.js"),
    Container: jest.fn(),
    Graphics: jest.fn(),
    Sprite: jest.fn(),
    Text: jest.fn(),
    extras: {
      BitmapText: jest.fn(),
      TilingSprite: jest.fn(),
    },
    particles: {
      ParticleContainer: jest.fn(),
    },
  };
});
jest.mock("../src/inject");
jest.mock("../src/utils", () => {
  return {
    ...require.requireActual("../src/utils.js"),
    setPixiValue: jest.fn(),
  };
});

describe("ReactPixiFiber", () => {
  describe("defaultApplyProps", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("sets values of non-reserved props only", () => {
      const instance = {};
      const props = {
        answer: 42,
        children: [1, 2, 3],
        key: "value",
      };
      ReactPixiFiber.defaultApplyProps(instance, {}, props);

      expect(utils.setPixiValue).toHaveBeenCalledTimes(2);
      expect(utils.setPixiValue).toHaveBeenCalledWith(instance, "answer", props.answer);
      expect(utils.setPixiValue).toHaveBeenCalledWith(instance, "key", props.key);
      expect(utils.setPixiValue).not.toHaveBeenCalledWith(instance, "children", props.children);
    });

    it("sets default value when current value is defined, new value is undefined and default is available", () => {
      const instance = {
        mask: new PIXI.Graphics(),
      };
      const props = {
        mask: undefined,
      };
      ReactPixiFiber.defaultApplyProps(instance, {}, props);

      expect(utils.setPixiValue).toHaveBeenCalledTimes(1);
      expect(utils.setPixiValue).toHaveBeenCalledWith(instance, "mask", DEFAULT_PROPS.mask);
    });

    it("has no effect when current value is defined, new value is undefined and default is not available", () => {
      const instance = {
        answer: 42,
      };
      const props = {
        answer: undefined,
      };
      ReactPixiFiber.defaultApplyProps(instance, {}, props);

      expect(utils.setPixiValue).toHaveBeenCalledTimes(0);
    });
  });

  describe("applyProps", () => {
    it("delegates to custom component if _customApplyProps is defined", () => {
      const instance = {
        _customApplyProps: jest.fn(),
      };
      const props = {
        scale: 2,
      };
      ReactPixiFiber.applyProps(instance, {}, props);

      expect(instance._customApplyProps).toHaveBeenCalledTimes(1);
      expect(instance._customApplyProps).toHaveBeenCalledWith(instance, {}, props);
      expect(utils.setPixiValue).toHaveBeenCalledTimes(0);
    });
    it("delegates to defaultApplyProps if _customApplyProps is not defined", () => {
      const instance = {};
      const props = {
        mask: null,
        scale: 2,
      };
      ReactPixiFiber.applyProps(instance, {}, props);

      expect(utils.setPixiValue).toHaveBeenCalledTimes(Object.keys(props).length);
    });
  });

  describe("diffProps", () => {
    it("returns null if props did not change", () => {
      expect(ReactPixiFiber.diffProps({}, "Text", {}, {})).toBeNull();
    });
    it("returns changed prop keys and values list if props changed", () => {
      const oldProps = { position: "0,0", scale: 2, text: "Hello World!" };
      const newProps = { pivot: "0,0", scale: 2, text: "Goodbye World!" };
      expect(ReactPixiFiber.diffProps({}, "Text", oldProps, newProps)).toEqual([
        "position",
        null,
        "pivot",
        "0,0",
        "text",
        "Goodbye World!",
      ]);
    });
  });

  describe("appendChild", () => {
    const parent = {
      addChild: jest.fn(),
      removeChild: jest.fn(),
    };
    const child = { id: 1 };

    beforeEach(() => {
      jest.resetAllMocks();
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
        _customDidAttach: jest.fn(),
      };
      ReactPixiFiber.appendChild(parent, child);

      expect(child._customDidAttach).toHaveBeenCalledTimes(1);
      expect(child._customDidAttach).toHaveBeenCalledWith(child);
    });
  });

  describe("removeChild", () => {
    const parent = {
      removeChild: jest.fn(),
    };
    const child = {
      destroy: jest.fn(),
      id: 1,
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("removes child from parentInstance", () => {
      ReactPixiFiber.removeChild(parent, child);

      expect(parent.removeChild).toHaveBeenCalledTimes(1);
      expect(parent.removeChild).toHaveBeenCalledWith(child);
    });

    it("delegates destruction to child", () => {
      ReactPixiFiber.removeChild(parent, child);

      expect(child.destroy).toHaveBeenCalledTimes(1);
      expect(child.destroy).toHaveBeenCalledWith();
    });

    it("delegates custom detach to child if _customWillDetach is defined", () => {
      const child = {
        _customWillDetach: jest.fn(),
        destroy: jest.fn(),
      };
      ReactPixiFiber.removeChild(parent, child);

      expect(child._customWillDetach).toHaveBeenCalledTimes(1);
      expect(child._customWillDetach).toHaveBeenCalledWith(child);
    });
  });

  describe("insertBefore", () => {
    const parent = {
      getChildIndex: jest.fn(),
    };
    const child1 = {
      idx: 0,
    };
    const child2 = {
      idx: 1,
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("sets child index if child is already added to parent", () => {
      const parent = {
        addChildAt: jest.fn(),
        children: [child1, child2],
        getChildIndex: jest.fn(child => child.idx),
        setChildIndex: jest.fn(),
      };

      ReactPixiFiber.insertBefore(parent, child1, child2);
      expect(parent.setChildIndex).toHaveBeenCalledTimes(1);
      expect(parent.setChildIndex).toHaveBeenCalledWith(child1, child2.idx);

      parent.setChildIndex.mockReset();

      ReactPixiFiber.insertBefore(parent, child2, child1);
      expect(parent.setChildIndex).toHaveBeenCalledTimes(1);
      expect(parent.setChildIndex).toHaveBeenCalledWith(child2, child1.idx);
    });

    it("adds child at specified index if child is not already added to parent", () => {
      const parent = {
        addChildAt: jest.fn(),
        children: [child2],
        getChildIndex: jest.fn(child => child.idx),
        setChildIndex: jest.fn(),
      };

      ReactPixiFiber.insertBefore(parent, child1, child2);
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
    const applyProps = ReactPixiFiber.applyProps;

    beforeAll(() => {
      ReactPixiFiber.applyProps = jest.fn();
    });

    afterAll(() => {
      ReactPixiFiber.applyProps = applyProps;
    });

    it("calls applyProps", () => {
      const instance = {};
      const oldProps = { answer: 42 };
      const newProps = { answer: 1337, scale: 2 };
      const updatePayload = ["scale", 2];
      ReactPixiFiber.commitUpdate(instance, updatePayload, "type", oldProps, newProps);

      expect(ReactPixiFiber.applyProps).toHaveBeenCalledTimes(1);
      expect(ReactPixiFiber.applyProps).toHaveBeenCalledWith(instance, {}, { scale: 2 });
    });
  });

  describe("createInstance", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("returns PIXI.BitmapText if type is BITMAP_TEXT", () => {
      const text = "Hello World";
      const style = { font: "16 Arial" };
      ReactPixiFiber.createInstance(TYPES.BITMAP_TEXT, { text, style });

      expect(PIXI.extras.BitmapText).toHaveBeenCalledTimes(1);
      expect(PIXI.extras.BitmapText).toHaveBeenCalledWith(text, style);
    });

    it("returns PIXI.Container if type is CONTAINER", () => {
      ReactPixiFiber.createInstance(TYPES.CONTAINER, {});

      expect(PIXI.Container).toHaveBeenCalledTimes(1);
      expect(PIXI.Container).toHaveBeenCalledWith();
    });

    it("returns PIXI.Graphics if type is GRAPHICS", () => {
      ReactPixiFiber.createInstance(TYPES.GRAPHICS, {});

      expect(PIXI.Graphics).toHaveBeenCalledTimes(1);
      expect(PIXI.Graphics).toHaveBeenCalledWith();
    });

    it("returns PIXI.ParticleContainer if type is PARTICLE_CONTAINER", () => {
      const maxSize = 1024;
      const properties = { rotation: true };
      const batchSize = 128;
      const autoResize = false;
      ReactPixiFiber.createInstance(TYPES.PARTICLE_CONTAINER, { autoResize, batchSize, maxSize, properties });

      expect(PIXI.particles.ParticleContainer).toHaveBeenCalledTimes(1);
      expect(PIXI.particles.ParticleContainer).toHaveBeenCalledWith(maxSize, properties, batchSize, autoResize);
    });

    it("returns PIXI.Sprite if type is SPRITE", () => {
      const texture = "TEXTURE";
      ReactPixiFiber.createInstance(TYPES.SPRITE, { texture });

      expect(PIXI.Sprite).toHaveBeenCalledTimes(1);
      expect(PIXI.Sprite).toHaveBeenCalledWith(texture);
    });

    it("returns PIXI.Text if type is TEXT", () => {
      const text = "Hello World";
      const style = { fontFamily: "Arial" };
      const canvas = document.createElement("canvas");
      ReactPixiFiber.createInstance(TYPES.TEXT, { text, style, canvas });

      expect(PIXI.Text).toHaveBeenCalledTimes(1);
      expect(PIXI.Text).toHaveBeenCalledWith(text, style, canvas);
    });

    it("returns PIXI.TilingSprite if type is TILING_SPRITE", () => {
      const texture = "TEXTURE";
      const height = 16;
      const width = 32;
      ReactPixiFiber.createInstance(TYPES.TILING_SPRITE, { height, texture, width });

      expect(PIXI.extras.TilingSprite).toHaveBeenCalledTimes(1);
      expect(PIXI.extras.TilingSprite).toHaveBeenCalledWith(texture, width, height);
    });

    it("returns injected instance if type was injected", () => {
      const instance = {};
      inject.createInjectedTypeInstance = jest.fn(() => instance);
      expect(() => ReactPixiFiber.createInstance("INJECTED_TYPE", {})).not.toThrow();
    });

    it("throws if type is not supported", () => {
      expect(() => ReactPixiFiber.createInstance("INJECTED_TYPE", {})).toThrow(
        "ReactPixiFiber does not support the type: `INJECTED_TYPE`."
      );
    });
  });

  describe("createTextInstance", () => {
    it("throws", () => {
      expect(() => ReactPixiFiber.createTextInstance()).toThrow(
        "ReactPixiFiber does not support text instances. Use Text component instead."
      );
    });
  });

  describe("finalizeInitialChildren", () => {
    it("returns false", () => {
      expect(ReactPixiFiber.finalizeInitialChildren()).toBeFalsy();
    });
  });

  describe("getChildHostContext", () => {
    it("returns empty object", () => {
      expect(ReactPixiFiber.getChildHostContext()).toEqual(emptyObject);
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
      expect(ReactPixiFiber.prepareForCommit()).toBeUndefined();
    });
  });

  describe("prepareUpdate", () => {
    const diffProps = ReactPixiFiber.diffProps;
    const returnValue = ["scale", 2];

    beforeAll(() => {
      ReactPixiFiber.diffProps = jest.fn(() => returnValue);
    });

    afterAll(() => {
      ReactPixiFiber.diffProps = diffProps;
    });

    it("calls diffProps", () => {
      const instance = {};
      const type = "type";
      const oldProps = { answer: 42 };
      const newProps = { answer: 1337, scale: 2 };
      const rootContainerInstance = null;
      const result = ReactPixiFiber.prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance);

      expect(ReactPixiFiber.diffProps).toHaveBeenCalledTimes(1);
      expect(ReactPixiFiber.diffProps).toHaveBeenCalledWith(instance, type, oldProps, newProps, rootContainerInstance);
      expect(result).toEqual(returnValue);
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

  describe("shouldDeprioritizeSubtree", () => {
    it("returns true when alpha is 0", () => {
      expect(ReactPixiFiber.shouldDeprioritizeSubtree(null, { alpha: 0 })).toBeTruthy();
    });

    it("returns true when renderable is false", () => {
      expect(ReactPixiFiber.shouldDeprioritizeSubtree(null, { renderable: false })).toBeTruthy();
    });

    it("returns true when visible is false", () => {
      expect(ReactPixiFiber.shouldDeprioritizeSubtree(null, { visible: false })).toBeTruthy();
    });

    it("returns false when alpha is not 0, renderable is true and visible is true", () => {
      expect(ReactPixiFiber.shouldDeprioritizeSubtree(null, { alpha: 1, renderable: true, visible: true })).toBeFalsy();
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
    it("does nothing", () => {
      expect(() => ReactPixiFiber.commitMount()).not.toThrow();
      expect(ReactPixiFiber.commitMount()).toBeUndefined();
    });
  });
});
