import React, { Component } from "react";
import { Stage } from "react-pixi-fiber";
import Bunnymark from "./Bunnymark";

const OPTIONS = {
  backgroundColor: 0x1099bb,
};

class BunnymarkExample extends Component {
  render() {
    return (
      <Stage width={800} height={600} options={OPTIONS}>
        <Bunnymark />
      </Stage>
    );
  }
}

export default BunnymarkExample;
