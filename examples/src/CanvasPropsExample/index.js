import React, { Component } from "react";
import { Stage } from "react-pixi-fiber";
import Bunny from "../Bunny";

const OPTIONS = {
  backgroundColor: 0x1099bb,
};

class CanvasPropsExample extends Component {
  render() {
    return (
      <Stage width={800} height={600} options={OPTIONS} className="bordered" style={{ transform: "scale(0.5)" }}>
        <Bunny x={400} y={300} />
      </Stage>
    );
  }
}

export default CanvasPropsExample;
