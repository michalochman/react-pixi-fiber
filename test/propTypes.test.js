import React from "react";
import { validateApp, validateCanvas } from "../src/propTypes";
import { __RewireAPI__ as PropTypesRewireAPI } from "../src/propTypes";
import * as PIXI from "pixi.js";

describe("validateApp", () => {
  const warning = jest.fn();

  beforeAll(() => {
    PropTypesRewireAPI.__Rewire__("warning", warning);
  });

  afterAll(() => {
    PropTypesRewireAPI.__ResetDependency__("warning");
  });

  afterEach(() => {
    warning.mockReset();
  });

  it("passes validation if prop is not defined", () => {
    const props = {};
    const propName = "app";
    const componentName = "Component";
    expect(validateApp(props, propName, componentName)).toBeUndefined();
  });

  it("passes validation if propName is PIXI.Application instance", () => {
    const props = { app: new PIXI.Application() };
    const propName = "app";
    const componentName = "Component";
    expect(validateApp(props, propName, componentName)).toBeUndefined();
  });

  it("should warn about options prop if both options and app are defined", () => {
    const props = { app: new PIXI.Application(), options: { width: 800 } };
    const propName = "app";
    const componentName = "Component";
    expect(validateApp(props, propName, componentName)).toBeUndefined();

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning).toHaveBeenCalledWith(
      false,
      "'options' property of 'Component' has no effect when 'app' property is provided. Only use 'app' or 'options', never both."
    );
  });

  it("does not pass validation if propName is defined and is not PIXI.Application instance", () => {
    const props = { app: {} };
    const propName = "app";
    const propType = typeof props.app;
    const componentName = "Component";
    const error = `Invalid prop '${propName}' of type '${propType}' supplied to '${componentName}', expected 'PIXI.Application'.`;
    expect(() => {
      throw validateApp(props, propName, componentName);
    }).toThrow(error);
  });
});

describe("validateCanvas", () => {
  it("passes validation if prop is not defined", () => {
    const props = {};
    const propName = "view";
    const componentName = "Component";
    expect(validateCanvas(props, propName, componentName)).toBeUndefined();
  });

  it("passes validation if propName is <canvas /> element", () => {
    const props = { view: document.createElement("canvas") };
    const propName = "view";
    const componentName = "Component";
    expect(validateCanvas(props, propName, componentName)).toBeUndefined();
  });

  it("does not pass validation if propName is defined and is not <canvas /> element", () => {
    const props = { view: document.createElement("p") };
    const propName = "view";
    const propType = typeof props.view;
    const componentName = "Component";
    const error = `Invalid prop '${propName}' of type '${propType}' supplied to '${componentName}', expected '<canvas> Element'.`;
    expect(() => {
      throw validateCanvas(props, propName, componentName);
    }).toThrow(error);
  });
});
