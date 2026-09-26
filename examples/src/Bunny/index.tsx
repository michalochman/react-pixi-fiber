import React from "react";
import PropTypes from "prop-types";
import { Sprite } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import bunnys from "./bunnys.png";

const centerAnchor = new PIXI.Point(0.5, 0.5);

const bunnyTextures = new PIXI.Texture.from(bunnys);
const textures = [
  new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 47, 26, 37)),
  new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 86, 26, 37)),
  new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 125, 26, 37)),
  new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 164, 26, 37)),
  new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 2, 26, 37)),
];

function Bunny({ as: Component, ...passedProps }) {
  const texture = textures[passedProps.texture];
  return <Component anchor={centerAnchor} {...passedProps} texture={texture} />;
}
Bunny.propTypes = {
  as: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  texture: PropTypes.number,
};
Bunny.defaultProps = {
  as: Sprite,
  texture: 0,
};

export default Bunny;
