import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { usePixiTicker, withApp } from "react-pixi-fiber";
import Bunny from "../Bunny";

// http://pixijs.io/examples/#/basics/basic.js
// we don't want to pass app prop further down, it will trigger dev warning
function RotatingBunny({ app, step, ...passedProps }) {
  const [rotation, setRotation] = useState(0);

  const animate = useCallback(
    delta => {
      // just for fun, let's rotate mr rabbit a little
      // delta is 1 if running at 100% performance
      // creates frame-independent tranformation
      setRotation(rotation => rotation + step * delta);
    },
    [step]
  );

  usePixiTicker(animate);

  return <Bunny {...passedProps} rotation={rotation} />;
}
RotatingBunny.propTypes = {
  app: PropTypes.object.isRequired,
  step: PropTypes.number,
};
RotatingBunny.defaultProps = {
  step: 0.1,
};

export default withApp(RotatingBunny);
