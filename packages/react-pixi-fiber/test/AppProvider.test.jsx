import { describe, it, expect, vi } from "vitest";
import React from "react";
import renderer from "react-test-renderer";
import { AppContext, AppProvider, Container, withApp } from "../src";
import Stage from "../src/Stage";
import { render } from "../src/render";
import * as PIXI from "pixi.js";

describe("AppProvider", () => {
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

describe("withApp", () => {
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

  it("passes app prop to component rendered inside Stage (function)", async () => {
    let app;
    const TestComponent = vi.fn(() => null);
    const TestComponentWithApp = withApp(TestComponent);

    // Stage renders its children after the application is created, so wait for the init promise.
    let tree;
    await renderer.act(async () => {
      tree = renderer.create(
        <Stage onInit={created => (app = created)}>
          <TestComponentWithApp foo="bar" />
        </Stage>
      );
    });

    expect(app).toBeInstanceOf(PIXI.Application);
    expect(TestComponent).toHaveBeenCalledWith({ app, foo: "bar" }, {});
    renderer.act(() => tree.unmount());
  });
});
