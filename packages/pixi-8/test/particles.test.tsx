import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import * as PIXI from "pixi.js";
import react18 from "@react-pixi-fiber/react-18";
import { configure, ParticleContainer, render, Sprite, unmount } from "react-pixi-fiber";
import pixi8, { Particle } from "../src/index";

const texture = PIXI.Texture.WHITE;

describe("ParticleContainer and Particle", () => {
  let root: PIXI.Container;
  beforeEach(() => {
    configure({ react: react18(), pixi: pixi8() });
    root = new PIXI.Container();
  });
  afterEach(() => vi.restoreAllMocks());

  const Scene = ({ order, scaleX = 1 }: { order: string[]; scaleX?: number }) => (
    <ParticleContainer texture={texture}>
      {order.map(key => (
        <Particle key={key} scaleX={key === "a" ? scaleX : 1} texture={texture} x={key === "a" ? 1 : 2} />
      ))}
    </ParticleContainer>
  );

  it("keeps the particles in particleChildren through mount, reorder, removal and unmount", () => {
    render(<Scene order={["a", "b"]} />, root);
    const container = root.children[0] as PIXI.ParticleContainer;
    expect(container).toBeInstanceOf(PIXI.ParticleContainer);
    expect(container.children).toHaveLength(0);
    expect(container.particleChildren.map(p => p.x)).toEqual([1, 2]);
    expect(container.particleChildren[0]).toBeInstanceOf(PIXI.Particle);

    render(<Scene order={["b", "a"]} />, root);
    expect(container.particleChildren.map(p => p.x)).toEqual([2, 1]);

    render(<Scene order={["b"]} />, root);
    expect(container.particleChildren.map(p => p.x)).toEqual([2]);

    expect(() => unmount(root)).not.toThrow();
    expect(root.children).toHaveLength(0);
  });

  it("calls update on the container when a mounted particle changes", () => {
    render(<Scene order={["a"]} />, root);
    const container = root.children[0] as PIXI.ParticleContainer;
    const update = vi.spyOn(container, "update");
    render(<Scene order={["a"]} scaleX={3} />, root);
    expect(container.particleChildren[0].scaleX).toBe(3);
    expect(update).toHaveBeenCalled();
    unmount(root);
  });

  it("throws naming the tags when a display object is rendered under a ParticleContainer", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <ParticleContainer>
          <Sprite texture={texture} />
        </ParticleContainer>,
        root
      )
    ).toThrow("`ParticleContainer` takes only `Particle` children, got `Sprite`.");
  });

  it("throws when a Particle has no texture", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <ParticleContainer>
          {/* @ts-expect-error texture is required */}
          <Particle />
        </ParticleContainer>,
        root
      )
    ).toThrow("`Particle` needs a `texture` prop.");
  });
});
