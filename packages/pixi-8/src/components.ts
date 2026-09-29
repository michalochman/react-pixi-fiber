import * as PIXI from "pixi.js";
import type { Behavior } from "react-pixi-fiber";

// PixiJS 8 constructors spread their options over the class defaults, so a key set to `undefined` would win over the
// default. Only the props that are set are passed.
function defined<T extends Record<string, unknown>>(options: T): T {
  const out = {} as T;
  for (const key in options) if (options[key] !== undefined) out[key] = options[key];
  return out;
}

function unsupported(tag: string, why: string): Behavior {
  return {
    create() {
      throw new Error(`\`${tag}\` is not available on \`@react-pixi-fiber/pixi-8\`. ${why}`);
    },
  };
}

export const components: Record<string, Behavior> = {
  AnimatedSprite: { create: p => new PIXI.AnimatedSprite(p.textures, p.autoUpdate) },
  BitmapText: { create: p => new PIXI.BitmapText(defined({ style: p.style, text: p.text })) },
  Container: { create: () => new PIXI.Container() },
  DOMContainer: { create: p => new PIXI.DOMContainer(defined({ anchor: p.anchor, element: p.element })) },
  Graphics: { create: p => new PIXI.Graphics(p.context) },
  HTMLText: { create: p => new PIXI.HTMLText(defined({ style: p.style, text: p.text })) },
  Mesh: {
    create: p => new PIXI.Mesh(defined({ geometry: p.geometry, shader: p.shader, state: p.state, texture: p.texture })),
  },
  MeshPlane: {
    create: p => new PIXI.MeshPlane(defined({ texture: p.texture, verticesX: p.verticesX, verticesY: p.verticesY })),
  },
  MeshRope: {
    create: p => new PIXI.MeshRope(defined({ points: p.points, texture: p.texture, textureScale: p.textureScale })),
  },
  MeshSimple: {
    create: p =>
      new PIXI.MeshSimple(
        defined({ indices: p.indices, texture: p.texture, topology: p.topology, uvs: p.uvs, vertices: p.vertices })
      ),
  },
  NineSliceSprite: {
    create: p =>
      new PIXI.NineSliceSprite(
        defined({
          bottomHeight: p.bottomHeight,
          leftWidth: p.leftWidth,
          rightWidth: p.rightWidth,
          texture: p.texture,
          topHeight: p.topHeight,
        })
      ),
  },
  ParticleContainer: unsupported(
    "ParticleContainer",
    "On PixiJS 8 its children are `Particle` objects, not display objects, so React cannot manage them. Use a `PIXIComponent` that owns the particles."
  ),
  PerspectiveMesh: {
    create: p =>
      new PIXI.PerspectiveMesh(
        defined({
          texture: p.texture,
          verticesX: p.verticesX,
          verticesY: p.verticesY,
          x0: p.x0,
          x1: p.x1,
          x2: p.x2,
          x3: p.x3,
          y0: p.y0,
          y1: p.y1,
          y2: p.y2,
          y3: p.y3,
        })
      ),
  },
  RenderContainer: {
    create: p =>
      new PIXI.RenderContainer(defined({ addBounds: p.addBounds, containsPoint: p.containsPoint, render: p.render })),
  },
  RenderLayer: { create: () => new PIXI.RenderLayer() },
  Sprite: { create: p => new PIXI.Sprite(p.texture) },
  Text: { create: p => new PIXI.Text(defined({ style: p.style, text: p.text })) },
  TilingSprite: {
    create: p => new PIXI.TilingSprite(defined({ height: p.height, texture: p.texture, width: p.width })),
  },
};
