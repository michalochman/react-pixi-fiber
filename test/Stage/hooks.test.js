import React, { useLayoutEffect } from "react";
import renderer from "react-test-renderer";
import * as PIXI from "pixi.js";
import { Text } from "../../src/index";
import { createStageFunction } from "../../src/Stage";
import { usePreviousProps, usePixiAppCreator } from "../../src/Stage/hooks";
import { AppProvider } from "../../src/AppProvider";
import { __RewireAPI__ as HooksRewireAPI } from "../../src/Stage/hooks";

jest.mock("../../src/ReactPixiFiber", () => {
  return Object.assign({}, require.requireActual("../../src/ReactPixiFiber"), {
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

describe("usePixiAppCreator", () => {
  const app = new PIXI.Application();
  const view = document.createElement("canvas");
  const cleanup = jest.fn();
  const createPixiApplication = jest.fn(() => app);

  beforeEach(() => {
    HooksRewireAPI.__Rewire__("cleanup", cleanup);
    HooksRewireAPI.__Rewire__("createPixiApplication", createPixiApplication);
    cleanup.mockClear();
    createPixiApplication.mockClear();
  });

  afterEach(() => {
    HooksRewireAPI.__ResetDependency__("cleanup");
    HooksRewireAPI.__ResetDependency__("createPixiApplication");
  });

  it("will provide app and canvas", () => {
    const options = { width: 400, height: 400 };
    const TestComponent = jest.fn(() => null);

    const TestContainer = props => {
      const { app, canvas } = usePixiAppCreator(props);

      return <TestComponent app={app} canvas={canvas} />;
    };

    renderer.create(<TestContainer options={options} />);

    expect(TestComponent).toHaveBeenCalledTimes(2);

    // first time the app should be null
    expect(TestComponent.mock.calls[0][0].app).toEqual(null);
    expect(TestComponent.mock.calls[0][0].canvas).not.toEqual(null);
    // second time the app is stored in state
    expect(TestComponent.mock.calls[1][0].app).toEqual(app);
    expect(TestComponent.mock.calls[1][0].canvas).not.toEqual(null);
  });

  it("will provide app but not canvas if view provided", () => {
    const options = { width: 400, height: 400, view };
    const TestComponent = jest.fn(() => null);

    const TestContainer = props => {
      const { app, canvas } = usePixiAppCreator(props);

      return <TestComponent app={app} canvas={canvas} />;
    };

    renderer.create(<TestContainer options={options} />);

    expect(TestComponent).toHaveBeenCalledTimes(2);

    // first time the app should be null
    expect(TestComponent.mock.calls[0][0].app).toEqual(null);
    expect(TestComponent.mock.calls[0][0].canvas).toEqual(null);
    // second time the app is stored in state
    expect(TestComponent.mock.calls[1][0].app).toEqual(app);
    expect(TestComponent.mock.calls[1][0].canvas).toEqual(null);
  });

  it("will cleanup after itself", () => {
    const options = { width: 400, height: 400 };
    const TestComponent = jest.fn(() => null);

    const TestContainer = props => {
      const { app, canvas } = usePixiAppCreator(props);

      return <TestComponent app={app} canvas={canvas} />;
    };

    const tree = renderer.create(<TestContainer options={options} />);

    // trigger useEffect cleanup
    tree.unmount();

    expect(cleanup).toHaveBeenCalled();
  });
});

describe("usePreviousProps", () => {
  it("will provide last props on rerender", () => {
    const mock = jest.fn();
    const props = {
      prop1: "foo",
      prop2: "bar",
    };

    const TestComponent = props => {
      const prevProps = usePreviousProps(props);

      useLayoutEffect(() => {
        mock(prevProps);
      });

      return null;
    };

    const tree = renderer.create(<TestComponent {...props} />);
    expect(mock).toHaveBeenCalledWith({});
    // useEffect isn't triggered until after this update
    tree.update(<TestComponent {...props} />);
    expect(mock).toHaveBeenCalledWith(props);
    expect(mock).toHaveBeenCalledTimes(2);
  });
});

describe("Stage (function)", () => {
  const { __renderMock, __unmounMock } = require("../../src/render");
  const Stage = createStageFunction();
  let app;
  const createPixiApplication = jest.fn(options => {
    app = new PIXI.Application(options);
    return app;
  });

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
      height: 300,
      sharedTicker: true,
      width: 400,
    };

    renderer.create(<Stage options={options} />);

    expect(createPixiApplication).toHaveBeenCalledTimes(1);
    // FIXME
    expect(createPixiApplication).toHaveBeenCalledWith({ view: null, ...options });
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

    renderer.create(<Stage options={options} />);

    expect(createPixiApplication).toHaveBeenCalledTimes(1);
    expect(createPixiApplication).toHaveBeenCalledWith(options);
  });

  it("creates root Container", () => {
    const app = new PIXI.Application({});
    renderer.create(<Stage height={300} width={400} scale={2} position="40,20" />);
    const { stage } = app;

    expect(stage instanceof PIXI.Container).toBeTruthy();
  });

  it("applies DisplayObject props to root Container", () => {
    const scale = 2;
    const x = 40;
    const y = 20;
    renderer.create(<Stage options={{ width: 400, height: 300 }} position={`${x},${y}`} scale={scale} />);
    const { stage } = app;

    expect(stage.position.x).toEqual(x);
    expect(stage.position.y).toEqual(y);
    expect(stage.scale.x).toEqual(scale);
    expect(stage.scale.y).toEqual(scale);
  });

  it("updates root Container DisplayObject props", () => {
    const scale = 2;
    const element = renderer.create(<Stage options={{ width: 400, height: 300 }} scale={scale} />);
    const { stage } = app;

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
    const element = renderer.create(<Stage options={{ width, height }} />);

    expect(app.renderer.height).toEqual(height);
    expect(app.renderer.width).toEqual(width);

    const newHeight = 600;
    const newWidth = 800;
    element.update(<Stage options={{ width: newWidth, height: newHeight }} />);

    expect(app.renderer.height).toEqual(newHeight);
    expect(app.renderer.width).toEqual(newWidth);
  });

  it("can be unmounted", () => {
    const element = renderer.create(<Stage />);

    expect(() => element.unmount()).not.toThrow();
  });

  it("calls render on componentDidMount", () => {
    const children = <Text text="Hello World!" />;
    renderer.create(<Stage>{children}</Stage>);

    // first in renderStage, second in rerenderStage
    expect(__renderMock).toHaveBeenCalledTimes(2);
    expect(__renderMock).toHaveBeenCalledWith(<AppProvider app={app}>{children}</AppProvider>, app.stage);
  });

  it("calls render on componentDidUpdate", () => {
    const children1 = <Text text="Hello World!" />;
    const element = renderer.create(<Stage>{children1}</Stage>);
    __renderMock.mockClear();

    const children2 = <Text text="World Hello!" />;
    element.update(<Stage>{children2}</Stage>);

    expect(__renderMock).toHaveBeenCalledTimes(1);
    expect(__renderMock).toHaveBeenCalledWith(<AppProvider app={app}>{children2}</AppProvider>, app.stage);
  });

  it("calls unmount on componentWillUnmount", () => {
    const element = renderer.create(<Stage />);
    const { stage } = app;
    element.unmount();

    expect(__unmounMock).toHaveBeenCalledTimes(1);
    expect(__unmounMock).toHaveBeenCalledWith(stage);
  });
});
