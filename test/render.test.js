import React from "react";
import pkg from "../package.json";
import { Container, Text } from "../src/index";
import { ReactPixiFiberAsPrimaryRenderer as ReactPixiFiber } from "../src/ReactPixiFiber";
import { render, roots, unmount } from "../src/render";

jest.mock("../src/ReactPixiFiber", () => {
  const actual = require.requireActual("../src/ReactPixiFiber");
  return Object.assign({}, actual, {
    ReactPixiFiberAsPrimaryRenderer: Object.assign({}, actual.ReactPixiFiberAsPrimaryRenderer, {
      createContainer: jest.fn(),
      getPublicRootInstance: jest.fn(),
      injectIntoDevTools: jest.fn(),
      updateContainer: jest.fn(),
    }),
  });
});

describe("render", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const app = new PIXI.Application();
  const callback = jest.fn();
  const root = app.stage;
  const element = (
    <Container>
      <Text text="Hello World!" />
    </Container>
  );

  it("calls ReactPixiFiber.createContainer", () => {
    render(element, root, callback);

    expect(ReactPixiFiber.createContainer).toHaveBeenCalledTimes(1);
    expect(ReactPixiFiber.createContainer).toHaveBeenCalledWith(app.stage);
  });

  it("calls ReactPixiFiber.updateContainer", () => {
    render(element, root, callback);

    expect(ReactPixiFiber.updateContainer).toHaveBeenCalledTimes(1);
    expect(ReactPixiFiber.updateContainer).toHaveBeenCalledWith(element, roots.get(root), undefined, callback);
  });

  it("calls ReactPixiFiber.injectIntoDevTools", () => {
    render(element, root, callback);

    expect(ReactPixiFiber.injectIntoDevTools).toHaveBeenCalledTimes(1);
    expect(ReactPixiFiber.injectIntoDevTools).toHaveBeenCalledWith(
      expect.objectContaining({
        findFiberByHostInstance: ReactPixiFiber.findFiberByHostInstance,
        bundleType: 1,
        version: pkg.version,
        rendererPackageName: pkg.name,
      })
    );
  });

  it("does not create root if it is already present", () => {
    roots.set(root, app.stage);
    render(element, root, callback);

    expect(ReactPixiFiber.createContainer).toHaveBeenCalledTimes(0);
  });
});

describe("unmount", () => {
  beforeEach(() => {
    roots.clear();
    jest.resetAllMocks();
  });

  const app = new PIXI.Application();
  const root = app.stage;

  it("calls ReactPixiFiber.updateContainer if it was mounted", () => {
    roots.set(root, app.stage);
    unmount(root);

    expect(ReactPixiFiber.updateContainer).toHaveBeenCalledTimes(1);
    expect(ReactPixiFiber.updateContainer).toHaveBeenCalledWith(null, roots.get(root));
  });

  it("does not update root if it is not present", () => {
    expect(() => unmount(root)).toThrow("ReactPixiFiber did not render into container provided");
    expect(ReactPixiFiber.updateContainer).toHaveBeenCalledTimes(0);
  });
});
