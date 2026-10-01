import { describe, it, expect, vi } from "vitest";
import CustomPIXIComponent from "../src/CustomPIXIComponent";
import { injectType } from "../src/inject";

vi.mock("../src/inject");

describe("CustomPIXIComponent", () => {
  it("calls injectType", () => {
    const type = "INJECTED_TYPE";
    const customDisplayObject = vi.fn();
    CustomPIXIComponent(customDisplayObject, type);
    expect(injectType).toHaveBeenCalledTimes(1);
    expect(injectType).toHaveBeenCalledWith(type, customDisplayObject);
  });
  it("throws if type is not provided", () => {
    expect(() => CustomPIXIComponent(vi.fn())).toThrow();
  });
  it("throws if type is not a string", () => {
    const type = vi.fn();
    expect(() => CustomPIXIComponent(vi.fn(), type)).toThrow();
  });
});
