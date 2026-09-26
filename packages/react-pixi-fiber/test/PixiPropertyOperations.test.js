import * as PixiPropertyOperations from "../src/PixiPropertyOperations";
import { __RewireAPI__ as PixiPropertyOperationsRewireAPI } from "../src/PixiPropertyOperations";

describe("PixiPropertyOperations", () => {
  describe("setValueForProperty", () => {
    const instance = {};
    const setPixiValue = jest.fn();
    const shouldIgnoreAttribute = jest.fn(() => false);
    const shouldRemoveAttribute = jest.fn(() => false);

    beforeAll(() => {
      PixiPropertyOperationsRewireAPI.__Rewire__("setPixiValue", setPixiValue);
      PixiPropertyOperationsRewireAPI.__Rewire__("shouldIgnoreAttribute", shouldIgnoreAttribute);
      PixiPropertyOperationsRewireAPI.__Rewire__("shouldRemoveAttribute", shouldRemoveAttribute);
    });

    afterAll(() => {
      PixiPropertyOperationsRewireAPI.__ResetDependency__("setPixiValue");
      PixiPropertyOperationsRewireAPI.__ResetDependency__("shouldIgnoreAttribute");
      PixiPropertyOperationsRewireAPI.__ResetDependency__("shouldRemoveAttribute");
    });

    afterEach(() => {
      setPixiValue.mockReset();
      shouldIgnoreAttribute.mockReset();
      shouldRemoveAttribute.mockReset();
    });

    it("should not call setPixiValue if property should be ignored", () => {
      shouldIgnoreAttribute.mockImplementation(() => true);
      PixiPropertyOperations.setValueForProperty("Sprite", instance, "ignoredProp", "unsetValue");
      expect(setPixiValue).toHaveBeenCalledTimes(0);
    });

    it("should call setPixiValue with default value if property should be removed and default is available", () => {
      const type = "Sprite";
      const propName = "roundPixels";
      shouldRemoveAttribute.mockImplementation(() => true);
      PixiPropertyOperations.setValueForProperty(type, instance, propName, undefined);
      expect(setPixiValue).toHaveBeenCalledTimes(1);
      expect(setPixiValue).toHaveBeenCalledWith(instance, propName, false);
    });

    it("should not call setPixiValue if property should be removed and default is not available", () => {
      const type = "Sprite";
      const propName = "unknownProp";
      shouldRemoveAttribute.mockImplementation(() => true);
      PixiPropertyOperations.setValueForProperty(type, instance, propName, undefined);
      expect(setPixiValue).toHaveBeenCalledTimes(0);
    });

    it("should not call setPixiValue if property should be removed and defaults are not available", () => {
      const type = "UnknownType";
      const propName = "unknownProp";
      shouldRemoveAttribute.mockImplementation(() => true);
      PixiPropertyOperations.setValueForProperty(type, instance, propName, undefined);
      expect(setPixiValue).toHaveBeenCalledTimes(0);
    });

    it("should call setPixiValue with provided value if property should not be removed", () => {
      const type = "Sprite";
      const propName = "roundPixels";
      PixiPropertyOperations.setValueForProperty(type, instance, propName, true);
      expect(setPixiValue).toHaveBeenCalledTimes(1);
      expect(setPixiValue).toHaveBeenCalledWith(instance, propName, true);
    });
  });
});
