import React from "react";
import { createStageFunction, createStageClass } from "../../src/Stage";
import {
  getCanvasProps,
  getContainerProps,
  includingCanvasProps,
  includingContainerProps,
  includingStageProps,
  validateCanvas,
} from "../../src/Stage/propTypes";
import possibleStandardNames from "../../src/possibleStandardNames";
import { EVENT_PROPS } from "../../src/props";
import { TYPES } from "../../src/types";

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

describe("includingContainerProps", () => {
  it("returns true if prop is one of Container members", () => {
    Object.keys(possibleStandardNames[TYPES.CONTAINER]).forEach(propName => {
      expect(includingContainerProps(propName)).toBeTruthy();
    });
  });

  it("returns true if prop is one of Container events", () => {
    EVENT_PROPS.forEach(propName => {
      expect(includingContainerProps(propName)).toBeTruthy();
    });
  });

  it("returns false if prop is not one of Container members", () => {
    expect(includingContainerProps("className")).toBeFalsy();
    expect(includingContainerProps("style")).toBeFalsy();
    expect(includingContainerProps("options")).toBeFalsy();
  });
});

describe("includingStageProps", () => {
  const StageClass = createStageClass();
  const StageFunction = createStageFunction();

  it("returns true if prop is one of Stage props", () => {
    Object.keys(StageFunction.propTypes).forEach(propName => {
      expect(includingStageProps(propName)).toBeTruthy();
    });

    Object.keys(StageClass.propTypes).forEach(propName => {
      expect(includingStageProps(propName)).toBeTruthy();
    });
  });

  it("returns false if prop is not one of Stage props", () => {
    expect(includingStageProps("className")).toBeFalsy();
    expect(includingStageProps("position")).toBeFalsy();
    expect(includingStageProps("style")).toBeFalsy();
  });
});

describe("includingCanvasProps", () => {
  const StageClass = createStageClass();
  const StageFunction = createStageFunction();

  it("returns true if prop is not one of Container members", () => {
    expect(includingCanvasProps("className")).toBeTruthy();
    expect(includingCanvasProps("id")).toBeTruthy();
    expect(includingCanvasProps("style")).toBeTruthy();
  });

  it("returns false if prop is one of Container members or Stage props", () => {
    Object.keys(possibleStandardNames[TYPES.CONTAINER])
      .concat(Object.keys(StageFunction.propTypes))
      .forEach(propName => {
        expect(includingCanvasProps(propName)).toBeFalsy();
      });

    Object.keys(possibleStandardNames[TYPES.CONTAINER])
      .concat(Object.keys(StageClass.propTypes))
      .forEach(propName => {
        expect(includingCanvasProps(propName)).toBeFalsy();
      });
  });
});

describe("getCanvasProps", () => {
  it("extracts <canvas /> related props from all props", () => {
    const allProps = {
      className: "canvas--responsive",
      options: {
        height: 200,
        width: 200,
      },
      position: "100,0",
      scale: 2,
      style: {
        position: "relative",
      },
    };
    const canvasProps = {
      className: allProps.className,
      style: allProps.style,
    };
    expect(getCanvasProps(allProps)).toEqual(canvasProps);
  });
});

describe("getContainerProps", () => {
  it("extracts Container related props from all props", () => {
    const allProps = {
      className: "canvas--responsive",
      options: {
        height: 200,
        width: 200,
      },
      position: "100,0",
      scale: 2,
      style: {
        position: "relative",
      },
    };
    const containerProps = {
      position: allProps.position,
      scale: allProps.scale,
    };
    expect(getContainerProps(allProps)).toEqual(containerProps);
  });
});
