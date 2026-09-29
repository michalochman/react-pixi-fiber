import { describe, it, expect, vi } from "vitest";
import React from "react";
import renderer, { act } from "react-test-renderer";
import * as PIXI from "pixi.js";
import { configure, Sprite, Stage } from "react-pixi-fiber";
import react18 from "@react-pixi-fiber/react-18";
import pixi7 from "../src/index";

describe("pixi7 event props", () => {
  it("sets onpointerdown and interactive on the instance, and the federated event reaches the handler", async () => {
    configure({ react: react18(), pixi: pixi7() });
    const handler = vi.fn();
    let app: PIXI.Application | null = null;
    const tree = renderer.create(
      <Stage
        options={{ width: 8, height: 8 }}
        onInit={a => {
          app = a as PIXI.Application;
        }}
      >
        <Sprite interactive onpointerdown={handler} cursor="pointer" />
      </Stage>,
      { createNodeMock: () => document.createElement("canvas") }
    );
    await act(async () => {
      await new Promise(r => setTimeout(r, 0));
    });
    const sprite = app!.stage.children[0] as PIXI.Sprite;
    expect(sprite.onpointerdown).toBe(handler);
    expect(sprite.eventMode).toBe("static");
    expect(sprite.cursor).toBe("pointer");
    const event = new PIXI.FederatedPointerEvent(app!.renderer.events.rootBoundary);
    event.type = "pointerdown";
    app!.renderer.events.rootBoundary.rootTarget = app!.stage;
    event.target = sprite;
    app!.renderer.events.rootBoundary.dispatchEvent(event, "pointerdown");
    expect(handler).toHaveBeenCalledTimes(1);
    act(() => tree.unmount());
  });
  it("puts the React DOM handler onClick on the canvas and onclick on app.stage", async () => {
    configure({ react: react18(), pixi: pixi7() });
    const onClick = () => {};
    const onclick = () => {};
    let app: PIXI.Application | null = null;
    const tree = renderer.create(
      <Stage
        onClick={onClick}
        onclick={onclick}
        onInit={a => {
          app = a as PIXI.Application;
        }}
        options={{ width: 8, height: 8 }}
      />,
      { createNodeMock: () => document.createElement("canvas") }
    );
    await act(async () => {
      await new Promise(r => setTimeout(r, 0));
    });
    const props = (tree.toJSON() as { props: Record<string, unknown> }).props;
    expect(props.onClick).toBe(onClick);
    expect(props).not.toHaveProperty("onclick");
    expect(app!.stage.onclick).toBe(onclick);
    expect((app!.stage as unknown as Record<string, unknown>).onClick).toBeUndefined();
    act(() => tree.unmount());
  });
});
