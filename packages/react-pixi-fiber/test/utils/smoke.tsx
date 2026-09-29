import { describe, it, expect, vi } from "vitest";
import React, { StrictMode } from "react";
import renderer, { act } from "react-test-renderer";
import { configure, Container, Sprite, Stage } from "react-pixi-fiber";
import type { PixiAdapter, ReactAdapter } from "react-pixi-fiber";

const settle = () =>
  act(async () => {
    await new Promise(r => setTimeout(r, 0));
  });

export function smokeSuite(name: string, pair: () => { react: ReactAdapter; pixi: PixiAdapter }) {
  describe(`smoke: ${name}`, () => {
    it("mounts Stage, renders a Sprite, changes a prop, reorders children and unmounts", async () => {
      configure(pair());
      let app: any = null;
      const Scene = ({ order, x }: { order: string[]; x: number }) => (
        <Stage
          options={{ width: 8, height: 8 }}
          onInit={a => {
            app = a;
          }}
        >
          <Container>
            {order.map(key => (
              <Sprite key={key} x={key === "a" ? x : 0} />
            ))}
          </Container>
        </Stage>
      );
      const tree = renderer.create(<Scene order={["a", "b"]} x={1} />, {
        createNodeMock: () => document.createElement("canvas"),
      });
      await settle();
      expect(app).not.toBeNull();
      // Captured before unmount: destroying the application nulls app.stage.
      const stage = app.stage;
      const container = stage.children[0];
      expect(container.children).toHaveLength(2);
      expect(container.children[0].x).toBe(1);

      act(() => {
        tree.update(<Scene order={["a", "b"]} x={5} />);
      });
      expect(container.children[0].x).toBe(5);

      act(() => {
        tree.update(<Scene order={["b", "a"]} x={5} />);
      });
      expect(container.children[1].x).toBe(5);
      expect(container.children[0].x).toBe(0);

      act(() => {
        tree.unmount();
      });
      await settle();
      expect(stage.children).toHaveLength(0);
    });

    it("restores a removed prop to its default without a warning under StrictMode, and writes an explicit null", async () => {
      configure(pair());
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      let app: any = null;
      const Scene = (props: { alpha?: null | number; visible?: boolean }) => (
        <Stage
          options={{ width: 8, height: 8 }}
          onInit={a => {
            app = a;
          }}
        >
          <StrictMode>
            <Sprite {...(props as { alpha?: number })} />
          </StrictMode>
        </Stage>
      );
      const tree = renderer.create(<Scene alpha={0.5} visible={false} />, {
        createNodeMock: () => document.createElement("canvas"),
      });
      await settle();
      const sprite = app.stage.children[0];
      expect([sprite.alpha, sprite.visible]).toEqual([0.5, false]);

      act(() => {
        tree.update(<Scene />);
      });
      expect([sprite.alpha, sprite.visible]).toEqual([1, true]);
      expect(error.mock.calls.filter(c => /Received .* for prop/.test(String(c[0])))).toHaveLength(0);

      act(() => {
        tree.update(<Scene alpha={null} />);
      });
      expect(sprite.alpha).toBeNull();

      act(() => {
        tree.unmount();
      });
      await settle();
      error.mockRestore();
    });
  });
}
