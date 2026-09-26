import React from "react";
import { Container } from "react-pixi-fiber";
import Bunny from "../Bunny";
import Rect from "../CustomPIXIComponentExample/Rect";

type ColoredBunnyProps = React.ComponentProps<typeof Container> & {
  fill: number;
};

function ColoredBunny({ fill, ...rest }: ColoredBunnyProps) {
  return (
    <Container {...rest}>
      <Rect x={-21} y={-21} width={42} height={42} fill={0x0} />
      <Rect x={-20} y={-20} width={40} height={40} fill={fill} />
      <Bunny />
    </Container>
  );
}

export default ColoredBunny;
