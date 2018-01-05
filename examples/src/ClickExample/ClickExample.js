import React, { Component } from "react";
import { Stage } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import Bunny from "../Bunny/Bunny";

// Scale mode for all textures, will retain pixelation
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// http://pixijs.io/examples/#/basics/click.js
class ClickExample extends Component {
  state = {
    scale: 1
  };

  handleClick = () => {
    this.setState(state => ({ ...state, scale: state.scale * 1.25 }));
  };

  render() {
    return (
      <Stage width={800} height={600} backgroundColor={0x1099bb}>
        <Bunny
          // Shows hand cursor
          buttonMode
          // Opt-in to interactivity
          interactive
          // Pointers normalize touch and mouse
          pointerdown={this.handleClick}
          scale={new PIXI.Point(this.state.scale, this.state.scale)}
          x={400}
          y={300}
        />
      </Stage>
    );
  }
}

export default ClickExample;
