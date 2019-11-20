import { createStageFunction, createStageClass } from "../../src/Stage";

describe("Stage", () => {
  it("should export Stage class creator", () => {
    expect(typeof createStageClass).toEqual("function");
  });

  it("should export Stage function creator", () => {
    expect(typeof createStageFunction).toEqual("function");
  });
});
