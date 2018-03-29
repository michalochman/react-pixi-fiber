import React, { Component } from "react";
import { Container, Stage } from "react-pixi-fiber";
import RotatingBunny from "./RotatingBunny";

const OPTIONS = {
  backgroundColor: 0x1099bb,
};

class BunnyExample extends Component {
  render() {
    return (
      <Stage width={800} height={600} options={OPTIONS}>
        <Container>
          <RotatingBunny x={400} y={300} texture={0} name="regular" step={0.1} />
          <RotatingBunny x={200} y={200} texture={1} name="cool" step={0.2} />
          <RotatingBunny x={200} y={400} texture={2} name="sport" step={-0.25} />
          <RotatingBunny x={600} y={200} texture={3} name="cyborg" step={-0.1} />
          <RotatingBunny x={600} y={400} texture={4} name="astronaut" step={-0.02} />
        </Container>
      </Stage>
    );
  }
}

export default BunnyExample;
