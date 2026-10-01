import { describe, it, expect } from "vitest";
import { defaultProps } from "../src/props";

describe("props", () => {
  describe("defaultProps", () => {
    it("should match", () => {
      expect(defaultProps).toMatchSnapshot();
    });
  });
});
