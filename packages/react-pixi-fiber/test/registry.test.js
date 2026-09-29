import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("registry", () => {
  let registry;
  let error;
  beforeEach(async () => {
    vi.resetModules();
    registry = await import("../src/registry");
    error = vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("accepts a bare function as create", () => {
    const create = vi.fn(() => ({}));
    registry.registerComponent("Thing", create);
    expect(registry.getUserComponent("Thing").create).toBe(create);
  });

  it("maps the 2.x behavior keys to the new keys and warns once per key in development", () => {
    const legacy = {
      customDisplayObject: vi.fn(() => ({})),
      customApplyProps: vi.fn(),
      customDidAttach: vi.fn(),
      customWillDetach: vi.fn(),
    };
    registry.registerComponent("Legacy", legacy);
    const behavior = registry.getUserComponent("Legacy");
    expect(behavior.create).toBe(legacy.customDisplayObject);
    expect(behavior.applyProps).toBe(legacy.customApplyProps);
    expect(behavior.afterAdd).toBe(legacy.customDidAttach);
    expect(behavior.beforeRemove).toBe(legacy.customWillDetach);
    registry.registerComponent("Legacy2", legacy);
    expect(error).toHaveBeenCalledTimes(__DEV__ ? 4 : 0);
    if (__DEV__) expect(error.mock.calls.map(c => c[0]).join("\n")).toMatch(/customDisplayObject.*create/s);
  });

  it("throws when the behavior has no create", () => {
    expect(() => registry.registerComponent("Broken", {})).toThrow("Broken");
  });

  it("binds applyProps with applyDisplayObjectProps in this, and keeps afterAdd/beforeRemove off the instance", () => {
    const apply = vi.fn();
    const behavior = {
      create: () => ({}),
      applyProps() {
        return this;
      },
      afterAdd: vi.fn(),
      beforeRemove: vi.fn(),
    };
    const instance = registry.createRegisteredInstance("T", registry.normalizeBehavior("T", behavior), { a: 1 }, apply);
    const bound = registry.getBoundBehavior(instance);
    const context = bound.applyProps(instance, { a: 1 }, { a: 2 });
    context.applyDisplayObjectProps({ a: 1 }, { a: 2 });
    expect(apply).toHaveBeenCalledWith("T", instance, { a: 1 }, { a: 2 });
    expect(bound.afterAdd).toBe(behavior.afterAdd);
    expect(bound.beforeRemove).toBe(behavior.beforeRemove);
    expect(bound.tag).toBe("T");
    expect(registry.getInstanceTag(instance)).toBe("T");
    expect(instance._customApplyProps).toBeUndefined();
  });
});
