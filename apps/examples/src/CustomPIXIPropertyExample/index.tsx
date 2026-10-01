import React from "react";
import { Container, PIXIProperty, Sprite, Stage } from "react-pixi-fiber";
import RotatingBunnyComponent from "../RotatingBunny";

const OPTIONS = {
  backgroundColor: 0x1099bb,
  height: 600,
  width: 800,
};

// Register `id` as a legal prop on `Sprite` in development, validated as number.
PIXIProperty(Sprite, "id", value => typeof value === "number");

// TypeScript cannot know about custom properties registered at runtime, so widen the props type here.
// `bunnyName` is intentionally not registered and `id` is intentionally allowed to be a string to trigger dev warnings.
type CustomProps = {
  bunnyName?: string;
  id?: number | string;
};
const RotatingBunny = RotatingBunnyComponent as React.ComponentType<
  React.ComponentProps<typeof RotatingBunnyComponent> & CustomProps
>;

function CustomPIXIPropertyExample() {
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

export default CustomPIXIPropertyExample;
