import React, { Component } from "react";
import { Stage } from "react-pixi-fiber";
import RotatingBunny from "../RotatingBunny";
import * as PIXI from "pixi.js";

class CustomApplicationExample extends Component {
  componentDidMount() {
    const canvas = document.createElement("canvas");
    this.div.appendChild(canvas);

    this.app = new PIXI.Application({
      backgroundColor: 0xbb9910,
      height: 600,
      view: canvas,
      width: 800,
    });

    this.forceUpdate();
  }

  componentWillUnmount() {
    this.app.destroy(true, true);
  }

  render() {
    return (
      <div ref={div => (this.div = div)}>
        {this.app && (
          <Stage app={this.app}>
            <RotatingBunny x={400} y={300} scale={4} />
          </Stage>
        )}
      </div>
    );
  }
}

export default CustomApplicationExample;
