import React, { Component } from "react";
import { Stage } from "react-pixi-fiber";
import CustomBunnymark from "./CustomBunnymark";

class CustomBunnymarkExample extends Component {
  render() {
    return (
      <Stage width={800} height={600} backgroundColor={0x1099bb}>
        <CustomBunnymark />
      </Stage>
    );
  }
}

export default CustomBunnymarkExample;
