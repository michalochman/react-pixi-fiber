import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import renderer from "react-test-renderer";
import * as PIXI from "pixi.js";
import { Text } from "../../src";
import { AppProvider } from "../../src/AppProvider";
import { __renderMock, __unmounMock } from "../../src/render";
import { createStageClass } from "../../src/Stage";
import { createPixiApplication } from "../../src/utils";

vi.mock("../../src/ReactPixiFiber", async importOriginal => {
  return Object.assign({}, await importOriginal(), {
    createContainer: vi.fn(),
    injectIntoDevTools: vi.fn(),
    updateContainer: vi.fn(),
  });
});

vi.mock("../../src/utils", async importOriginal => ({ ...(await importOriginal()), createPixiApplication: vi.fn() }));

vi.mock("../../src/render", () => {
  const render = vi.fn();
  const unmount = vi.fn();

  return {
    createRender: vi.fn().mockReturnValue(render),
    createUnmount: vi.fn().mockReturnValue(unmount),
    __renderMock: render,
    __unmounMock: unmount,
  };
});

describe("Stage (class)", () => {
  const Stage = createStageClass();
  let app;

  beforeEach(() => {
    createPixiApplication.mockReset();
    createPixiApplication.mockImplementation(options => {
      app = new PIXI.Application(options);
      return app;
    });
    __renderMock.mockClear();
    __unmounMock.mockClear();
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

  it("creates new PIXI.Application with a new canvas when non-dimensional options change", () => {
    // Give each mounted <canvas /> a real element, like react-dom would
    const createNodeMock = () => document.createElement("canvas");
    const options = { width: 400, height: 300, backgroundColor: 0x000000 };
    const newOptions = { width: 400, height: 300, backgroundColor: 0xffffff };

    const element = renderer.create(<Stage options={options} />, { createNodeMock });
    const instance = element.getInstance();
    const firstApp = instance._app.current;
    element.update(<Stage options={newOptions} />);

    expect(createPixiApplication).toHaveBeenCalledTimes(2);
    const [[firstCall], [secondCall]] = createPixiApplication.mock.calls;
    expect(firstCall.view).toBeInstanceOf(HTMLCanvasElement);
    expect(secondCall.view).toBeInstanceOf(HTMLCanvasElement);
    // Destroying the old PIXI.Application unbinds or loses the WebGL context of its canvas,
    // so the new PIXI.Application must not share that canvas
    expect(secondCall.view).not.toBe(firstCall.view);
    expect(instance._app.current).not.toBe(firstApp);
    expect(instance._app.current.view).toBe(secondCall.view);
    expect(element.toJSON()).toHaveProperty("type", "canvas");
  });

  it("keeps canvas provided in options when non-dimensional options change", () => {
    const view = document.createElement("canvas");
    const options = { width: 400, height: 300, backgroundColor: 0x000000, view };
    const newOptions = { width: 400, height: 300, backgroundColor: 0xffffff, view };

    const element = renderer.create(<Stage options={options} />);
    element.update(<Stage options={newOptions} />);

    expect(createPixiApplication).toHaveBeenCalledTimes(2);
    expect(createPixiApplication).toHaveBeenLastCalledWith({ ...newOptions, view });
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
