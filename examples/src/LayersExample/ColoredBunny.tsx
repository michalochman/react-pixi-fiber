import React from "react";
import PropTypes from "prop-types";
import { Container } from "react-pixi-fiber";
import Bunny from "../Bunny";
import Rect from "../CustomPIXIComponentExample/Rect";

function ColoredBunny({ fill, ...rest }) {
  return (
    <Container {...rest}>
      <Rect x={-21} y={-21} width={42} height={42} fill={0x0} />
      <Rect x={-20} y={-20} width={40} height={40} fill={fill} />
      <Bunny />
    </Container>
  );
}

ColoredBunny.propTypes = {
  fill: PropTypes.number.isRequired,
};

export default ColoredBunny;
