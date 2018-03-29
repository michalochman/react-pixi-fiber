import emptyFunction from "fbjs/lib/emptyFunction";
import * as ReactPixiFiberUnknownPropertyHook from "../src/ReactPixiFiberUnknownPropertyHook";
import { __RewireAPI__ as ReactPixiFiberUnknownPropertyHookRewireAPI } from "../src/ReactPixiFiberUnknownPropertyHook";

describe("ReactPixiFiberUnknownPropertyHook", () => {
  describe("validateProperty", () => {
    const type = "type";
    const stack = "stack";
    const getPropertyInfo = jest.fn();
    const validateProperty = jest.fn();
    const shouldRemoveAttributeWithWarning = jest.fn();
    const warning = jest.fn();

    beforeAll(() => {
      ReactPixiFiberUnknownPropertyHookRewireAPI.__Rewire__("getPropertyInfo", () => getPropertyInfo);
      ReactPixiFiberUnknownPropertyHookRewireAPI.__Rewire__("getStackAddendum", () => stack);
      ReactPixiFiberUnknownPropertyHookRewireAPI.__Rewire__(
        "shouldRemoveAttributeWithWarning",
        shouldRemoveAttributeWithWarning
      );
      ReactPixiFiberUnknownPropertyHookRewireAPI.__Rewire__("warning", warning);
    });

    afterAll(() => {
      ReactPixiFiberUnknownPropertyHookRewireAPI.__ResetDependency__("getPropertyInfo");
      ReactPixiFiberUnknownPropertyHookRewireAPI.__ResetDependency__("getStackAddendum");
      ReactPixiFiberUnknownPropertyHookRewireAPI.__ResetDependency__("shouldRemoveAttributeWithWarning");
      ReactPixiFiberUnknownPropertyHookRewireAPI.__ResetDependency__("warning");
    });

    afterEach(() => {
      validateProperty.mockReset();
      warning.mockReset();
    });

    it("should be defined in development", () => {
      if (__DEV__) {
        expect(ReactPixiFiberUnknownPropertyHook.validateProperty).not.toEqual(emptyFunction);
      } else {
        expect(ReactPixiFiberUnknownPropertyHook.validateProperty).toEqual(emptyFunction);
      }
    });

    it("should warn about properties starting with `on` in development", () => {
      const name = "onTest";
      ReactPixiFiberUnknownPropertyHook.validateProperty(type, name, () => {});

      if (__DEV__) {
        expect(warning).toHaveBeenCalledTimes(1);
        expect(warning).toHaveBeenCalledWith(
          false,
          "Invalid event handler prop `%s` on `<%s />`. PIXI events use other naming convention, for example `click`.%s",
          name,
          type,
          stack
        );
      } else {
        expect(warning).toHaveBeenCalledTimes(0);
      }
    });

    it("should warn about NaNs in development", () => {
      const name = "someValue";
      ReactPixiFiberUnknownPropertyHook.validateProperty(type, name, NaN);

      if (__DEV__) {
        expect(warning).toHaveBeenCalledTimes(1);
        expect(warning).toHaveBeenCalledWith(
          false,
          "Received NaN for prop `%s` on `<%s />`. If this is expected, cast the value to a string.%s",
          name,
          type,
          stack
        );
      } else {
        expect(warning).toHaveBeenCalledTimes(0);
      }
    });

    it.skip("should warn about invalid prop casing", () => {});

    it.skip("should warn about unknown properties if they are not reserved", () => {});

    it.skip("should assume that values for reserved properties are valid", () => {});

    it.skip("should not warn again if shouldRemoveAttributeWithWarning returns true", () => {});

    it.skip("should assume property value is valid otherwise", () => {});
  });

  describe("validateProperties", () => {
    const type = "type";
    const props = { position: "0,0" };
    const isInjectedType = jest.fn();
    const warnUnknownProperties = jest.fn();

    beforeAll(() => {
      ReactPixiFiberUnknownPropertyHookRewireAPI.__Rewire__("isInjectedType", isInjectedType);
      ReactPixiFiberUnknownPropertyHookRewireAPI.__Rewire__("warnUnknownProperties", warnUnknownProperties);
    });

    afterAll(() => {
      ReactPixiFiberUnknownPropertyHookRewireAPI.__ResetDependency__("isInjectedType");
      ReactPixiFiberUnknownPropertyHookRewireAPI.__ResetDependency__("warnUnknownProperties");
    });

    afterEach(() => {
      isInjectedType.mockReset();
      warnUnknownProperties.mockReset();
    });

    it("should not call warnUnknownProperties for injected types", () => {
      isInjectedType.mockImplementation(() => true);
      ReactPixiFiberUnknownPropertyHook.validateProperties(type, props);

      expect(warnUnknownProperties).toHaveBeenCalledTimes(0);
    });

    it("should not call warnUnknownProperties for regular types", () => {
      isInjectedType.mockImplementation(() => false);
      ReactPixiFiberUnknownPropertyHook.validateProperties(type, props);

      expect(warnUnknownProperties).toHaveBeenCalledTimes(1);
      expect(warnUnknownProperties).toHaveBeenCalledWith(type, props);
    });
  });

  describe("warnUnknownProperties", () => {
    const type = "type";
    const props = { position: "0,0", scale: 2 };
    const stack = "stack";
    const validateProperty = jest.fn();
    const warning = jest.fn();

    beforeAll(() => {
      ReactPixiFiberUnknownPropertyHookRewireAPI.__Rewire__("getStackAddendum", () => stack);
      ReactPixiFiberUnknownPropertyHookRewireAPI.__Rewire__("validateProperty", validateProperty);
      ReactPixiFiberUnknownPropertyHookRewireAPI.__Rewire__("warning", warning);
    });

    afterAll(() => {
      ReactPixiFiberUnknownPropertyHookRewireAPI.__ResetDependency__("getStackAddendum");
      ReactPixiFiberUnknownPropertyHookRewireAPI.__ResetDependency__("validateProperty");
      ReactPixiFiberUnknownPropertyHookRewireAPI.__ResetDependency__("warning");
    });

    afterEach(() => {
      validateProperty.mockReset();
      warning.mockReset();
    });

    it("should not warn is props are valid", () => {
      validateProperty.mockImplementation(() => true);
      ReactPixiFiberUnknownPropertyHook.warnUnknownProperties(type, props);

      expect(warning).toHaveBeenCalledTimes(0);
    });

    it("should warn if one prop is not valid", () => {
      validateProperty.mockImplementationOnce(() => true).mockImplementationOnce(() => false);
      ReactPixiFiberUnknownPropertyHook.warnUnknownProperties(type, props);

      expect(warning).toHaveBeenCalledTimes(1);
      expect(warning).toHaveBeenCalledWith(false, "Invalid value for prop %s on `<%s />`.%s", "`scale`", type, stack);
    });

    it("should warn if more than one prop is not valid", () => {
      validateProperty.mockImplementation(() => false);
      ReactPixiFiberUnknownPropertyHook.warnUnknownProperties(type, props);

      expect(warning).toHaveBeenCalledTimes(1);
      expect(warning).toHaveBeenCalledWith(
        false,
        "Invalid values for props %s on `<%s />`.%s",
        "`position`, `scale`",
        type,
        stack
      );
    });
  });
});
