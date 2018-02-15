import React from "react";
import { Sprite } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import bunny from "./bunny.png";

const centerAnchor = new PIXI.Point(0.5, 0.5);

function Bunny(props) {
  return <Sprite anchor={centerAnchor} texture={PIXI.Texture.fromImage(bunny)} {...props} />;
}

export default Bunny;
