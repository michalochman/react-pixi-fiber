import React, { Component } from "react";
import { Container, CustomPIXIProperty, Sprite, Stage } from "react-pixi-fiber";
import RotatingBunny from "../RotatingBunny";

const OPTIONS = {
  backgroundColor: 0x1099bb,
  height: 600,
  width: 800,
};

CustomPIXIProperty(Sprite, "id", value => typeof value === "number");

class CustomPIXIPropertyExample extends Component {
  render() {
    return (
      <Stage options={OPTIONS}>
        <Container>
          <RotatingBunny x={400} y={300} texture={0} name="regular" step={0.1} bunnyName="Regular" id={1} />
          <RotatingBunny x={200} y={200} texture={1} name="cool" step={0.2} bunnyName="Cool" id={2} />
          <RotatingBunny x={200} y={400} texture={2} name="sport" step={-0.25} bunnyName="Sport" id="3" />
          <React.StrictMode>
            {/* id will be reported in this tree as invalid prop (string instead of number) */}
            <RotatingBunny x={600} y={200} texture={3} name="cyborg" step={-0.1} bunnyName="Cyborg" id="4" />
            {/* bunnyName will be reported in this tree as unknown prop */}
            <RotatingBunny x={600} y={400} texture={4} name="astronaut" step={-0.02} bunnyName="Astronaut" id={5} />
          </React.StrictMode>
        </Container>
      </Stage>
    );
  }
}

export default CustomPIXIPropertyExample;
