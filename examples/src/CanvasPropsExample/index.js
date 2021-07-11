import React from "react";
import { Stage } from "react-pixi-fiber";
import Bunny from "../Bunny";

const OPTIONS = {
  backgroundColor: 0x1099bb,
  height: 600,
  width: 800,
};

function CanvasPropsExample() {
  return (
    <Stage options={OPTIONS} className="bordered" style={{ transform: "scale(0.5)" }}>
      <Bunny x={400} y={300} />
    </Stage>
  );
}

export default CanvasPropsExample;
