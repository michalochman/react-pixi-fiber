import CustomPIXIComponent from "../src/CustomPIXIComponent";
import { injectType } from "../src/inject";

jest.mock("../src/inject");

describe("CustomPIXIComponent", () => {
  it("calls injectType", () => {
    const type = "INJECTED_TYPE";
    const customDisplayObject = jest.fn();
    CustomPIXIComponent(customDisplayObject, type);
    expect(injectType).toHaveBeenCalledTimes(1);
    expect(injectType).toHaveBeenCalledWith(type, customDisplayObject);
  });
  it("throws if type is not provided", () => {
    expect(() => CustomPIXIComponent(jest.fn())).toThrow();
  });
  it("throws if type is not a string", () => {
    const type = jest.fn();
    expect(() => CustomPIXIComponent(jest.fn(), type)).toThrow();
  });
});
