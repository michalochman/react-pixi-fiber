import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import * as PIXI from "pixi.js";
import { Text } from "../src/index";
import {
  createStageFunction,
  createStageClass,
} from "../src/Stage";
import {
  getCanvasProps,
  getDisplayObjectProps,
  includingCanvasProps,
  includingDisplayObjectProps,
  includingStageProps,
  validateCanvas,
} from "../src/stageProps";
import { AppProvider } from "../src/AppProvider";
import { DEFAULT_PROPS, EVENT_PROPS } from "../src/props";
import { __RewireAPI__ as HooksRewireAPI } from "../src/hooks";
import { __RewireAPI__ as StageRewireAPI } from "../src/Stage";

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
  const StageFunction = createStageFunction();
  let app;
  const createPixiApplication = jest.fn(options => {
    app = new PIXI.Application(options);
    return app;
  });
  const resizeRenderer = jest.fn();

  beforeEach(() => {
    HooksRewireAPI.__Rewire__("createPixiApplication", createPixiApplication);
    createPixiApplication.mockClear();
    __renderMock.mockClear();
    __unmounMock.mockClear();
  });

  afterEach(() => {
    HooksRewireAPI.__ResetDependency__("createPixiApplication");
  });

  it("renders canvas element", () => {
    const tree = renderer.create(<StageFunction />).toJSON();

    expect(tree).toHaveProperty("type", "canvas");
  });

  it("renders null if canvas is already passed in options", () => {
    const canvas = document.createElement("canvas");
    const options = { view: canvas };
    const tree = renderer.create(<StageFunction options={options} />).toJSON();

    expect(tree).toBeNull();
  });

  it("passes canvas props to rendered canvas element", () => {
    const className = "canvas";
    const id = "canvasApp";
    const style = { height: "100%", width: "100%" };
    const tree = renderer.create(<StageFunction className={className} id={id} style={style} options={{}} />).toJSON();

    expect(tree).toHaveProperty("type", "canvas");
    expect(tree.props).toEqual({
      className,
      id,
      style,
    });
  });

  it("does not pass stage props to rendered canvas element", () => {
    const style = { height: "100%", width: "100%" };
    const tree = renderer.create(<StageFunction height={600} style={style} width={800} />).toJSON();

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

    renderer.create(<StageFunction height={height} width={width} options={options} />);

    expect(createPixiApplication).toHaveBeenCalledTimes(1);
    // FIXME
    expect(createPixiApplication).toHaveBeenCalledWith({ height, width, view: null, ...options });
  });

  it("creates PIXI.Application instance with 'height' and 'width' in options", () => {
    const options = {
      backgroundColor: 0xff00ff,
      height: 300,
      sharedTicker: true,
      width: 400,
    };

    renderer.create(<StageFunction options={options} />);
    expect(createPixiApplication).toHaveBeenCalledTimes(1);
    // FIXME
    expect(createPixiApplication).toHaveBeenCalledWith({ view: null, ...options });
  });

  it("creates root Container", () => {
    const app = new PIXI.Application({});
    renderer.create(<StageFunction height={300} width={400} scale={2} position="40,20" />);
    const { stage } = app;

    expect(stage instanceof PIXI.Container).toBeTruthy();
  });

  it("applies DisplayObject props to root Container", () => {
    const scale = 2;
    const x = 40;
    const y = 20;
    renderer.create(<StageFunction height={300} position={`${x},${y}`} scale={scale} width={400} />);
    const { stage } = app;

    expect(stage.position.x).toEqual(x);
    expect(stage.position.y).toEqual(y);
    expect(stage.scale.x).toEqual(scale);
    expect(stage.scale.y).toEqual(scale);
  });

  it("updates root Container DisplayObject props", () => {
    const scale = 2;
    const element = renderer.create(<StageFunction height={300} scale={scale} width={400} />);
    const { stage } = app;

    expect(stage.scale.x).toEqual(scale);
    expect(stage.scale.y).toEqual(scale);

    const newScale = 1;
    element.update(<StageFunction height={300} scale={newScale} width={400} />);

    expect(stage.scale.x).toEqual(newScale);
    expect(stage.scale.y).toEqual(newScale);
  });

  it("resizes renderer when dimensions change", () => {
    const height = 300;
    const width = 400;
    const element = renderer.create(<StageFunction height={height} width={width} />);

    expect(app.renderer.height).toEqual(height);
    expect(app.renderer.width).toEqual(width);

    const newHeight = 600;
    const newWidth = 800;
    element.update(<StageFunction height={newHeight} width={newWidth} />);
  });

  it("does not call resize renderer if app is provided", () => {
    StageRewireAPI.__Rewire__("resizeRenderer", resizeRenderer);
    const app = new PIXI.Application({});
    const element = renderer.create(<StageFunction app={app} height={300} width={300} />);

    element.update(<StageFunction app={app} height={300} width={300} />);
    StageRewireAPI.__ResetDependency__("resizeRenderer");

    expect(resizeRenderer).toHaveBeenCalledTimes(0);
  });

  it("can be unmounted", () => {
    const element = renderer.create(<StageFunction />);

    expect(() => element.unmount()).not.toThrow();
  });

  it("calls render on componentDidMount", () => {
    const children = <Text text="Hello World!" />;
    renderer.create(<StageFunction>{children}</StageFunction>);

    expect(__renderMock).toHaveBeenCalledTimes(1);
    expect(__renderMock).toHaveBeenCalledWith(<AppProvider app={app}>{children}</AppProvider>, app.stage);
  });

  it("calls render on componentDidUpdate", () => {
    const children1 = <Text text="Hello World!" />;
    const element = renderer.create(<StageFunction>{children1}</StageFunction>);
    __renderMock.mockClear();

    const children2 = <Text text="World Hello!" />;
    element.update(<StageFunction>{children2}</StageFunction>);

    expect(__renderMock).toHaveBeenCalledTimes(1);
    expect(__renderMock).toHaveBeenCalledWith(<AppProvider app={app}>{children2}</AppProvider>, app.stage);
  });

  it("calls unmount on componentWillUnmount", () => {
    const element = renderer.create(<StageFunction />);
    const { stage } = app;
    element.unmount();

    expect(__unmounMock).toHaveBeenCalledTimes(1);
    expect(__unmounMock).toHaveBeenCalledWith(stage);
  });
});

describe("Stage (class)", () => {
  const { __renderMock, __unmounMock } = require("../src/render");
  const StageClass = createStageClass();
  let app;
  const createPixiApplication = jest.fn(options => {
    app = new PIXI.Application(options);
    return app;
  });
  const resizeRenderer = jest.fn();

  beforeEach(() => {
    StageRewireAPI.__Rewire__("createPixiApplication", createPixiApplication);
    createPixiApplication.mockClear();
    __renderMock.mockClear();
    __unmounMock.mockClear();
  });

  afterEach(() => {
    StageRewireAPI.__ResetDependency__("createPixiApplication");
  });

  it("renders canvas element", () => {
    const tree = renderer.create(<StageClass />).toJSON();

    expect(tree).toHaveProperty("type", "canvas");
  });

  it("renders null if canvas is already passed in options", () => {
    const canvas = document.createElement("canvas");
    const options = { view: canvas };
    const tree = renderer.create(<StageClass options={options} />).toJSON();

    expect(tree).toBeNull();
  });

  it("passes canvas props to rendered canvas element", () => {
    const className = "canvas";
    const id = "canvasApp";
    const style = { height: "100%", width: "100%" };
    const tree = renderer.create(<StageClass className={className} id={id} style={style} options={{}} />).toJSON();

    expect(tree).toHaveProperty("type", "canvas");
    expect(tree.props).toEqual({
      className,
      id,
      style,
    });
  });

  it("does not pass stage props to rendered canvas element", () => {
    const style = { height: "100%", width: "100%" };
    const tree = renderer.create(<StageClass height={600} style={style} width={800} />).toJSON();

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

    const element = renderer.create(<StageClass height={height} width={width} options={options} />);
    const instance = element.getInstance();
    const app = instance._app;

    expect(app instanceof PIXI.Application).toBeTruthy();
    expect(app.renderer.options).toMatchObject({
      height,
      width,
      ...options,
    });
  });

  it("creates PIXI.Application instance with 'height' and 'width' in options", () => {
    const options = {
      backgroundColor: 0xff00ff,
      height: 300,
      sharedTicker: true,
      width: 400,
    };

    let stage;
    ReactDOM.render(<StageClass options={options} ref={c => (stage = c)} />, document.createElement("div"));

    expect(createPixiApplication).toHaveBeenCalledWith({ view: stage._canvas, ...options });
  });

  it("creates PIXI.Application instance with 'view' in options", () => {
    const canvas = document.createElement("canvas");
    const options = {
      view: canvas,
    };

    ReactDOM.render(<StageClass options={options} />, document.createElement("div"));

    expect(createPixiApplication).toHaveBeenCalledWith(options);
  });

  it("creates root Container", () => {
    let stage;
    renderer.create(<StageClass height={300} width={400} scale={2} position="40,20" ref={c => (stage = c)} />);

    expect(stage._app.stage instanceof PIXI.Container).toBeTruthy();
  });

  it("applies DisplayObject props to root Container", () => {
    const scale = 2;
    const x = 40;
    const y = 20;
    const element = renderer.create(<StageClass height={300} position={`${x},${y}`} scale={scale} width={400} />);
    const instance = element.getInstance();
    const app = instance._app;
    const stage = app.stage;

    expect(stage.position.x).toEqual(x);
    expect(stage.position.y).toEqual(y);
    expect(stage.scale.x).toEqual(scale);
    expect(stage.scale.y).toEqual(scale);
  });

  it("updates root Container DisplayObject props", () => {
    const scale = 2;
    const element = renderer.create(<StageClass height={300} scale={scale} width={400} />);
    const instance = element.getInstance();
    const app = instance._app;
    const stage = app.stage;

    expect(stage.scale.x).toEqual(scale);
    expect(stage.scale.y).toEqual(scale);

    const newScale = 1;
    element.update(<StageClass height={300} scale={newScale} width={400} />);

    expect(stage.scale.x).toEqual(newScale);
    expect(stage.scale.y).toEqual(newScale);
  });

  it("resizes renderer when dimensions change", () => {
    const height = 300;
    const width = 400;
    const element = renderer.create(<StageClass height={height} width={width} />);
    const instance = element.getInstance();
    const app = instance._app;

    expect(app.renderer.height).toEqual(height);
    expect(app.renderer.width).toEqual(width);

    const newHeight = 600;
    const newWidth = 800;
    element.update(<StageClass height={newHeight} width={newWidth} />);

    expect(app.renderer.height).toEqual(newHeight);
    expect(app.renderer.width).toEqual(newWidth);
  });

  it("does not call resize renderer if app is provided", () => {
    StageRewireAPI.__Rewire__("resizeRenderer", resizeRenderer);
    const app = new PIXI.Application({});
    const element = renderer.create(<StageClass app={app} height={300} width={300} />);

    element.update(<StageClass app={app} height={300} width={300} />);
    StageRewireAPI.__ResetDependency__("resizeRenderer");

    expect(resizeRenderer).toHaveBeenCalledTimes(0);
  });

  it("can be umounted", () => {
    const element = renderer.create(<StageClass />);

    expect(() => element.unmount()).not.toThrow();
  });

  it("calls render on componentDidMount", () => {
    const children = <Text text="Hello World!" />;
    const element = renderer.create(<StageClass>{children}</StageClass>);
    const instance = element.getInstance();
    const stage = instance._app.stage;

    expect(__renderMock).toHaveBeenCalledTimes(1);
    expect(__renderMock).toHaveBeenCalledWith(
      <AppProvider app={instance._app}>{children}</AppProvider>,
      stage,
      undefined,
      instance
    );
  });

  it("calls render on componentDidUpdate", () => {
    const children1 = <Text text="Hello World!" />;
    const element = renderer.create(<StageClass>{children1}</StageClass>);
    const instance = element.getInstance();
    const stage = instance._app.stage;

    __renderMock.mockClear();
    const children2 = <Text text="World Hello!" />;
    element.update(<StageClass>{children2}</StageClass>);

    expect(__renderMock).toHaveBeenCalledTimes(1);
    expect(__renderMock).toHaveBeenCalledWith(
      <AppProvider app={instance._app}>{children2}</AppProvider>,
      stage,
      undefined,
      instance
    );
  });

  it("calls unmount on componentWillUnmount", () => {
    const element = renderer.create(<StageClass />);
    const instance = element.getInstance();
    const stage = instance._app.stage;
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

  it("returns true if prop is not one of DisplayObject members", () => {
    expect(includingCanvasProps("className")).toBeTruthy();
    expect(includingCanvasProps("id")).toBeTruthy();
    expect(includingCanvasProps("style")).toBeTruthy();
  });

  it("returns false if prop is one of DisplayObject members or Stage props", () => {
    Object.keys(DEFAULT_PROPS)
      .concat(Object.keys(StageFunction.propTypes))
      .forEach(propName => {
        expect(includingCanvasProps(propName)).toBeFalsy();
      });

    Object.keys(DEFAULT_PROPS)
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
