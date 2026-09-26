import React from "react";
import { Sprite } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import bunnys from "./bunnys.png";

const centerAnchor = new PIXI.Point(0.5, 0.5);

const bunnyTextures = PIXI.Texture.from(bunnys);
const textures = [
  new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 47, 26, 37)),
  new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 86, 26, 37)),
  new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 125, 26, 37)),
  new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 164, 26, 37)),
  new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 2, 26, 37)),
];

export type BunnyProps = Omit<React.ComponentProps<typeof Sprite>, "texture"> & {
  // Component used to render the bunny, e.g. `Animated.Sprite`
  as?: React.ComponentType<any>;
  // Index of the bunny in the sprite sheet
  texture?: number;
};

function Bunny({ as: Component = Sprite, texture = 0, ...passedProps }: BunnyProps) {
  return <Component anchor={centerAnchor} {...passedProps} texture={textures[texture]} />;
}

export default Bunny;
