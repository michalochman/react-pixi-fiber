import React from "react";
import PropTypes from "prop-types";
import renderer from "react-test-renderer";
import { AppContext, AppProvider, Container, withApp } from "../src";
import { isNewContextAvailable } from "../src/compat";
import { createStageClass, createStageFunction } from "../src/Stage";
import { createRender } from "../src/render";
import { ReactPixiFiberAsPrimaryRenderer } from "../src/ReactPixiFiber";
import { __RewireAPI__ as HooksRewireAPI } from "../src/Stage/hooks";
import { __RewireAPI__ as StageRewireAPI } from "../src/Stage/legacy";
import * as PIXI from "pixi.js";

const render = createRender(ReactPixiFiberAsPrimaryRenderer);

if (isNewContextAvailable()) {
  // New Context API
  describe("AppProvider using New Context API (React >=16.3.0)", () => {
    it("exports AppContext with Provider and Consumer", () => {
      expect(AppContext.Provider).not.toEqual(null);
      expect(AppContext.Consumer).not.toEqual(null);
    });

    it("passes app prop to wrapped component", () => {
      const app = new PIXI.Application();
      const TestComponent = jest.fn(() => null);

      renderer.act(() => {
        render(
          <AppContext.Provider value={app}>
            <AppContext.Consumer>{app => <TestComponent app={app} foo="bar" />}</AppContext.Consumer>
          </AppContext.Provider>,
          app.stage
        );
      });

      expect(TestComponent).toHaveBeenCalledWith({ app, foo: "bar" }, {});
    });
  });
} else {
  // Legacy Context API
  describe("AppProvider using Legacy Context API (React <16.3.0)", () => {
    let app;
    const createPixiApplication = jest.fn(options => {
      app = new PIXI.Application(options);
      return app;
    });

    beforeEach(() => {
      HooksRewireAPI.__Rewire__("createPixiApplication", createPixiApplication);
      StageRewireAPI.__Rewire__("createPixiApplication", createPixiApplication);
      createPixiApplication.mockClear();
    });

    afterEach(() => {
      HooksRewireAPI.__ResetDependency__("createPixiApplication");
      StageRewireAPI.__ResetDependency__("createPixiApplication");
    });

    it("exports null AppContext", () => {
      expect(AppContext).toEqual(null);
    });

    it("passes app context to component rendered inside AppProvider", () => {
      const app = new PIXI.Application();
      const TestComponent = jest.fn(() => null);
      TestComponent.contextTypes = {
        app: PropTypes.object,
      };

      render(
        <AppProvider app={app}>
          <Container>
            <TestComponent foo="bar" />
          </Container>
        </AppProvider>,
        app.stage
      );

      expect(TestComponent).toHaveBeenCalledWith({ foo: "bar" }, { app });
    });

    it("passes app context to component rendered inside Stage (class)", () => {
      const Stage = createStageClass();
      const TestComponent = jest.fn(() => null);
      TestComponent.contextTypes = {
        app: PropTypes.object,
      };

      renderer.create(
        <Stage>
          <Container>
            <TestComponent foo="bar" />
          </Container>
        </Stage>
      );

      expect(TestComponent).toHaveBeenCalledWith({ foo: "bar" }, { app });
    });

    it("passes app context to component rendered inside Stage (function)", () => {
      const Stage = createStageFunction();
      const TestComponent = jest.fn(() => null);
      TestComponent.contextTypes = {
        app: PropTypes.object,
      };

      renderer.create(
        <Stage>
          <Container>
            <TestComponent foo="bar" />
          </Container>
        </Stage>
      );

      expect(TestComponent).toHaveBeenCalledWith({ foo: "bar" }, { app });
    });
  });
}

describe("withApp", () => {
  let app;
  const createPixiApplication = jest.fn(options => {
    app = new PIXI.Application(options);
    return app;
  });

  beforeEach(() => {
    HooksRewireAPI.__Rewire__("createPixiApplication", createPixiApplication);
    StageRewireAPI.__Rewire__("createPixiApplication", createPixiApplication);
    createPixiApplication.mockClear();
  });

  afterEach(() => {
    HooksRewireAPI.__ResetDependency__("createPixiApplication");
    StageRewireAPI.__ResetDependency__("createPixiApplication");
  });

  it("passes app prop to component rendered inside AppProvider", () => {
    const app = new PIXI.Application();
    const TestComponent = jest.fn(() => null);
    const TestComponentWithApp = withApp(TestComponent);

    renderer.act(() => {
      render(
        <AppProvider app={app}>
          <Container>
            <TestComponentWithApp foo="bar" />
          </Container>
        </AppProvider>,
        app.stage
      );
    });

    expect(TestComponent).toHaveBeenCalledWith({ app, foo: "bar" }, {});
  });

  it("passes app prop to component rendered inside Stage (class)", () => {
    const Stage = createStageClass();
    const TestComponent = jest.fn(() => null);
    const TestComponentWithApp = withApp(TestComponent);

    renderer.act(() => {
      renderer.create(
        <Stage>
          <TestComponentWithApp foo="bar" />
        </Stage>
      );
    });

    expect(TestComponent).toHaveBeenCalledWith({ app, foo: "bar" }, {});
  });

  it("passes app prop to component rendered inside Stage (function)", () => {
    const Stage = createStageFunction();
    const TestComponent = jest.fn(() => null);
    const TestComponentWithApp = withApp(TestComponent);

    renderer.act(() => {
      renderer.create(
        <Stage>
          <TestComponentWithApp foo="bar" />
        </Stage>
      );
    });

    expect(TestComponent).toHaveBeenCalledWith({ app, foo: "bar" }, {});
  });
});
