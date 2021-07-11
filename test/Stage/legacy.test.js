import React from "react";
import renderer from "react-test-renderer";
import * as PIXI from "pixi.js";
import { Text } from "../../src";
import { AppProvider } from "../../src/AppProvider";
import { createStageClass } from "../../src/Stage";
import { __RewireAPI__ as StageRewireAPI } from "../../src/Stage/legacy";

jest.mock("../../src/ReactPixiFiber", () => {
  return Object.assign({}, jest.requireActual("../../src/ReactPixiFiber"), {
    createContainer: jest.fn(),
    injectIntoDevTools: jest.fn(),
    updateContainer: jest.fn(),
  });
});

jest.mock("../../src/render", () => {
  const render = jest.fn();
  const unmount = jest.fn();

  return {
    createRender: jest.fn().mockReturnValue(render),
    createUnmount: jest.fn().mockReturnValue(unmount),
    __renderMock: render,
    __unmounMock: unmount,
  };
});

describe("Stage (class)", () => {
  const { __renderMock, __unmounMock } = require("../../src/render");
  const Stage = createStageClass();
  let app;
  const createPixiApplication = jest.fn(options => {
    app = new PIXI.Application(options);
    return app;
  });

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
    const tree = renderer.create(<Stage options={{ height: 600, width: 800 }} style={style} />).toJSON();

    expect(tree).toHaveProperty("type", "canvas");
    expect(tree.props).not.toHaveProperty("height");
    expect(tree.props).not.toHaveProperty("width");
  });

  it("creates PIXI.Application instance with passed options", () => {
    const options = {
      backgroundColor: 0xff00ff,
      height: 300,
      sharedTicker: true,
      width: 400,
    };

    let stage;
    const element = renderer.create(<Stage options={options} ref={c => (stage = c)} />);
    const instance = element.getInstance();
    const app = instance._app.current;

    expect(app instanceof PIXI.Application).toBeTruthy();
    expect(app.renderer.options).toMatchObject(options);
    expect(createPixiApplication).toHaveBeenCalledWith({ view: stage._canvas.current, ...options });
  });

  it("creates PIXI.Application instance with 'view' in options", () => {
    const canvas = document.createElement("canvas");
    const options = {
      backgroundColor: 0xff00ff,
      height: 300,
      sharedTicker: true,
      view: canvas,
      width: 400,
    };

    let stage;
    const element = renderer.create(<Stage options={options} ref={c => (stage = c)} />);
    const instance = element.getInstance();
    const app = instance._app.current;

    expect(app instanceof PIXI.Application).toBeTruthy();
    expect(app.renderer.options).toMatchObject(options);
    expect(createPixiApplication).toHaveBeenCalledWith(options);
  });

  it("does not create PIXI.Application if provided", () => {
    const canvas = document.createElement("canvas");
    const options = {
      backgroundColor: 0xff00ff,
      height: 300,
      sharedTicker: true,
      view: canvas,
      width: 400,
    };
    const app = new PIXI.Application(options);

    let stage;
    const element = renderer.create(<Stage app={app} ref={c => (stage = c)} />);
    const instance = element.getInstance();

    expect(instance._app.current).toEqual(app);
    expect(createPixiApplication).toHaveBeenCalledTimes(0);
    app.destroy(true, true);
  });

  it("creates root Container", () => {
    let stage;
    renderer.create(<Stage options={{ height: 300, width: 400 }} position="40,20" ref={c => (stage = c)} scale={2} />);

    expect(stage._app.current.stage instanceof PIXI.Container).toBeTruthy();
  });

  it("applies DisplayObject props to root Container", () => {
    const scale = 2;
    const x = 40;
    const y = 20;
    const element = renderer.create(
      <Stage options={{ width: 400, height: 300 }} position={`${x},${y}`} scale={scale} />
    );
    const instance = element.getInstance();
    const app = instance._app.current;
    const stage = app.stage;

    expect(stage.position.x).toEqual(x);
    expect(stage.position.y).toEqual(y);
    expect(stage.scale.x).toEqual(scale);
    expect(stage.scale.y).toEqual(scale);
  });

  it("updates root Container DisplayObject props", () => {
    const scale = 2;
    const element = renderer.create(<Stage options={{ width: 400, height: 300 }} scale={scale} />);
    const instance = element.getInstance();
    const app = instance._app.current;
    const stage = app.stage;

    expect(stage.scale.x).toEqual(scale);
    expect(stage.scale.y).toEqual(scale);

    const newScale = 1;
    element.update(<Stage options={{ width: 400, height: 300 }} scale={newScale} />);

    expect(stage.scale.x).toEqual(newScale);
    expect(stage.scale.y).toEqual(newScale);
  });

  it("resizes renderer when dimensions change", () => {
    const height = 300;
    const width = 400;
    const element = renderer.create(<Stage options={{ width, height }} />);
    const instance = element.getInstance();
    const app = instance._app.current;

    expect(app.renderer.height).toEqual(height);
    expect(app.renderer.width).toEqual(width);

    const newHeight = 600;
    const newWidth = 800;
    element.update(<Stage options={{ width: newWidth, height: newHeight }} />);

    expect(app.renderer.height).toEqual(newHeight);
    expect(app.renderer.width).toEqual(newWidth);
  });

  it("can be umounted", () => {
    const element = renderer.create(<Stage />);

    expect(() => element.unmount()).not.toThrow();
  });

  it("calls render on first render", () => {
    const children = <Text text="Hello World!" />;
    const element = renderer.create(<Stage>{children}</Stage>);
    const instance = element.getInstance();
    const stage = instance._app.current.stage;

    expect(__renderMock).toHaveBeenCalledTimes(1);
    expect(__renderMock).toHaveBeenCalledWith(
      <AppProvider app={instance._app.current}>{children}</AppProvider>,
      stage,
      undefined,
      instance
    );
  });

  it("calls render on update when props changed", () => {
    const children1 = <Text text="Hello World!" />;
    const element = renderer.create(<Stage>{children1}</Stage>);
    const instance = element.getInstance();
    const stage = instance._app.current.stage;

    __renderMock.mockClear();
    const children2 = <Text text="World Hello!" />;
    element.update(<Stage>{children2}</Stage>);

    expect(__renderMock).toHaveBeenCalledTimes(1);
    expect(__renderMock).toHaveBeenCalledWith(
      <AppProvider app={instance._app.current}>{children2}</AppProvider>,
      stage,
      undefined,
      instance
    );
  });

  it("calls unmount when non-dimensional options changed", () => {
    const height = 300;
    const width = 400;
    const backgroundColor = 0x000000;
    const element = renderer.create(<Stage options={{ width, height, backgroundColor }} />);
    const instance = element.getInstance();
    const stage = instance._app.current.stage;

    const newBackgroundColor = 0xffffff;
    element.update(<Stage options={{ width, height, backgroundColor: newBackgroundColor }} />);

    expect(__unmounMock).toHaveBeenCalledTimes(1);
    expect(__unmounMock).toHaveBeenCalledWith(stage);
  });

  it("calls unmount when unmounting", () => {
    const element = renderer.create(<Stage />);
    const instance = element.getInstance();
    const stage = instance._app.current.stage;
    element.unmount();

    expect(__unmounMock).toHaveBeenCalledTimes(1);
    expect(__unmounMock).toHaveBeenCalledWith(stage);
  });
});
