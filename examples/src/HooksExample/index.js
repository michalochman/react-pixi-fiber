import React, { Fragment, useState } from "react";
import { Stage, usePixiTicker } from "react-pixi-fiber";
import Circle from "../CustomPIXIComponentExample/Circle";
import Rect from "../CustomPIXIComponentExample/Rect";

// returns a base 10 translation of a gray scale hex string build from a single
// number between 0 and 255. if num is > 255 or < 0 it's clamped to the limit.
const grayFromNum = num => {
  const hex = ("00" + Math.max(0, Math.min(255, num)).toString(16)).substr(-2);
  return parseInt(`${hex.repeat(3)}`, 16);
};

function useAnimatedValue({ direction, max, min, value }) {
  const [data, setData] = useState({
    direction,
    value,
  });

  usePixiTicker(() => {
    // perform all the logic inside setData so useEffect's dependency array
    // can be empty so it will only trigger one on initial render and not
    // add and remove from ticker constantly.
    setData(current => {
      const data = { ...current };

      if ((current.value >= max && current.direction === 1) || (current.value <= min && current.direction === -1)) {
        data.direction *= -1;
      }
      data.value += data.direction;

      return data;
    });
  }, [direction, max, min, value, setData]);

  return data.value;
}

const Animation = () => {
  const number1 = useAnimatedValue({ direction: 1, max: 255, min: 0, value: 0 });
  const number2 = useAnimatedValue({ direction: -1, max: 255, min: 0, value: 255 });

  return (
    <Fragment>
      <Rect x={275} y={175} width={250} height={250} fill={grayFromNum(number1)} />
      <Circle x={400} y={300} radius={100} fill={grayFromNum(number2)} />
    </Fragment>
  );
};

const HooksExample = () => {
  return (
    <Stage width={800} height={600} options={{ backgroundColor: 0xff0000 }}>
      <Animation />
    </Stage>
  );
};

export default HooksExample;
