import React, { Component } from "react";
import { Stage } from "react-pixi-fiber";
import Bunny from "./../Bunny";
import * as PIXI from "pixi.js";

const app = new PIXI.Application({
  backgroundColor: 0xbb9910,
  height: 600,
  view: document.querySelector("#id_preexisting_canvas"),
  width: 800,
});

class CustomApplicationExample extends Component {
  render() {
    return (
      <Stage app={app}>
        <Bunny x={400} y={300} />
      </Stage>
    );
  }
}

export default CustomApplicationExample;
