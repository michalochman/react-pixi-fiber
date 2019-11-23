import React, { Component } from "react";
import { Stage } from "react-pixi-fiber";
import CustomBunnymark from "./CustomBunnymark";

const OPTIONS = {
  backgroundColor: 0x1099bb,
  height: 600,
  width: 800,
};

class CustomBunnymarkExample extends Component {
  render() {
    return (
      <Stage options={OPTIONS}>
        <CustomBunnymark />
      </Stage>
    );
  }
}

export default CustomBunnymarkExample;
