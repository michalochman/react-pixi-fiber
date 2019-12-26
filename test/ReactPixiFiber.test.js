import React from "react";
import emptyObject from "fbjs/lib/emptyObject";
import * as PIXI from "pixi.js";
import * as ReactPixiFiber from "../src/ReactPixiFiber";
import { __RewireAPI__ as ReactPixiFiberRewireAPI } from "../src/ReactPixiFiber";
import { createRender } from "../src/render";
import { DEFAULT_PROPS } from "../src/props";
import { TYPES } from "../src/types";
import * as utils from "../src/utils";

jest.mock("pixi.js", () => {
  return Object.assign({}, require.requireActual("pixi.js"), {
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
  });
});

jest.mock("../src/utils", () => {
  return Object.assign({}, require.requireActual("../src/utils.js"), {
    setPixiValue: jest.fn(),
  });
});

describe("ReactPixiFiber", () => {
  describe("defaultApplyProps", () => {
    const warning = jest.fn();
    const PIXI = require.requireActual("pixi.js");

    beforeEach(() => {
      jest.resetAllMocks();
      ReactPixiFiberRewireAPI.__Rewire__("warning", warning);
    });

    afterEach(() => {
      ReactPixiFiberRewireAPI.__ResetDependency__("warning");
    });

    it("sets values of non-reserved props only", () => {
      const instance = new PIXI.Container();
      const props = {
        answer: 42,
        children: [1, 2, 3],
        foo: "bar",
      };
      ReactPixiFiber.defaultApplyProps(instance, {}, props);

      expect(utils.setPixiValue).toHaveBeenCalledTimes(2);
      expect(utils.setPixiValue).toHaveBeenCalledWith(instance, "answer", props.answer);
      expect(utils.setPixiValue).toHaveBeenCalledWith(instance, "foo", props.foo);
      expect(utils.setPixiValue).not.toHaveBeenCalledWith(instance, "children", props.children);
      expect(warning).not.toHaveBeenCalled();
    });

    it("sets default value when current value is defined, new value is undefined and default is available", () => {
      const instance = new PIXI.Container();
      instance.interactive = true;
      const oldProps = {
        interactive: true,
      };
      const newProps = {
        interactive: undefined,
      };
      ReactPixiFiber.defaultApplyProps(instance, oldProps, newProps);

      expect(utils.setPixiValue).toHaveBeenCalledTimes(1);
      expect(utils.setPixiValue).toHaveBeenCalledWith(instance, "interactive", DEFAULT_PROPS.interactive);
      expect(warning).toHaveBeenCalledTimes(1);
      expect(warning).toHaveBeenCalledWith(
        false,
        "setting default value: interactive was true is undefined for %O",
        instance
      );
    });

    it("sets default value when current value is defined, new value is not provided and default is available", () => {
      const instance = new PIXI.Container();
      instance.interactive = true;
      const oldProps = {
        interactive: true,
      };
      const newProps = {};
      ReactPixiFiber.defaultApplyProps(instance, oldProps, newProps);

      expect(utils.setPixiValue).toHaveBeenCalledTimes(1);
      expect(utils.setPixiValue).toHaveBeenCalledWith(instance, "interactive", DEFAULT_PROPS.interactive);
      expect(warning).toHaveBeenCalledTimes(1);
      expect(warning).toHaveBeenCalledWith(
        false,
        "setting default value: interactive was true is undefined for %O",
        instance
      );
    });

    it("has no effect  when current value is defined, new value is undefined and default is not available", () => {
      const instance = new PIXI.Container();
      instance.answer = 42;
      const oldProps = {
        answer: 42,
      };
      const newProps = {
        answer: undefined,
      };
      ReactPixiFiber.defaultApplyProps(instance, oldProps, newProps);

      expect(utils.setPixiValue).toHaveBeenCalledTimes(0);
      expect(warning).toHaveBeenCalledTimes(1);
      expect(warning).toHaveBeenCalledWith(false, "ignoring prop: answer was 42 is undefined for %O", instance);
    });

    it("has no effect  when current value is defined, new value is undefined and default is not available", () => {
      const instance = new PIXI.Container();
      instance.answer = 42;
      const oldProps = {
        answer: 42,
      };
      const newProps = {};
      ReactPixiFiber.defaultApplyProps(instance, oldProps, newProps);

      expect(utils.setPixiValue).toHaveBeenCalledTimes(0);
      expect(warning).toHaveBeenCalledTimes(1);
      expect(warning).toHaveBeenCalledWith(false, "ignoring prop: answer was 42 is undefined for %O", instance);
    });
  });

  describe("applyProps", () => {
    const defaultApplyProps = jest.fn();

    beforeEach(() => {
      ReactPixiFiberRewireAPI.__Rewire__("defaultApplyProps", defaultApplyProps);
    });

    afterEach(() => {
      ReactPixiFiberRewireAPI.__ResetDependency__("defaultApplyProps");
    });

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
      expect(defaultApplyProps).not.toHaveBeenCalled();
    });

    it("delegates to defaultApplyProps if _customApplyProps is not defined", () => {
      const instance = {};
      const props = {
        mask: null,
        scale: 2,
      };
      ReactPixiFiber.applyProps(instance, {}, props);

      expect(defaultApplyProps).toHaveBeenCalledTimes(1);
      expect(defaultApplyProps).toHaveBeenCalledWith(instance, {}, props);
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
      expect(child.destroy).toHaveBeenCalledWith({ children: true });
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
    const child1 = {
      idx: 0,
    };
    const child2 = {
      idx: 1,
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("adds child at specified index if child is already added to parent", () => {
      const parent = {
        addChildAt: jest.fn(),
        removeChild: jest.fn(),
        children: [child1, child2],
        getChildIndex: jest.fn(child => child.idx),
      };

      ReactPixiFiber.insertBefore(parent, child1, child2);
      expect(parent.removeChild).toHaveBeenCalledTimes(1);
      expect(parent.removeChild).toHaveBeenCalledWith(child1);
      expect(parent.addChildAt).toHaveBeenCalledTimes(1);
      expect(parent.addChildAt).toHaveBeenCalledWith(child1, child2.idx);
    });

    it("adds child at specified index if child is not already added to parent", () => {
      const parent = {
        addChildAt: jest.fn(),
        removeChild: jest.fn(),
        children: [child2],
        getChildIndex: jest.fn(child => child.idx),
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
    const applyProps = jest.fn();

    afterEach(() => {
      applyProps.mockReset();
    });

    beforeAll(() => {
      ReactPixiFiberRewireAPI.__Rewire__("applyProps", applyProps);
    });

    afterAll(() => {
      ReactPixiFiberRewireAPI.__ResetDependency__("applyProps");
      ReactPixiFiberRewireAPI.__ResetDependency__("isInjectedType");
    });

    it("calls applyProps with all props for injected types", () => {
      ReactPixiFiberRewireAPI.__Rewire__("isInjectedType", jest.fn(() => true));

      const instance = {};
      const oldProps = { answer: 42 };
      const newProps = { answer: 1337, scale: 2 };
      const updatePayload = ReactPixiFiber.diffProps(instance, "type", oldProps, newProps);
      ReactPixiFiber.commitUpdate(instance, updatePayload, "type", oldProps, newProps);

      expect(applyProps).toHaveBeenCalledTimes(1);
      expect(applyProps).toHaveBeenCalledWith(instance, oldProps, newProps);
    });

    it("calls applyProps with only changed props for regular types", () => {
      ReactPixiFiberRewireAPI.__Rewire__("isInjectedType", jest.fn(() => false));

      const instance = {};
      const oldProps = { answer: 42 };
      const newProps = { answer: 42, scale: 2 };
      const updatePayload = ReactPixiFiber.diffProps(instance, "type", oldProps, newProps);
      ReactPixiFiber.commitUpdate(instance, updatePayload, "type", oldProps, newProps);

      expect(applyProps).toHaveBeenCalledTimes(1);
      expect(applyProps).toHaveBeenCalledWith(instance, {}, { scale: 2 });
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
      const createInjectedTypeInstance = jest.fn(() => instance);
      ReactPixiFiberRewireAPI.__Rewire__("createInjectedTypeInstance", createInjectedTypeInstance);
      expect(() => ReactPixiFiber.createInstance("INJECTED_TYPE", {})).not.toThrow();
      ReactPixiFiberRewireAPI.__ResetDependency__("createInjectedTypeInstance");
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
    const returnValue = ["scale", 2];
    const diffProps = jest.fn(() => returnValue);

    afterEach(() => {
      diffProps.mockReset();
    });

    beforeAll(() => {
      ReactPixiFiberRewireAPI.__Rewire__("diffProps", diffProps);
    });

    afterAll(() => {
      ReactPixiFiberRewireAPI.__ResetDependency__("diffProps");
    });

    it("calls diffProps", () => {
      const instance = {};
      const type = "type";
      const oldProps = { answer: 42 };
      const newProps = { answer: 1337, scale: 2 };
      const rootContainerInstance = null;
      const result = ReactPixiFiber.prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance);

      // expect(result).toEqual(returnValue);
      expect(diffProps).toHaveBeenCalledTimes(1);
      expect(diffProps).toHaveBeenCalledWith(instance, type, oldProps, newProps, rootContainerInstance);
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

  describe("unstable_batchedUpdates", () => {
    it("should render one time when call setState many times", () => {
      const render = createRender(ReactPixiFiber.ReactPixiFiberAsPrimaryRenderer);
      const app = new PIXI.Application();
      const root = app.stage;
      const nextState = {};
      const fooRender = jest.fn();
      let foo = null;

      class Foo extends React.Component {
        constructor() {
          super();
          this.state = { bar: 1 };
          this.render = fooRender;
        }
        componentDidMount() {
          foo = this;
        }
      }

      render(<Foo />, root);

      // first render
      expect(fooRender).toHaveBeenCalledTimes(1);

      ReactPixiFiber.unstable_batchedUpdates(() => {
        foo.setState(nextState);
        foo.setState(nextState);
      });

      expect(fooRender).toHaveBeenCalledTimes(2);
    });
  });
});
