import React, { Component } from "react";
import { Stage } from "react-pixi-fiber";
import CustomBunnymark from "./CustomBunnymark";

const OPTIONS = {
  backgroundColor: 0x1099bb,
};

class CustomBunnymarkExample extends Component {
  render() {
    return (
      <Stage width={800} height={600} options={OPTIONS}>
        <CustomBunnymark />
      </Stage>
    );
  }
}

export default CustomBunnymarkExample;
