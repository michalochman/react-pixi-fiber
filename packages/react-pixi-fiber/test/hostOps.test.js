import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
// The temporary src/render.ts bridge builds its renderers from hostOps at import time and is reached from
// hostOps' own imports (through src/config.ts), so it must load first. Task 11 makes render lazy and drops this.
import "../src/render";
import * as hostOps from "../src/hostOps";
import { validateProperties as validateUnknownProperties } from "../src/ReactPixiFiberUnknownPropertyHook";
import { createRegisteredInstance, normalizeBehavior } from "../src/registry";
import { TAGS } from "../src/tags";
import { findStrictRoot } from "../src/utils";

vi.mock("../src/utils", async importOriginal => ({
  ...(await importOriginal()),
  findStrictRoot: vi.fn(),
}));
vi.mock("../src/ReactPixiFiberUnknownPropertyHook", async importOriginal => ({
  ...(await importOriginal()),
  validateProperties: vi.fn(),
}));

describe("hostOps", () => {
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
      hostOps.appendChild(parent, child);

      expect(parent.removeChild).toHaveBeenCalledTimes(1);
      expect(parent.removeChild).toHaveBeenCalledWith(child);
    });

    it("adds child to parentInstance", () => {
      hostOps.appendChild(parent, child);

      expect(parent.addChild).toHaveBeenCalledTimes(1);
      expect(parent.addChild).toHaveBeenCalledWith(child);
    });

    it("calls afterAdd of a registered child", () => {
      const afterAdd = vi.fn();
      const child = createRegisteredInstance(
        "T",
        normalizeBehavior("T", { create: () => ({}), afterAdd }),
        {},
        () => {}
      );
      hostOps.appendChild(parent, child);

      expect(afterAdd).toHaveBeenCalledTimes(1);
      expect(afterAdd).toHaveBeenCalledWith(child);
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
      hostOps.removeChild(parent, child);

      expect(parent.removeChild).toHaveBeenCalledTimes(1);
      expect(parent.removeChild).toHaveBeenCalledWith(child);
    });

    it("delegates destruction to child", () => {
      hostOps.removeChild(parent, child);

      expect(child.destroy).toHaveBeenCalledTimes(1);
      expect(child.destroy).toHaveBeenCalledWith({ children: true });
    });

    it("calls beforeRemove of a registered child before removing it", () => {
      const beforeRemove = vi.fn(() => expect(parent.removeChild).not.toHaveBeenCalled());
      const child = createRegisteredInstance(
        "T",
        normalizeBehavior("T", { create: () => ({ destroy: vi.fn() }), beforeRemove }),
        {},
        () => {}
      );
      hostOps.removeChild(parent, child);

      expect(beforeRemove).toHaveBeenCalledTimes(1);
      expect(beforeRemove).toHaveBeenCalledWith(child);
      expect(parent.removeChild).toHaveBeenCalledWith(child);
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

      hostOps.insertBefore(parent, child1, child2);
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

      hostOps.insertBefore(parent, child1, child2);
      expect(parent.removeChild).not.toHaveBeenCalled();
      expect(parent.addChildAt).toHaveBeenCalledTimes(1);
      expect(parent.addChildAt).toHaveBeenCalledWith(child1, child2.idx);
    });

    it("calls afterAdd after inserting a registered instance", () => {
      const afterAdd = vi.fn();
      const behavior = normalizeBehavior("T", { create: () => ({ idx: 5 }), afterAdd });
      const child = createRegisteredInstance("T", behavior, {}, () => {});
      const parent = {
        addChildAt: vi.fn(),
        removeChild: vi.fn(),
        children: [child1],
        getChildIndex: vi.fn(child => child.idx),
      };
      hostOps.insertBefore(parent, child, child1);
      expect(afterAdd).toHaveBeenCalledWith(child);
      expect(parent.addChildAt).toHaveBeenCalledWith(child, 0);
    });

    it("throws if child and beforeChild is the same instance", () => {
      const parent = {};
      expect(() => hostOps.insertBefore(parent, child1, child1)).toThrow(
        "ReactPixiFiber cannot insert node before itself"
      );
    });
  });

  describe("clearContainer", () => {
    it("removes all children of the container", () => {
      const container = { removeChildren: vi.fn() };
      hostOps.clearContainer(container);
      expect(container.removeChildren).toHaveBeenCalledTimes(1);
    });

    it("does nothing without a container", () => {
      expect(() => hostOps.clearContainer(null)).not.toThrow();
    });
  });

  describe("hideInstance", () => {
    it("makes the instance invisible", () => {
      const instance = { visible: true };
      hostOps.hideInstance(instance);
      expect(instance.visible).toBe(false);
    });
  });

  describe("unhideInstance", () => {
    it("restores the visible prop", () => {
      const instance = { visible: false };
      hostOps.unhideInstance(instance, { visible: false });
      expect(instance.visible).toBe(false);
    });

    it("makes the instance visible without a visible prop", () => {
      const instance = { visible: false };
      hostOps.unhideInstance(instance, {});
      expect(instance.visible).toBe(true);
    });
  });

  describe("validateProperties", () => {
    afterEach(() => {
      findStrictRoot.mockReset();
      validateUnknownProperties.mockClear();
    });

    it("validates properties under a strict root in development", () => {
      const internalHandle = {};
      const props = { text: "42" };
      findStrictRoot.mockImplementation(() => ({}));
      hostOps.validateProperties(TAGS.Text, props, internalHandle);

      if (__DEV__) {
        expect(findStrictRoot).toHaveBeenCalledWith(internalHandle, 8);
        expect(validateUnknownProperties).toHaveBeenCalledTimes(1);
        expect(validateUnknownProperties).toHaveBeenCalledWith("Text", props);
      } else {
        expect(validateUnknownProperties).toHaveBeenCalledTimes(0);
      }
    });

    it("does not validate properties without a strict root", () => {
      findStrictRoot.mockImplementation(() => null);
      hostOps.validateProperties(TAGS.Text, { text: "42" }, {});
      expect(validateUnknownProperties).not.toHaveBeenCalled();
    });
  });
});
