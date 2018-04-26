import * as PIXI from "pixi.js";
import * as PixiProperty from "../src/PixiProperty";
import { __RewireAPI__ as PixiPropertyRewireAPI } from "../src/PixiProperty";

describe("PixiProperty", () => {
  describe("types", () => {
    it("should have correct values", () => {
      expect(PixiProperty.RESERVED).toEqual(0);
      expect(PixiProperty.STRING).toEqual(1);
      expect(PixiProperty.BOOLEAN).toEqual(2);
      expect(PixiProperty.NUMERIC).toEqual(3);
      expect(PixiProperty.POSITIVE_NUMERIC).toEqual(4);
      expect(PixiProperty.VECTOR).toEqual(5);
      expect(PixiProperty.CALLBACK).toEqual(6);
    });
  });

  describe("shouldIgnoreAttribute", () => {
    it("should return true if property info is defined and property is reserved", () => {
      expect(PixiProperty.shouldIgnoreAttribute("type", "prop", { type: PixiProperty.RESERVED })).toBeTruthy();
    });

    it("should return true if property info is defined and property is not reserved", () => {
      expect(PixiProperty.shouldIgnoreAttribute("type", "prop", { type: PixiProperty.STRING })).toBeFalsy();
    });

    it("should return false for injected types", () => {
      PixiPropertyRewireAPI.__Rewire__("isInjectedType", jest.fn(() => true));
      expect(PixiProperty.shouldIgnoreAttribute("type", "prop", null)).toBeFalsy();
      PixiPropertyRewireAPI.__ResetDependency__("isInjectedType");
    });

    it("should return false otherwise", () => {
      PixiPropertyRewireAPI.__Rewire__("isInjectedType", jest.fn(() => false));
      expect(PixiProperty.shouldIgnoreAttribute("type", "prop", null)).toBeFalsy();
      PixiPropertyRewireAPI.__ResetDependency__("isInjectedType");
    });
  });

  describe("shouldRemoveAttributeWithWarning", () => {
    it("should return false if property info is defined and property is reserved", () => {
      expect(
        PixiProperty.shouldRemoveAttributeWithWarning("type", "prop", "value", { type: PixiProperty.RESERVED })
      ).toBeFalsy();
    });

    it("should return false if value is boolean for injected types", () => {
      PixiPropertyRewireAPI.__Rewire__("isInjectedType", jest.fn(() => true));
      expect(PixiProperty.shouldRemoveAttributeWithWarning("type", "prop", true, null)).toBeFalsy();
      expect(PixiProperty.shouldRemoveAttributeWithWarning("type", "prop", false, null)).toBeFalsy();
      PixiPropertyRewireAPI.__ResetDependency__("isInjectedType");
    });

    it("should return true if value is boolean and property info is null for regular types", () => {
      PixiPropertyRewireAPI.__Rewire__("isInjectedType", jest.fn(() => false));
      expect(PixiProperty.shouldRemoveAttributeWithWarning("type", "prop", true, null)).toBeTruthy();
      expect(PixiProperty.shouldRemoveAttributeWithWarning("type", "prop", false, null)).toBeTruthy();
      PixiPropertyRewireAPI.__ResetDependency__("isInjectedType");
    });

    it("should return true if value is boolean and property does not accept booleans for regular types", () => {
      PixiPropertyRewireAPI.__Rewire__("isInjectedType", jest.fn(() => false));
      expect(
        PixiProperty.shouldRemoveAttributeWithWarning("type", "prop", true, { acceptsBooleans: false })
      ).toBeTruthy();
      expect(
        PixiProperty.shouldRemoveAttributeWithWarning("type", "prop", false, { acceptsBooleans: false })
      ).toBeTruthy();
      PixiPropertyRewireAPI.__ResetDependency__("isInjectedType");
    });

    it("should return false if value is boolean and property accepts booleans for regular types", () => {
      PixiPropertyRewireAPI.__Rewire__("isInjectedType", jest.fn(() => false));
      expect(
        PixiProperty.shouldRemoveAttributeWithWarning("type", "prop", true, { acceptsBooleans: true })
      ).toBeFalsy();
      expect(
        PixiProperty.shouldRemoveAttributeWithWarning("type", "prop", false, { acceptsBooleans: true })
      ).toBeFalsy();
      PixiPropertyRewireAPI.__ResetDependency__("isInjectedType");
    });

    it("should return false if value is function for injected types", () => {
      PixiPropertyRewireAPI.__Rewire__("isInjectedType", jest.fn(() => true));
      expect(PixiProperty.shouldRemoveAttributeWithWarning("type", "prop", () => {}, null)).toBeFalsy();
      PixiPropertyRewireAPI.__ResetDependency__("isInjectedType");
    });

    it("should return true if value is function and property info is null for regular types", () => {
      PixiPropertyRewireAPI.__Rewire__("isInjectedType", jest.fn(() => false));
      expect(PixiProperty.shouldRemoveAttributeWithWarning("type", "prop", () => {}, null)).toBeTruthy();
      PixiPropertyRewireAPI.__ResetDependency__("isInjectedType");
    });

    it("should return true if value is function and property is not a callback for regular types", () => {
      PixiPropertyRewireAPI.__Rewire__("isInjectedType", jest.fn(() => false));
      expect(
        PixiProperty.shouldRemoveAttributeWithWarning("type", "prop", () => {}, { type: PixiProperty.STRING })
      ).toBeTruthy();
      PixiPropertyRewireAPI.__ResetDependency__("isInjectedType");
    });

    it("should return false if value is function and property is a callback for regular types", () => {
      PixiPropertyRewireAPI.__Rewire__("isInjectedType", jest.fn(() => false));
      expect(
        PixiProperty.shouldRemoveAttributeWithWarning("type", "prop", () => {}, { type: PixiProperty.CALLBACK })
      ).toBeFalsy();
      PixiPropertyRewireAPI.__ResetDependency__("isInjectedType");
    });

    it("should return true if value is a symbol", () => {
      expect(PixiProperty.shouldRemoveAttributeWithWarning("type", "prop", Symbol("foo"), null)).toBeTruthy();
    });
  });

  describe("shouldRemoveAttribute", () => {
    const type = "type";
    const name = "prop";

    it("should return true if value is undefined", () => {
      expect(PixiProperty.shouldRemoveAttribute(type, name, undefined, null)).toBeTruthy();
    });

    it("should return true if shouldRemoveAttributeWithWarning returns true", () => {
      PixiPropertyRewireAPI.__Rewire__("shouldRemoveAttributeWithWarning", jest.fn(() => true));
      expect(PixiProperty.shouldRemoveAttribute(type, name, "value", null)).toBeTruthy();
      PixiPropertyRewireAPI.__ResetDependency__("shouldRemoveAttributeWithWarning");
    });

    it("should return true if property is a callback and value is not a function", () => {
      expect(PixiProperty.shouldRemoveAttribute(type, name, "value", { type: PixiProperty.CALLBACK })).toBeTruthy();
    });

    it("should return false if property is a callback and value is a function", () => {
      expect(PixiProperty.shouldRemoveAttribute(type, name, () => {}, { type: PixiProperty.CALLBACK })).toBeFalsy();
    });

    it("should return true if property is numeric and value is not a number", () => {
      expect(PixiProperty.shouldRemoveAttribute(type, name, NaN, { type: PixiProperty.NUMERIC })).toBeTruthy();
    });

    it("should return false if property is numeric and value is a number", () => {
      expect(PixiProperty.shouldRemoveAttribute(type, name, 42, { type: PixiProperty.NUMERIC })).toBeFalsy();
    });

    it("should return true if property is positive numeric and value is not a number", () => {
      expect(PixiProperty.shouldRemoveAttribute(type, name, NaN, { type: PixiProperty.POSITIVE_NUMERIC })).toBeTruthy();
    });

    it("should return true if property is positive numeric and value is negative", () => {
      expect(PixiProperty.shouldRemoveAttribute(type, name, -42, { type: PixiProperty.POSITIVE_NUMERIC })).toBeTruthy();
    });

    it("should return false if property is positive numeric and value is zero", () => {
      expect(PixiProperty.shouldRemoveAttribute(type, name, 0, { type: PixiProperty.POSITIVE_NUMERIC })).toBeFalsy();
    });

    it("should return false if property is positive numeric and value is a positive number", () => {
      expect(PixiProperty.shouldRemoveAttribute(type, name, 42, { type: PixiProperty.POSITIVE_NUMERIC })).toBeFalsy();
    });

    it("should return true if property is vector and value is not a vector", () => {
      expect(PixiProperty.shouldRemoveAttribute(type, name, "value", { type: PixiProperty.VECTOR })).toBeTruthy();
      expect(PixiProperty.shouldRemoveAttribute(type, name, [NaN], { type: PixiProperty.VECTOR })).toBeTruthy();
    });

    it("should return true if property is vector and value is a vector", () => {
      expect(PixiProperty.shouldRemoveAttribute(type, name, "2", { type: PixiProperty.VECTOR })).toBeFalsy();
      expect(PixiProperty.shouldRemoveAttribute(type, name, "13,37", { type: PixiProperty.VECTOR })).toBeFalsy();
      expect(PixiProperty.shouldRemoveAttribute(type, name, [1], { type: PixiProperty.VECTOR })).toBeFalsy();
      expect(PixiProperty.shouldRemoveAttribute(type, name, [0, 0], { type: PixiProperty.VECTOR })).toBeFalsy();
      expect(PixiProperty.shouldRemoveAttribute(type, name, { x: 0, y: 0 }, { type: PixiProperty.VECTOR })).toBeFalsy();
      expect(
        PixiProperty.shouldRemoveAttribute(type, name, new PIXI.Point(0, 0), { type: PixiProperty.VECTOR })
      ).toBeFalsy();
    });

    it("should return false otherwise", () => {
      expect(PixiProperty.shouldRemoveAttribute(type, name, "value", null)).toBeFalsy();
      expect(PixiProperty.shouldRemoveAttribute(type, name, 42, { type: PixiProperty.STRING })).toBeFalsy();
      expect(PixiProperty.shouldRemoveAttribute(type, name, "answer", { type: PixiProperty.STRING })).toBeFalsy();
    });
  });
});
