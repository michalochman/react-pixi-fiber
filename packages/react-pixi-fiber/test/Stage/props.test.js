import { describe, it, expect } from "vitest";
import {
  STAGE_PROP_NAMES,
  getCanvasProps,
  getContainerProps,
  includingCanvasProps,
  includingContainerProps,
  includingStageProps,
} from "../../src/Stage/props";
import possibleStandardNames from "../../src/possibleStandardNames";
import { TYPES } from "../../src/tags";

describe("includingContainerProps", () => {
  it("returns true if prop is one of Container members", () => {
    Object.keys(possibleStandardNames[TYPES.CONTAINER]).forEach(propName => {
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
  it("returns true if prop is one of Stage props", () => {
    STAGE_PROP_NAMES.forEach(propName => {
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
  it("returns true if prop is not one of Container members", () => {
    expect(includingCanvasProps("className")).toBeTruthy();
    expect(includingCanvasProps("id")).toBeTruthy();
    expect(includingCanvasProps("style")).toBeTruthy();
  });

  it("returns false if prop is one of Container members or Stage props", () => {
    Object.keys(possibleStandardNames[TYPES.CONTAINER])
      .concat(STAGE_PROP_NAMES)
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

  it("does not forward Stage's own props to the canvas", () => {
    const props = { app: {}, options: {}, children: null, onInit: () => {}, width: 1, height: 2, className: "c" };
    expect(getCanvasProps(props)).toEqual({ className: "c" });
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
