import * as PIXI from "pixi.js";
import { type Behavior, getInstanceTag } from "react-pixi-fiber";

// PixiJS 8 constructors spread their options over the class defaults, so a key set to `undefined` would win over the
// default. Only the props that are set are passed.
function defined<T extends Record<string, unknown>>(options: T): T {
  const out = {} as T;
  for (const key in options) if (options[key] !== undefined) out[key] = options[key];
  return out;
}

// A particle has no parent pointer, so a prop change finds the container to `update()` here.
const particleParents = new WeakMap<PIXI.Particle, PIXI.ParticleContainer>();

function asParticle(child: unknown): PIXI.Particle {
  if (!(child instanceof PIXI.Particle)) {
    const tag = getInstanceTag(child as object) ?? String(child);
    throw new Error(`\`ParticleContainer\` takes only \`Particle\` children, got \`${tag}\`.`);
  }
  return child;
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
  Particle: {
    create: p => {
      if (p.texture == null) throw new Error("`Particle` needs a `texture` prop.");
      return new PIXI.Particle(p.texture);
    },
    applyProps(particle: PIXI.Particle, oldProps, newProps) {
      this.applyDisplayObjectProps(oldProps, newProps);
      // Only the dynamic properties are uploaded every frame; the rest waits for `update()`.
      particleParents.get(particle)?.update();
    },
  },
  ParticleContainer: {
    create: p =>
      new PIXI.ParticleContainer(
        defined({
          dynamicProperties: p.dynamicProperties,
          roundPixels: p.roundPixels,
          shader: p.shader,
          texture: p.texture,
        })
      ),
    appendChild(container: PIXI.ParticleContainer, child) {
      const particle = asParticle(child);
      container.removeParticle(particle);
      container.addParticle(particle);
      particleParents.set(particle, container);
    },
    insertBefore(container: PIXI.ParticleContainer, child, before) {
      const particle = asParticle(child);
      container.removeParticle(particle);
      const index = container.particleChildren.indexOf(before as PIXI.Particle);
      if (index === -1) throw new Error("`ParticleContainer` cannot insert a `Particle` before one it does not hold.");
      container.addParticleAt(particle, index);
      particleParents.set(particle, container);
    },
    removeChild(container: PIXI.ParticleContainer, child) {
      container.removeParticle(child as PIXI.Particle);
      particleParents.delete(child as PIXI.Particle);
    },
  },
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
