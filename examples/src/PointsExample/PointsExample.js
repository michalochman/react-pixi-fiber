import React, { Component } from "react";
import { Stage } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import Bunny from "../Bunny";

// Scale mode for all textures, will retain pixelation
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const WIDTH = 800;
const HEIGHT = 600;
const OPTIONS = {
  backgroundColor: 0x1099bb,
};

class PointsExample extends Component {
  constructor() {
    super();

    this.randomPosition = new PIXI.ObservablePoint(
      this.bunnyHasMoved,
      this,
      Math.random() * WIDTH,
      Math.random() * HEIGHT
    );
  }

  bunnyHasMoved = () => {
    this.forceUpdate(() => {
      console.log(`Bunny has moved to ${this.randomPosition.x},${this.randomPosition.y}`);
    });
  };

  escape = () => {
    this.randomPosition.set(Math.random() * WIDTH, Math.random() * HEIGHT);
  };

  render() {
    return (
      <Stage width={WIDTH} height={HEIGHT} options={OPTIONS}>
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
        {/* Position via explicit PIXI.ObservablePoint */}
        <Bunny
          // Opt-in to interactivity
          interactive
          // Pointers normalize touch and mouse
          pointerover={this.escape}
          position={this.randomPosition}
        />
      </Stage>
    );
  }
}

export default PointsExample;
