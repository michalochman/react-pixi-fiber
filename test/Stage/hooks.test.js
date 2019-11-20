import React, { createRef, useLayoutEffect } from "react";
import renderer from "react-test-renderer";
import * as PIXI from "pixi.js";
import { Text } from "../../src/index";
import { AppProvider } from "../../src/AppProvider";
import { STAGE_OPTIONS_RECREATE, STAGE_OPTIONS_UNMOUNT } from "../../src/Stage/common";
import { createStageFunction } from "../../src/Stage";
import { usePreviousProps, useStageRenderer, useStageRerenderer } from "../../src/Stage/hooks";
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

    const instance = renderer.create(<TestComponent {...props} />);
    expect(mock).toHaveBeenCalledWith({});
    // useEffect isn't triggered until after this update
    instance.update(<TestComponent {...props} />);
    expect(mock).toHaveBeenCalledWith(props);
    expect(mock).toHaveBeenCalledTimes(2);
  });
});

describe("useStageRenderer", () => {
  const app = new PIXI.Application();
  const view = document.createElement("canvas");
  const renderStage = jest.fn();
  const cleanupStage = jest.fn();
  const createPixiApplication = jest.fn(() => app);

  beforeEach(() => {
    HooksRewireAPI.__Rewire__("cleanupStage", cleanupStage);
    HooksRewireAPI.__Rewire__("renderStage", renderStage);
    HooksRewireAPI.__Rewire__("createPixiApplication", createPixiApplication);
    cleanupStage.mockClear();
    renderStage.mockClear();
    createPixiApplication.mockClear();
  });

  afterEach(() => {
    HooksRewireAPI.__ResetDependency__("cleanupStage");
    HooksRewireAPI.__ResetDependency__("renderStage");
    HooksRewireAPI.__ResetDependency__("createPixiApplication");
  });

  it("creates PIXI.Application with default canvas", () => {
    const options = { width: 400, height: 400 };

    const appRef = createRef();
    const canvasRef = createRef();
    canvasRef.current = view;

    const TestContainer = props => {
      useStageRenderer(props, appRef, canvasRef);

      return null;
    };

    expect(appRef.current).toEqual(null);

    renderer.act(() => {
      renderer.create(<TestContainer options={options} />);
    });

    expect(appRef.current).toBeInstanceOf(PIXI.Application);
    expect(createPixiApplication).toHaveBeenCalledTimes(1);
    expect(createPixiApplication).toHaveBeenCalledWith({ ...options, view: canvasRef.current });
    expect(renderStage).toHaveBeenCalledTimes(1);
  });

  it("creates PIXI.Application with canvas provided in options", () => {
    const options = { width: 400, height: 400, view };

    const appRef = createRef();
    const canvasRef = createRef();

    const TestContainer = props => {
      useStageRenderer(props, appRef, canvasRef);

      return null;
    };

    expect(appRef.current).toEqual(null);

    renderer.act(() => {
      renderer.create(<TestContainer options={options} />);
    });

    expect(appRef.current).toBeInstanceOf(PIXI.Application);
    expect(createPixiApplication).toHaveBeenCalledTimes(1);
    expect(createPixiApplication).toHaveBeenCalledWith({ ...options, view });
    expect(renderStage).toHaveBeenCalledTimes(1);
  });

  it("cleans up after itself", () => {
    const options = { width: 400, height: 400 };

    const appRef = createRef();
    const canvasRef = createRef();
    canvasRef.current = view;

    const TestContainer = props => {
      useStageRenderer(props, appRef, canvasRef);

      return null;
    };

    const instance = renderer.create(<TestContainer options={options} />);

    // trigger useEffect cleanup
    instance.unmount();

    expect(cleanupStage).toHaveBeenCalledTimes(1);
    expect(cleanupStage).toHaveBeenCalledWith(app, STAGE_OPTIONS_UNMOUNT);
  });
});

describe("useStageRerenderer", () => {
  const app = new PIXI.Application();
  const view = document.createElement("canvas");
  const cleanupStage = jest.fn();
  const createPixiApplication = jest.fn(() => app);
  const renderStage = jest.fn();
  const rerenderStage = jest.fn();
  const resizeRenderer = jest.fn();

  beforeEach(() => {
    HooksRewireAPI.__Rewire__("cleanupStage", cleanupStage);
    HooksRewireAPI.__Rewire__("createPixiApplication", createPixiApplication);
    HooksRewireAPI.__Rewire__("renderStage", renderStage);
    HooksRewireAPI.__Rewire__("rerenderStage", rerenderStage);
    HooksRewireAPI.__Rewire__("resizeRenderer", resizeRenderer);
    cleanupStage.mockClear();
    createPixiApplication.mockClear();
    renderStage.mockClear();
    rerenderStage.mockClear();
    resizeRenderer.mockClear();
  });

  afterEach(() => {
    HooksRewireAPI.__ResetDependency__("cleanupStage");
    HooksRewireAPI.__ResetDependency__("createPixiApplication");
    HooksRewireAPI.__ResetDependency__("renderStage");
    HooksRewireAPI.__ResetDependency__("rerenderStage");
    HooksRewireAPI.__ResetDependency__("resizeRenderer");
  });

  it("cleans up after itself if non-dimensional options changed", () => {
    const options = { width: 400, height: 400, backgroundColor: 0x000000 };
    const newOptions = { width: 400, height: 400, backgroundColor: 0xffffff };

    const appRef = createRef();
    const canvasRef = createRef();

    const TestContainer = props => {
      useStageRerenderer(props, appRef, canvasRef);

      return null;
    };

    let instance;
    renderer.act(() => {
      instance = renderer.create(<TestContainer options={options} />);
    });
    appRef.current = app;
    renderer.act(() => {
      instance.update(<TestContainer options={newOptions} />);
    });

    expect(cleanupStage).toHaveBeenCalledTimes(1);
    expect(cleanupStage).toHaveBeenCalledWith(app, STAGE_OPTIONS_RECREATE);
  });

  it("creates new PIXI.Application with default canvas if non-dimensional options changed", () => {
    const options = { width: 400, height: 400, backgroundColor: 0x000000 };
    const newOptions = { width: 400, height: 400, backgroundColor: 0xffffff };

    const appRef = createRef();
    const canvasRef = createRef();
    canvasRef.current = view;

    const TestContainer = props => {
      useStageRerenderer(props, appRef, canvasRef);

      return null;
    };

    let instance;
    renderer.act(() => {
      instance = renderer.create(<TestContainer options={options} />);
    });
    appRef.current = app;
    renderer.act(() => {
      instance.update(<TestContainer options={newOptions} />);
    });

    expect(createPixiApplication).toHaveBeenCalledTimes(1);
    expect(createPixiApplication).toHaveBeenCalledWith({ ...newOptions, view: canvasRef.current });
    expect(renderStage).toHaveBeenCalledTimes(1);
  });

  it("creates new PIXI.Application with canvas provided in options if non-dimensional options changed", () => {
    const options = { width: 400, height: 400, backgroundColor: 0x000000, view };
    const newOptions = { width: 400, height: 400, backgroundColor: 0xffffff, view };

    const appRef = createRef();
    const canvasRef = createRef();

    const TestContainer = props => {
      useStageRerenderer(props, appRef, canvasRef);

      return null;
    };

    let instance;
    renderer.act(() => {
      instance = renderer.create(<TestContainer options={options} />);
    });
    renderer.act(() => {
      appRef.current = app;
      instance.update(<TestContainer options={newOptions} />);
    });

    expect(createPixiApplication).toHaveBeenCalledTimes(1);
    expect(createPixiApplication).toHaveBeenCalledWith({ ...newOptions, view });
    expect(renderStage).toHaveBeenCalledTimes(1);
  });

  it("rerenders stage if dimensional options changed", () => {
    const options = { width: 400, height: 400 };
    const newOptions = { width: 600, height: 600 };

    const appRef = createRef();
    const canvasRef = createRef();

    const TestContainer = props => {
      useStageRerenderer(props, appRef, canvasRef);

      return null;
    };

    let instance;
    renderer.act(() => {
      instance = renderer.create(<TestContainer options={options} />);
    });
    renderer.act(() => {
      appRef.current = app;
      instance.update(<TestContainer options={newOptions} />);
    });

    expect(createPixiApplication).toHaveBeenCalledTimes(0);
    expect(renderStage).toHaveBeenCalledTimes(0);
    expect(rerenderStage).toHaveBeenCalledTimes(1);
    expect(rerenderStage).toHaveBeenCalledWith(app, { options: options }, { options: newOptions });
    expect(resizeRenderer).toHaveBeenCalledTimes(1);
    expect(resizeRenderer).toHaveBeenCalledWith(app, { options: options }, { options: newOptions });
  });

  it("rerenders stage if options did not change", () => {
    const options = { width: 400, height: 400 };
    const newOptions = { width: 400, height: 400 };

    const appRef = createRef();
    const canvasRef = createRef();

    const TestContainer = props => {
      useStageRerenderer(props, appRef, canvasRef);

      return null;
    };

    let instance;
    renderer.act(() => {
      instance = renderer.create(<TestContainer options={options} />);
    });
    renderer.act(() => {
      appRef.current = app;
      instance.update(<TestContainer options={newOptions} />);
    });

    expect(createPixiApplication).toHaveBeenCalledTimes(0);
    expect(renderStage).toHaveBeenCalledTimes(0);
    expect(rerenderStage).toHaveBeenCalledTimes(1);
    expect(rerenderStage).toHaveBeenCalledWith(app, { options: options }, { options: newOptions });
    expect(resizeRenderer).toHaveBeenCalledTimes(1);
    expect(resizeRenderer).toHaveBeenCalledWith(app, { options: options }, { options: newOptions });
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
    const instance = renderer.create(<Stage />).toJSON();

    expect(instance).toHaveProperty("type", "canvas");
  });

  it("renders null if canvas is already passed in options", () => {
    const canvas = document.createElement("canvas");
    const options = { view: canvas };
    const instance = renderer.create(<Stage options={options} />).toJSON();

    expect(instance).toBeNull();
  });

  it("passes canvas props to rendered canvas element", () => {
    const className = "canvas";
    const id = "canvasApp";
    const style = { height: "100%", width: "100%" };
    const instance = renderer.create(<Stage className={className} id={id} style={style} options={{}} />).toJSON();

    expect(instance).toHaveProperty("type", "canvas");
    expect(instance.props).toEqual({
      className,
      id,
      style,
    });
  });

  it("does not pass stage props to rendered canvas element", () => {
    const style = { height: "100%", width: "100%" };
    const instance = renderer.create(<Stage height={600} style={style} width={800} />).toJSON();

    expect(instance).toHaveProperty("type", "canvas");
    expect(instance.props).not.toHaveProperty("height");
    expect(instance.props).not.toHaveProperty("width");
  });

  it("creates root container", () => {
    const app = new PIXI.Application({});
    renderer.create(<Stage height={300} width={400} scale={2} position="40,20" />);
    const { stage } = app;

    expect(stage instanceof PIXI.Container).toBeTruthy();
  });

  it("applies Container props to root container", () => {
    const scale = 2;
    const x = 40;
    const y = 20;

    renderer.act(() => {
      renderer.create(<Stage options={{ width: 400, height: 300 }} position={`${x},${y}`} scale={scale} />);
    });
    const { stage } = app;

    expect(stage.position.x).toEqual(x);
    expect(stage.position.y).toEqual(y);
    expect(stage.scale.x).toEqual(scale);
    expect(stage.scale.y).toEqual(scale);
  });

  it("updates root container Container props", () => {
    const scale = 2;

    let instance;
    renderer.act(() => {
      instance = renderer.create(<Stage options={{ width: 400, height: 300 }} scale={scale} />);
    });
    const { stage } = app;

    expect(stage.scale.x).toEqual(scale);
    expect(stage.scale.y).toEqual(scale);

    const newScale = 1;
    renderer.act(() => {
      instance.update(<Stage height={300} scale={newScale} width={400} />);
    });

    expect(stage.scale.x).toEqual(newScale);
    expect(stage.scale.y).toEqual(newScale);
  });

  it("resizes canvas when dimensions change", () => {
    const height = 300;
    const width = 400;

    let instance;
    renderer.act(() => {
      instance = renderer.create(<Stage options={{ width, height }} />);
    });

    expect(app.view.height).toEqual(height);
    expect(app.view.width).toEqual(width);

    const newHeight = 600;
    const newWidth = 800;
    renderer.act(() => {
      instance.update(<Stage options={{ width: newWidth, height: newHeight }} />);
    });

    expect(app.view.height).toEqual(newHeight);
    expect(app.view.width).toEqual(newWidth);
  });

  it("can be unmounted", () => {
    const element = renderer.create(<Stage />);

    expect(() => element.unmount()).not.toThrow();
  });

  it("calls render on first render", () => {
    const children = <Text text="Hello World!" />;

    renderer.act(() => {
      renderer.create(<Stage>{children}</Stage>);
    });

    expect(__renderMock).toHaveBeenCalledTimes(1);
    expect(__renderMock).toHaveBeenCalledWith(<AppProvider app={app}>{children}</AppProvider>, app.stage);
  });

  it("calls render on update", () => {
    const children1 = <Text text="Hello World!" />;

    let instance;
    renderer.act(() => {
      instance = renderer.create(<Stage>{children1}</Stage>);
    });
    __renderMock.mockClear();

    const children2 = <Text text="World Hello!" />;
    renderer.act(() => {
      instance.update(<Stage>{children2}</Stage>);
    });

    expect(__renderMock).toHaveBeenCalledTimes(1);
    expect(__renderMock).toHaveBeenCalledWith(<AppProvider app={app}>{children2}</AppProvider>, app.stage);
  });
});
