import React, { Component } from "react";
import PropTypes from "prop-types";
import { Stage } from "react-pixi-fiber";
import Bunnymark from "./Bunnymark";

class BunnymarkExample extends Component {
  render() {
    return (
      <Stage width={800} height={600} backgroundColor={0x1099bb}>
        <Bunnymark />
      </Stage>
    );
  }
}
BunnymarkExample.contextTypes = {
  app: PropTypes.object
};

export default BunnymarkExample;
