import * as PIXI from "pixi.js";
import type { PixiAdapter } from "./types";

// The in-core PixiJS 6 adapter (the same class names exist on 7). Task 12 moves it to `@react-pixi-fiber/pixi-6`.
// There is no per-tag prop list (decision 1).

function bitmapTextStyle(props: Record<string, any>) {
  return typeof props.style !== "undefined" ? props.style : { align: props.align, font: props.font, tint: props.tint };
}

const builtins: PixiAdapter = {
  components: {
    Container: { create: () => new PIXI.Container() },
    Sprite: { create: props => new PIXI.Sprite(props.texture) },
    AnimatedSprite: {
      create: props => new PIXI.AnimatedSprite(props.textures, props.autoUpdate),
    },
    Text: { create: props => new PIXI.Text(props.text, props.style, props.canvas) },
    BitmapText: { create: props => new PIXI.BitmapText(props.text, bitmapTextStyle(props)) },
    Graphics: { create: props => new PIXI.Graphics(props.geometry) },
    TilingSprite: { create: props => new PIXI.TilingSprite(props.texture, props.width, props.height) },
    NineSliceSprite: {
      create: props =>
        new PIXI.NineSlicePlane(props.texture, props.leftWidth, props.topHeight, props.rightWidth, props.bottomHeight),
    },
    ParticleContainer: {
      create: props => new PIXI.ParticleContainer(props.maxSize, props.properties, props.batchSize, props.autoResize),
    },
    Mesh: { create: props => new PIXI.Mesh(props.geometry, props.shader, props.state, props.drawMode) },
    MeshSimple: {
      create: props => new PIXI.SimpleMesh(props.texture, props.vertices, props.uvs, props.indices, props.drawMode),
    },
    MeshPlane: { create: props => new PIXI.SimplePlane(props.texture, props.verticesX, props.verticesY) },
    MeshRope: { create: props => new PIXI.SimpleRope(props.texture, props.points, props.textureScale) },
  },
  properties: {
    boolean: [
      "autoResize",
      "buttonMode",
      "cacheAsBitmap",
      "interactive",
      "interactiveChildren",
      "isMask",
      "nativeLines",
      "renderable",
      "roundPixels",
      "uvRespectAnchor",
      "visible",
    ],
    positiveNumeric: ["alpha", "fillAlpha", "height", "lineColor", "maxWidth", "resolution", "tint", "width"],
    numeric: ["boundsPadding", "clampMargin", "rotation", "x", "y"],
    vector: ["anchor", "pivot", "position", "scale", "skew", "tilePosition", "tileScale"],
    callback: [
      // pixi.js < 7.0
      "added",
      "click",
      "mousedown",
      "mousemove",
      "mouseout",
      "mouseover",
      "mouseup",
      "mouseupoutside",
      "pointercancel",
      "pointerdown",
      "pointermove",
      "pointerout",
      "pointerover",
      "pointertap",
      "pointerup",
      "pointerupoutside",
      "removed",
      "rightclick",
      "rightdown",
      "rightup",
      "rightupoutside",
      "tap",
      "touchcancel",
      "touchend",
      "touchendoutside",
      "touchmove",
      "touchstart",
      // pixi.js >= 7.1
      "onclick",
      "onmousedown",
      "onmouseenter",
      "onmouseleave",
      "onmousemove",
      "onmouseout",
      "onmouseover",
      "onmouseup",
      "onmouseupoutside",
      "onpointercancel",
      "onpointerdown",
      "onpointerenter",
      "onpointerleave",
      "onpointermove",
      "onpointerout",
      "onpointerover",
      "onpointertap",
      "onpointerup",
      "onpointerupoutside",
      "onrightclick",
      "onrightdown",
      "onrightup",
      "onrightupoutside",
      "ontap",
      "ontouchcancel",
      "ontouchend",
      "ontouchendoutside",
      "ontouchmove",
      "ontouchstart",
      "onwheel",
    ],
  },
  isPoint: (value): value is PIXI.IPointData => value instanceof PIXI.Point || value instanceof PIXI.ObservablePoint,
  copyPoint: (target, value) => {
    (target as PIXI.Point).copyFrom(value as PIXI.IPointData);
  },
  createApplication: options => new PIXI.Application(options),
  destroyApplication: (app, removeView, stageOptions) => {
    app.destroy(removeView, stageOptions);
  },
  isApplication: value => value instanceof PIXI.Application,
};

export default builtins;
