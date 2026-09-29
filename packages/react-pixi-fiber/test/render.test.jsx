import { describe, it, expect, vi } from "vitest";
import React from "react";
import * as PIXI from "pixi.js";
import { Container, Text, render, unmount } from "../src/index";

describe("render and unmount", () => {
  it("renders synchronously into a PixiJS container and unmounts it", () => {
    const stage = new PIXI.Container();
    render(
      <Container>
        <Text text="Hello" />
      </Container>,
      stage
    );
    expect(stage.children).toHaveLength(1);
    expect(stage.children[0].children[0]).toBeInstanceOf(PIXI.Text);
    unmount(stage);
    expect(stage.children).toHaveLength(0);
  });

  it("throws when unmounting a container that was never rendered into", () => {
    expect(() => unmount(new PIXI.Container())).toThrow("ReactPixiFiber did not render into container provided");
  });

  it("calls the callback after commit", () => {
    const callback = vi.fn();
    render(<Container />, new PIXI.Container(), callback);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
