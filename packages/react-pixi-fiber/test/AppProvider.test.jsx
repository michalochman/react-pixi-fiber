import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import PropTypes from "prop-types";
import renderer from "react-test-renderer";
import { AppContext, AppProvider, Container, withApp } from "../src";
import { isNewContextAvailable } from "../src/compat";
import { createStageClass, createStageFunction } from "../src/Stage";
import { createRender } from "../src/render";
import { ReactPixiFiberAsPrimaryRenderer } from "../src/ReactPixiFiber";
import { createPixiApplication } from "../src/utils";
import * as PIXI from "pixi.js";

vi.mock("../src/utils", async importOriginal => ({ ...(await importOriginal()), createPixiApplication: vi.fn() }));

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
      const TestComponent = vi.fn(() => null);

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

    beforeEach(() => {
      createPixiApplication.mockReset();
      createPixiApplication.mockImplementation(options => {
        app = new PIXI.Application(options);
        return app;
      });
    });

    it("exports null AppContext", () => {
      expect(AppContext).toEqual(null);
    });

    it("passes app context to component rendered inside AppProvider", () => {
      const app = new PIXI.Application();
      const TestComponent = vi.fn(() => null);
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
      const TestComponent = vi.fn(() => null);
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
      const TestComponent = vi.fn(() => null);
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

  beforeEach(() => {
    createPixiApplication.mockReset();
    createPixiApplication.mockImplementation(options => {
      app = new PIXI.Application(options);
      return app;
    });
  });

  it("passes app prop to component rendered inside AppProvider", () => {
    const app = new PIXI.Application();
    const TestComponent = vi.fn(() => null);
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
    const TestComponent = vi.fn(() => null);
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
    const TestComponent = vi.fn(() => null);
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
