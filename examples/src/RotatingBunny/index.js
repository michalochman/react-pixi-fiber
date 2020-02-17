import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { usePixiTicker } from "react-pixi-fiber";
import Bunny from "../Bunny";

// http://pixijs.io/examples/#/basics/basic.js
function RotatingBunny({ step = 0.1, ...passedProps }) {
  const [rotation, setRotation] = useState(0);
  const animate = useCallback(
    delta => {
      // just for fun, let's rotate mr rabbit a little
      // delta is 1 if running at 100% performance
      // creates frame-independent tranformation
      setRotation(rotation => {
        // uncomment this to see concurrent mode and dev build bug, observe timestamps and value of rotation
        // console.log("setRotation", rotation + step * delta);
        return rotation + step * delta;
      });
    },
    [step]
  );

  // TODO:
  // When using concurrent mode and dev build results in double render by React (to better surface bugs),
  // but for some reason it doesn't play well with PIXI.Ticker.
  // Investigate why setRotation is called 4 times instead of 2.
  // The issue exists for both Class and Function Components.
  // This is not an issue when production build is used.
  usePixiTicker(animate);

  return <Bunny {...passedProps} rotation={rotation} />;
}
RotatingBunny.propTypes = {
  step: PropTypes.number,
};

export default RotatingBunny;
