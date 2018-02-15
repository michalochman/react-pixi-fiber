import React, { Component } from "react";
import { Stage } from "react-pixi-fiber";
import Bunny from "./../Bunny";

const OPTIONS = {
  backgroundColor: 0x10bb99,
  view: document.querySelector("#id_preexisting_canvas"),
};

class ApplicationOptionsExample extends Component {
  render() {
    return (
      <Stage width={800} height={600} options={OPTIONS}>
        <Bunny x={400} y={300} />
      </Stage>
    );
  }
}

export default ApplicationOptionsExample;
