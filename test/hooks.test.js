import React, { useLayoutEffect } from "react";
import renderer from "react-test-renderer";
import * as PIXI from "pixi.js";
import { Container } from "../src/index";
import Stage, { appTestHook } from "../src/Stage";
import {
  usePixi,
  usePixiTicker,
  usePreviousProps,
  usePixiApp,
} from "../src/hooks";
import { render } from "../src/render";
import { AppContext } from "../src/AppProvider";

describe("usePixi", () => {
  it("will provide app from the context above", () => {
    const app = new PIXI.Application();

    const TestComponent = jest.fn(() => null);

    const HookContainer = () => {
      const app = usePixi();

      return (
        <Container>
          <TestComponent app={app} />
        </Container>
      );
    };

    render(
      <AppContext.Provider value={app}>
        <HookContainer />
      </AppContext.Provider>,
      app.stage
    );

    expect(TestComponent).toHaveBeenCalledWith({ app }, {});
  });
});

describe("usePixiTicker", () => {
  it("will add the callback to the app.ticker", () => {
    const app = new PIXI.Application();
    const fn = jest.fn();
    const add = jest.spyOn(app.ticker, 'add');

    const TestComponent = () => {
      usePixiTicker(fn);

      return (
        <Container />
      );
    };

    const tree = renderer.create(
      <AppContext.Provider value={app}>
        <TestComponent />
      </AppContext.Provider>
    );

    // trigger useEffect because that's when usePixiTicker
    // calls `app.ticker.add`
    tree.update();

    expect(add).toHaveBeenCalledWith(fn);
  });
});

describe("usePreviousProps", () => {
  it("will provide last props on rerender", () => {
    const mock = jest.fn();
    const props = {
      prop1: 'foo',
      prop2: 'bar',
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

describe("usePixiApp", () => {
  it("will provide app and canvas", done => {
    const props = {
      width: 400,
      height: 400,
    };
    const TestComponent = jest.fn(() => null);

    const TestContainer = props => {
      const { app, canvas } = usePixiApp(props);

      useLayoutEffect(() => {
        expect(TestComponent).toHaveBeenCalledWith({ app, canvas }, {});
        done();
      });

      return <TestComponent app={app} canvas={canvas} />;
    };

    render(<TestContainer {...props} />);
  });
});
