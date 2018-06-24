import React from "react";
import renderer from "react-test-renderer";
import pkg from "../package.json";
import { Text } from "../src/index";
import ReactPixiFiber from "../src/ReactPixiFiber";
import render, { roots } from "../src/render";
import Stage from "../src/Stage";

jest.mock("../src/ReactPixiFiber", () => {
  return Object.assign({}, require.requireActual("../src/ReactPixiFiber"), {
    createContainer: jest.fn(),
    getPublicRootInstance: jest.fn(),
    injectIntoDevTools: jest.fn(),
    updateContainer: jest.fn(),
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
    <Stage>
      <Text text="Hello World!" />
    </Stage>
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
