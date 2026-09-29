import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import emptyFunction from "fbjs/lib/emptyFunction";
import warning from "fbjs/lib/warning";
import * as ReactPixiFiberUnknownPropertyHook from "../src/ReactPixiFiberUnknownPropertyHook";
import { isInjectedType } from "../src/inject";
import { shouldRemoveAttributeWithWarning } from "../src/PixiProperty";
import { TYPES } from "../src/tags";

vi.mock("fbjs/lib/emptyFunction", () => ({ default: vi.fn() }));
vi.mock("fbjs/lib/warning", () => ({ default: vi.fn() }));
vi.mock("../src/inject", async importOriginal => ({ ...(await importOriginal()), isInjectedType: vi.fn() }));
vi.mock("../src/PixiProperty", async importOriginal => ({
  ...(await importOriginal()),
  getPropertyInfo: vi.fn(() => null),
  getCustomPropertyInfo: vi.fn(() => null),
  shouldRemoveAttributeWithWarning: vi.fn(() => false),
}));
vi.mock("../src/ReactGlobalSharedState", async importOriginal => ({
  ...(await importOriginal()),
  getStackAddendum: () => "stack",
}));

describe("ReactPixiFiberUnknownPropertyHook", () => {
  describe("validateProperty", () => {
    const type = "type";
    const stack = "stack";

    afterEach(() => {
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

    afterEach(() => {
      isInjectedType.mockReset();
      warning.mockReset();
    });

    it("should not call warnUnknownProperties for injected types", () => {
      const strictRoot = null;
      isInjectedType.mockImplementation(() => true);
      ReactPixiFiberUnknownPropertyHook.validateProperties(type, props, strictRoot);

      // warnUnknownProperties is internal to the module, it would have warned about `position`
      expect(warning).toHaveBeenCalledTimes(0);
    });
  });

  describe("warnUnknownProperties", () => {
    const type = TYPES.SPRITE;
    const props = { position: "0,0", scale: 2 };
    const stack = "stack";

    // validateProperty is internal to the module and remembers which props it warned about, so every test
    // gets a fresh module. Its result is controlled through what it depends on: in development the props are
    // known Sprite properties and shouldRemoveAttributeWithWarning decides if they are valid, in production
    // it is fbjs emptyFunction, mocked above.
    let warnUnknownProperties;
    const mockValidateProperty = isValid => {
      if (__DEV__) {
        shouldRemoveAttributeWithWarning.mockImplementation((type, name) => !isValid(name));
      } else {
        emptyFunction.mockImplementation((type, name) => isValid(name));
      }
    };

    beforeEach(async () => {
      vi.resetModules();
      ({ warnUnknownProperties } = await import("../src/ReactPixiFiberUnknownPropertyHook"));
    });

    afterEach(() => {
      emptyFunction.mockReset();
      shouldRemoveAttributeWithWarning.mockReset();
      warning.mockReset();
    });

    it("should not warn is props are valid", () => {
      mockValidateProperty(() => true);
      warnUnknownProperties(type, props);

      expect(warning).toHaveBeenCalledTimes(0);
    });

    it("should warn if one prop is not valid", () => {
      mockValidateProperty(name => name === "position");
      warnUnknownProperties(type, props);

      expect(warning).toHaveBeenCalledTimes(1);
      expect(warning).toHaveBeenCalledWith(false, "Invalid value for prop %s on `<%s />`.%s", "`scale`", type, stack);
    });

    it("should warn if more than one prop is not valid", () => {
      mockValidateProperty(() => false);
      warnUnknownProperties(type, props);

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
