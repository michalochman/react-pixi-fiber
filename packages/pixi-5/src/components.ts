import * as PIXI from "pixi.js";
import type { Behavior } from "react-pixi-fiber";

function bitmapTextStyle(props: Record<string, any>) {
  return typeof props.style !== "undefined" ? props.style : { align: props.align, font: props.font, tint: props.tint };
}

export const components: Record<string, Behavior> = {
  AnimatedSprite: {
    create: props => new PIXI.AnimatedSprite(props.textures, props.autoUpdate),
  },
  BitmapText: { create: props => new PIXI.BitmapText(props.text, bitmapTextStyle(props)) },
  Container: { create: () => new PIXI.Container() },
  Graphics: { create: props => new PIXI.Graphics(props.geometry) },
  Mesh: { create: props => new PIXI.Mesh(props.geometry, props.shader, props.state, props.drawMode) },
  MeshPlane: { create: props => new PIXI.SimplePlane(props.texture, props.verticesX, props.verticesY) },
  MeshRope: { create: props => new PIXI.SimpleRope(props.texture, props.points, props.textureScale) },
  MeshSimple: {
    create: props => new PIXI.SimpleMesh(props.texture, props.vertices, props.uvs, props.indices, props.drawMode),
  },
  NineSliceSprite: {
    create: props =>
      new PIXI.NineSlicePlane(props.texture, props.leftWidth, props.topHeight, props.rightWidth, props.bottomHeight),
  },
  ParticleContainer: {
    create: props => new PIXI.ParticleContainer(props.maxSize, props.properties, props.batchSize, props.autoResize),
  },
  Sprite: { create: props => new PIXI.Sprite(props.texture) },
  Text: { create: props => new PIXI.Text(props.text, props.style, props.canvas) },
  TilingSprite: { create: props => new PIXI.TilingSprite(props.texture, props.width, props.height) },
};

// The PixiJS 5 class names, the same behavior objects as the core tags they map to.
components.NineSlicePlane = components.NineSliceSprite;
components.SimpleMesh = components.MeshSimple;
components.SimplePlane = components.MeshPlane;
components.SimpleRope = components.MeshRope;
