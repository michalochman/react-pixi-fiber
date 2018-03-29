import React from "react";
import emptyObject from "fbjs/lib/emptyObject";
import * as PIXI from "pixi.js";
import * as ReactPixiFiber from "../src/ReactPixiFiber";
import * as ReactPixiFiberComponent from "../src/ReactPixiFiberComponent";
import { __RewireAPI__ as ReactPixiFiberRewireAPI } from "../src/ReactPixiFiber";
import { __RewireAPI__ as ReactPixiFiberUnknownPropertyHookRewireAPI } from "../src/ReactPixiFiberUnknownPropertyHook";
import { createRender } from "../src/render";
import { TYPES } from "../src/types";

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
    const type = "type";
    const instance = {};
    const updateProperties = jest.fn();

    afterEach(() => {
      updateProperties.mockReset();
    });

    beforeAll(() => {
      ReactPixiFiberRewireAPI.__Rewire__("updateProperties", updateProperties);
    });

    afterAll(() => {
      ReactPixiFiberRewireAPI.__ResetDependency__("isInjectedType");
      ReactPixiFiberRewireAPI.__ResetDependency__("updateProperties");
      ReactPixiFiberUnknownPropertyHookRewireAPI.__ResetDependency__("isInjectedType");
    });

    it("calls updateProperties with all props for injected types", () => {
      const isInjectedType = jest.fn(() => true);
      ReactPixiFiberRewireAPI.__Rewire__("isInjectedType", isInjectedType);
      ReactPixiFiberUnknownPropertyHookRewireAPI.__Rewire__("isInjectedType", isInjectedType);

      const oldProps = { answer: 42 };
      const newProps = { answer: 1337, scale: 2 };
      const updatePayload = ReactPixiFiberComponent.diffProperties(type, instance, oldProps, newProps);
      ReactPixiFiber.commitUpdate(instance, updatePayload, type, oldProps, newProps);

      expect(updateProperties).toHaveBeenCalledTimes(1);
      expect(updateProperties).toHaveBeenCalledWith(type, instance, updatePayload, oldProps, newProps, undefined);
    });

    it("calls updateProperties with only changed props for regular types", () => {
      ReactPixiFiberRewireAPI.__Rewire__("isInjectedType", jest.fn(() => false));

      const type = TYPES.TEXT;
      const oldProps = { text: "42" };
      const newProps = { text: "42", scale: 2 };
      const updatePayload = ReactPixiFiberComponent.diffProperties(type, instance, oldProps, newProps);
      ReactPixiFiber.commitUpdate(instance, updatePayload, type, oldProps, newProps);

      expect(updateProperties).toHaveBeenCalledTimes(1);
      expect(updateProperties).toHaveBeenCalledWith(type, instance, updatePayload, oldProps, newProps, undefined);
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
    const rootContainerInstance = {};
    const setInitialProperties = jest.fn();

    afterEach(() => {
      setInitialProperties.mockReset();
    });

    it("returns false", () => {
      expect(ReactPixiFiber.finalizeInitialChildren(instance, type, props, rootContainerInstance)).toBeFalsy();
    });

    it("calls setInitialProperties", () => {
      ReactPixiFiberRewireAPI.__Rewire__("setInitialProperties", setInitialProperties);
      ReactPixiFiber.finalizeInitialChildren(instance, type, props, rootContainerInstance);
      expect(setInitialProperties).toHaveBeenCalledTimes(1);
      expect(setInitialProperties).toHaveBeenCalledWith(type, instance, props, rootContainerInstance);
      ReactPixiFiberRewireAPI.__ResetDependency__("setInitialProperties");
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
    const instance = {};
    const type = "type";
    const returnValue = ["scale", 2];
    const diffProperties = jest.fn(() => returnValue);

    afterEach(() => {
      diffProperties.mockReset();
    });

    beforeAll(() => {
      ReactPixiFiberRewireAPI.__Rewire__("diffProperties", diffProperties);
    });

    afterAll(() => {
      ReactPixiFiberRewireAPI.__ResetDependency__("diffProperties");
    });

    it("calls diffProperties", () => {
      const oldProps = { answer: 42 };
      const newProps = { answer: 1337, scale: 2 };
      const rootContainerInstance = null;
      const result = ReactPixiFiber.prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance);

      expect(diffProperties).toHaveBeenCalledTimes(1);
      expect(diffProperties).toHaveBeenCalledWith(type, instance, oldProps, newProps, rootContainerInstance);
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
