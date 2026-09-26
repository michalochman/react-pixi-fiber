import React from "react";
import { Stage } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import Bunny from "../Bunny";

// Scale mode for all textures, will retain pixelation
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const WIDTH = 800;
const HEIGHT = 600;
const OPTIONS = {
  backgroundColor: 0x1099bb,
  height: HEIGHT,
  width: WIDTH,
};

function PointsExample() {
  return (
    <Stage options={OPTIONS}>
      {/* Position via single value of X as string */}
      <Bunny position="75" />
      {/* Position via single value of X as number */}
      <Bunny position={150} />
      {/* Position via single value of X in array */}
      <Bunny position={[225]} />
      {/* Position via list of X and Y as comma delimited string */}
      <Bunny position="300,300" />
      {/* Position via single value of X as string */}
      <Bunny position={[375, 375]} />
      {/* Position via list of X and Y in array */}
      <Bunny position={{ x: 450, y: 450 }} />
      {/* Position via explicit PIXI.Point */}
      <Bunny position={new PIXI.Point(525, 525)} />
    </Stage>
  );
}

export default PointsExample;
