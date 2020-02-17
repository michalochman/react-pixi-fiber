import React from "react";
import { getDevToolsVersion } from "../src/ReactPixiFiberRootFactory";

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

describe("getDevToolsVersion", () => {
  it("should return React version", () => {
    expect(getDevToolsVersion()).toEqual(require("react").version);
  });
});
