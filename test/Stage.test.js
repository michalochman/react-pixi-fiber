import React from "react";
import renderer from "react-test-renderer";
import * as PIXI from "pixi.js";
import { Text } from "../src/index";
import ReactPixiFiber from "../src/ReactPixiFiber";
import {
  appTestHook,
  createStageFunction,
  getCanvasProps,
  getDisplayObjectProps,
  includingCanvasProps,
  includingDisplayObjectProps,
  includingStageProps,
  validateCanvas,
} from "../src/Stage";
import { AppProvider } from "../src/AppProvider";
import { DEFAULT_PROPS, EVENT_PROPS } from "../src/props";

const Stage = createStageFunction();

jest.mock("../src/ReactPixiFiber", () => {
  return Object.assign({}, require.requireActual("../src/ReactPixiFiber"), {
    createContainer: jest.fn(),
    injectIntoDevTools: jest.fn(),
    updateContainer: jest.fn(),
  });
});

jest.mock("../src/render", () => {
  const render = jest.fn();
  const unmount = jest.fn();

  return {
    createRender: jest.fn().mockReturnValue(render),
    createUnmount: jest.fn().mockReturnValue(unmount),
    __renderMock: render,
    __unmounMock: unmount,
  };
});

describe("Stage (function)", () => {
  const { __renderMock, __unmounMock } = require("../src/render");

  it("renders canvas element", () => {
    const tree = renderer.create(<Stage />).toJSON();

    expect(tree).toHaveProperty("type", "canvas");
  });

  it("renders null if canvas is already passed in options", () => {
    const canvas = document.createElement("canvas");
    const options = { view: canvas };
    const tree = renderer.create(<Stage options={options} />).toJSON();

    expect(tree).toBeNull();
  });

  it("passes canvas props to rendered canvas element", () => {
    const className = "canvas";
    const id = "canvasApp";
    const style = { height: "100%", width: "100%" };
    const tree = renderer.create(<Stage className={className} id={id} style={style} options={{}} />).toJSON();

    expect(tree).toHaveProperty("type", "canvas");
    expect(tree.props).toEqual({
      className,
      id,
      style,
    });
  });

  it("does not pass stage props to rendered canvas element", () => {
    const style = { height: "100%", width: "100%" };
    const tree = renderer.create(<Stage height={600} style={style} width={800} />).toJSON();

    expect(tree).toHaveProperty("type", "canvas");
    expect(tree.props).not.toHaveProperty("height");
    expect(tree.props).not.toHaveProperty("width");
  });

  it("creates PIXI.Application instance with passed options", () => {
    const options = {
      backgroundColor: 0xff00ff,
      sharedTicker: true,
    };
    const height = 300;
    const width = 400;

    const element = renderer.create(<Stage height={height} width={width} options={options} />);

    expect(appTestHook instanceof PIXI.Application).toBeTruthy();
    expect(appTestHook.renderer.height).toEqual(height);
    expect(appTestHook.renderer.width).toEqual(width);
    expect(appTestHook.renderer.backgroundColor).toEqual(options.backgroundColor);
    expect(appTestHook.ticker).toEqual(PIXI.Ticker.shared);
  });

  it("creates PIXI.Application instance with 'height' and 'width' in options", () => {
    const options = {
      backgroundColor: 0xff00ff,
      height: 300,
      sharedTicker: true,
      width: 400,
    };

    const element = renderer.create(<Stage options={options} />);

    expect(appTestHook instanceof PIXI.Application).toBeTruthy();
    expect(appTestHook.renderer.height).toEqual(options.height);
    expect(appTestHook.renderer.width).toEqual(options.width);
    expect(appTestHook.renderer.backgroundColor).toEqual(options.backgroundColor);
    expect(appTestHook.ticker).toEqual(PIXI.Ticker.shared);
  });

  it("creates root Container", () => {
    const element = renderer.create(<Stage height={300} width={400} scale={2} position="40,20" />);
    const stage = appTestHook.stage;

    expect(stage instanceof PIXI.Container).toBeTruthy();
  });

  it("applies DisplayObject props to root Container", () => {
    const scale = 2;
    const x = 40;
    const y = 20;
    const element = renderer.create(<Stage height={300} position={`${x},${y}`} scale={scale} width={400} />);
    const stage = appTestHook.stage;

    expect(stage.position.x).toEqual(x);
    expect(stage.position.y).toEqual(y);
    expect(stage.scale.x).toEqual(scale);
    expect(stage.scale.y).toEqual(scale);
  });

  it("updates root Container DisplayObject props", () => {
    const scale = 2;
    const element = renderer.create(<Stage height={300} scale={scale} width={400} />);
    const stage = appTestHook.stage;

    expect(stage.scale.x).toEqual(scale);
    expect(stage.scale.y).toEqual(scale);

    const newScale = 1;
    element.update(<Stage height={300} scale={newScale} width={400} />);

    expect(stage.scale.x).toEqual(newScale);
    expect(stage.scale.y).toEqual(newScale);
  });

  it("resizes renderer when dimensions change", () => {
    const height = 300;
    const width = 400;
    const element = renderer.create(<Stage height={height} width={width} />);

    expect(appTestHook.renderer.height).toEqual(height);
    expect(appTestHook.renderer.width).toEqual(width);

    const newHeight = 600;
    const newWidth = 800;
    element.update(<Stage height={newHeight} width={newWidth} />);

    expect(appTestHook.renderer.height).toEqual(newHeight);
    expect(appTestHook.renderer.width).toEqual(newWidth);
  });

  it("can be unmounted", () => {
    const element = renderer.create(<Stage />);

    expect(() => element.unmount()).not.toThrow();
  });

  it("calls render on componentDidMount", () => {
    __renderMock.mockClear();
    const children = <Text text="Hello World!" />;
    const element = renderer.create(<Stage>{children}</Stage>);
    const stage = appTestHook.stage;

    expect(__renderMock).toHaveBeenCalledTimes(1);
    expect(__renderMock).toHaveBeenCalledWith(
      <AppProvider app={appTestHook}>{children}</AppProvider>,
      stage
    );
  });

  it("calls render on componentDidUpdate", () => {
    const children1 = <Text text="Hello World!" />;
    const element = renderer.create(<Stage>{children1}</Stage>);
    const stage = appTestHook.stage;

    __renderMock.mockClear();
    const children2 = <Text text="World Hello!" />;
    element.update(<Stage>{children2}</Stage>);

    expect(__renderMock).toHaveBeenCalledTimes(1);
    expect(__renderMock).toHaveBeenCalledWith(
      <AppProvider app={appTestHook}>{children2}</AppProvider>,
      stage
    );
  });

  it("calls unmount on componentWillUnmount", () => {
    const element = renderer.create(<Stage />);
    const { stage } = appTestHook;
    __unmounMock.mockClear();
    element.unmount();

    expect(__unmounMock).toHaveBeenCalledTimes(1);
    expect(__unmounMock).toHaveBeenCalledWith(stage);
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

describe("includingDisplayObjectProps", () => {
  it("returns true if prop is one of DisplayObject members", () => {
    Object.keys(DEFAULT_PROPS).forEach(propName => {
      expect(includingDisplayObjectProps(propName)).toBeTruthy();
    });
  });

  it("returns true if prop is one of DisplayObject events", () => {
    EVENT_PROPS.forEach(propName => {
      expect(includingDisplayObjectProps(propName)).toBeTruthy();
    });
  });

  it("returns false if prop is not one of DisplayObject members", () => {
    expect(includingDisplayObjectProps("className")).toBeFalsy();
    expect(includingDisplayObjectProps("style")).toBeFalsy();
    expect(includingDisplayObjectProps("width")).toBeFalsy();
  });
});

describe("includingStageProps", () => {
  it("returns true if prop is one of Stage props", () => {
    Object.keys(Stage.propTypes).forEach(propName => {
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
  it("returns true if prop is not one of DisplayObject members", () => {
    expect(includingCanvasProps("className")).toBeTruthy();
    expect(includingCanvasProps("id")).toBeTruthy();
    expect(includingCanvasProps("style")).toBeTruthy();
  });

  it("returns false if prop is one of DisplayObject members or Stage props", () => {
    Object.keys(DEFAULT_PROPS)
      .concat(Object.keys(Stage.propTypes))
      .forEach(propName => {
        expect(includingCanvasProps(propName)).toBeFalsy();
      });
  });
});

describe("getCanvasProps", () => {
  it("extracts <canvas /> related props from all props", () => {
    const allProps = {
      className: "canvas--responsive",
      height: 200,
      position: "100,0",
      scale: 2,
      style: {
        position: "relative",
      },
      width: 200,
    };
    const canvasProps = {
      className: allProps.className,
      style: allProps.style,
    };
    expect(getCanvasProps(allProps)).toEqual(canvasProps);
  });
});

describe("getDisplayObjectProps", () => {
  it("extracts DisplayObject related props from all props", () => {
    const allProps = {
      className: "canvas--responsive",
      height: 200,
      position: "100,0",
      scale: 2,
      style: {
        position: "relative",
      },
      width: 200,
    };
    const displayObjectProps = {
      position: allProps.position,
      scale: allProps.scale,
    };
    expect(getDisplayObjectProps(allProps)).toEqual(displayObjectProps);
  });
});
