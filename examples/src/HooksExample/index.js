import React, {
  useEffect,
  useState,
} from "react";
import { Stage } from "react-pixi-fiber";
import Circle from "./Circle";
import Rect from "../CustomPIXIComponentExample/Rect";

// returns a base 10 translation of a gray scale hex string build from a single
// number between 0 and 255. if num is > 255 or < 0 it's clamped to the limit.
const grayFromNum = num => {
  const hex = ("00" + Math.max(0, Math.min(255, num)).toString(16)).substr(-2);
  return parseInt(`${hex.repeat(3)}`, 16);
};

const HooksExample = props => {
  const [data, setData] = useState({
    position: 255,
    direction: -1
  });

  useEffect(() => {
    let animationId;
    const UP = 1;
    const DOWN = -1;
    const update = () => {
      // perform all the logic inside setData so useEffect's dependency array
      // can be empty so it will only trigger one on initial render and not
      // request and cancel animation frames constantly.
      setData(current => {
        const newData = { ...current };

        if (current.position >= 255 && current.direction === UP) {
          newData.direction = DOWN;
        } else if (current.position <= 0 && current.direction === DOWN) {
          newData.direction = UP;
        }
        newData.position += newData.direction;
        return newData;
      });

      animationId = requestAnimationFrame(update);
    };

    animationId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <Stage width={800} height={600} options={{ backgroundColor: 0xff0000 }}>
      <Rect x={275} y={175} width={250} height={250} fill={grayFromNum(255 - data.position)} />
      <Circle x={400} y={300} radius={100} fill={grayFromNum(data.position)} />
    </Stage>
  );
};

export default HooksExample;
