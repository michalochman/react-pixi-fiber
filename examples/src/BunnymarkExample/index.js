import React, { Component } from "react";
import { Stage } from "react-pixi-fiber";
import Bunnymark from "./Bunnymark";

const OPTIONS = {
  backgroundColor: 0x1099bb,
  height: 600,
  width: 800,
};

class BunnymarkExample extends Component {
  render() {
    return (
      <Stage options={OPTIONS}>
        <Bunnymark />
      </Stage>
    );
  }
}

export default BunnymarkExample;
