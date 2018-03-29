import { injectType } from "../src/ReactPixiFiber";
import { INJECTED_TYPES, createInjectedTypeInstance, isInjectedType } from "../src/inject";

jest.mock("../src/ReactPixiFiber");

describe("inject", () => {
  beforeEach(() => {
    // injectType is mutating INJECTED_TYPES
    jest.resetModules();
  });

  describe("injectType", () => {
    it("should add type to INJECTED_TYPES", () => {
      const inject = require("../src/inject");
      const type = "INJECTED_TYPE";
      const behavior = {};
      expect(inject.INJECTED_TYPES).not.toHaveProperty(type);
      expect(inject.injectType(type, behavior));
      expect(inject.INJECTED_TYPES).toHaveProperty(type, behavior);
    });
  });

  describe("INJECTED_TYPES", () => {
    it("is empty object", () => {
      expect(Object.keys(INJECTED_TYPES)).toHaveLength(0);
    });
  });

  describe("createInjectedTypeInstance", () => {
    it("returns undefined if type is not in INJECTED_TYPES", () => {
      expect(createInjectedTypeInstance("NON_EXISTENT_TYPE", {})).toBeUndefined();
    });
    it("throws when passed incompatible behavior", () => {
      const inject = require("../src/inject");
      const type = "INJECTED_TYPE";
      // incompatible behavior
      const behavior = {};
      inject.injectType(type, behavior);
      expect(() => inject.createInjectedTypeInstance(type)).toThrow();
    });
    it("returns an instance of type if type is in INJECTED_TYPES (with simple behavior)", () => {
      const inject = require("../src/inject");
      const type = "INJECTED_TYPE";
      // just return the type name
      const customDisplayObject = () => type;
      inject.injectType(type, customDisplayObject);
      expect(inject.createInjectedTypeInstance(type)).toBeDefined();
      expect(inject.createInjectedTypeInstance(type)).toEqual(customDisplayObject());
    });
    it("returns an instance of type if type is in INJECTED_TYPES (with full behavior)", () => {
      const inject = require("../src/inject");
      const type = "INJECTED_TYPE";
      const behavior = {
        // customDisplayObject will just return the type name
        customDisplayObject: () => type,
      };
      inject.injectType(type, behavior);
      expect(inject.createInjectedTypeInstance(type)).toBeDefined();
      expect(inject.createInjectedTypeInstance(type)).toEqual(behavior.customDisplayObject());
    });
    it("calls type constructor with props", () => {
      const inject = require("../src/inject");
      const type = "INJECTED_TYPE";
      const customDisplayObject = jest.fn();
      inject.injectType(type, customDisplayObject);
      const props = { prop: "value" };
      inject.createInjectedTypeInstance(type, props);
      expect(customDisplayObject).toHaveBeenCalledTimes(1);
      expect(customDisplayObject).toHaveBeenCalledWith(props);
    });
    it("attaches custom behavior to created instance", () => {
      const inject = require("../src/inject");
      const type = "INJECTED_TYPE";
      const behavior = {
        customDisplayObject: () => ({}),
        customApplyProps: function(instance, oldProps, newProps) {
          // returning `this` so we can test bound `this` value
          return this;
        },
        customDidAttach: jest.fn(),
        customWillDetach: jest.fn(),
      };
      inject.injectType(type, behavior);

      const applyDisplayObjectProps = jest.fn();
      const oldProps = { value: 1 };
      const newProps = { value: 2 };
      const instance = inject.createInjectedTypeInstance(type, {}, null, applyDisplayObjectProps);

      const context = instance._customApplyProps(instance, oldProps, newProps);
      expect(context).toHaveProperty("applyDisplayObjectProps");

      context.applyDisplayObjectProps(oldProps, newProps);
      expect(applyDisplayObjectProps).toHaveBeenCalledTimes(1);
      expect(applyDisplayObjectProps).toHaveBeenCalledWith(type, instance, oldProps, newProps);

      expect(instance._customDidAttach).toEqual(behavior.customDidAttach);
      expect(instance._customWillDetach).toEqual(behavior.customWillDetach);
    });
  });

  describe("isInjectedType", () => {
    it("returns true if type is injected", () => {
      const inject = require("../src/inject");
      const type = "INJECTED_TYPE";
      const behavior = () => ({});
      inject.injectType(type, behavior);

      expect(inject.isInjectedType(type)).toBeTruthy();
    });
    it("returns false if type is not injected", () => {
      expect(isInjectedType("NOT_INJECTED_TYPE")).toBeFalsy();
    });
  });
});
