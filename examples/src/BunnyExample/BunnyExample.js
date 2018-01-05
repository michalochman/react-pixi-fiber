import React, { Component } from "react";
import { Stage } from "react-pixi-fiber";
import RotatingBunny from "./RotatingBunny";

class BunnyExample extends Component {
  render() {
    return (
      <Stage width={800} height={600} backgroundColor={0x1099bb}>
        <RotatingBunny x={400} y={300} />
      </Stage>
    );
  }
}

export default BunnyExample;
