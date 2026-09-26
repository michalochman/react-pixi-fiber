import React from "react";
import { Stage } from "react-pixi-fiber";
import Bunnymark from "./Bunnymark";

const OPTIONS = {
  backgroundColor: 0x1099bb,
  height: 600,
  width: 800,
};

function BunnymarkExample() {
  return (
    <Stage options={OPTIONS}>
      <Bunnymark />
    </Stage>
  );
}

export default BunnymarkExample;
