import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import renderer from "react-test-renderer";
import { AppContext, AppProvider, Container, withApp } from "../src";
import { createStageClass } from "../src/Stage";
import { appTestHook } from "../src/Stage";
import { ReactPixiFiberAsPrimaryRenderer as ReactPixiFiber } from "../src/ReactPixiFiber";
import { createRender } from "../src/render";
import * as PIXI from "pixi.js";

const render = createRender(ReactPixiFiber)

if (typeof React.createContext === "function") {
  // New Context API
  describe("AppProvider using New Context API (React >=16.3.0)", () => {
    it("exports AppContext with Provider and Consumer", () => {
      expect(AppContext.Provider).not.toEqual(null);
      expect(AppContext.Consumer).not.toEqual(null);
    });

    it("passess app prop to wrapped component", () => {
      const app = new PIXI.Application();
      const TestComponent = jest.fn(() => null);

      render(
        <AppContext.Provider value={app}>
          <AppContext.Consumer>{app => <TestComponent app={app} foo="bar" />}</AppContext.Consumer>
        </AppContext.Provider>,
        app.stage
      );

      expect(TestComponent).toHaveBeenCalledWith({ app, foo: "bar" }, {});
    });
  });
} else {
  // Legacy Context API
  describe("AppProvider using Legacy Context API (React <16.3.0)", () => {
    it("exports null AppContext", () => {
      expect(AppContext).toEqual(null);
    });

    it("passess app context to component rendered inside AppProvider", () => {
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

    it("passess app context to component rendered inside Stage", () => {
      const Stage = createStageClass();
      const TestComponent = jest.fn(() => null);
      TestComponent.contextTypes = {
        app: PropTypes.object,
      };

      let stage;
      ReactDOM.render(
        <Stage ref={c => (stage = c)}>
          <Container>
            <TestComponent foo="bar" />
          </Container>
        </Stage>,
        document.createElement("div")
      );

      expect(TestComponent).toHaveBeenCalledWith({ foo: "bar" }, { app: stage._app });
    });
  });
}

describe("withApp", () => {
  it("passess app prop to component rendered inside AppProvider", () => {
    const app = new PIXI.Application();
    const TestComponent = jest.fn(() => null);
    const TestComponentWithApp = withApp(TestComponent);

    render(
      <AppProvider app={app}>
        <Container>
          <TestComponentWithApp foo="bar" />
        </Container>
      </AppProvider>,
      app.stage
    );

    expect(TestComponent).toHaveBeenCalledWith({ app, foo: "bar" }, {});
  });

  it("passess app prop to component rendered inside Stage", () => {
    const Stage = createStageClass();
    const TestComponent = jest.fn(() => null);
    const TestComponentWithApp = withApp(TestComponent);

    let stage;
    ReactDOM.render(
      <Stage ref={c => (stage = c)}>
        <TestComponentWithApp foo="bar" />
      </Stage>,
      document.createElement("div")
    );

    expect(TestComponent).toHaveBeenCalledWith({ app: appTestHook, foo: "bar" }, {});
  });
});
