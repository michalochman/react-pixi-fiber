import React, { Component } from "react";
import { Stage } from "react-pixi-fiber";
import RotatingBunny from "./RotatingBunny";

const OPTIONS = {
  backgroundColor: 0x1099bb,
};

class BunnyExample extends Component {
  render() {
    return (
      <Stage width={800} height={600} options={OPTIONS}>
        <RotatingBunny x={400} y={300} />
      </Stage>
    );
  }
}

export default BunnyExample;
