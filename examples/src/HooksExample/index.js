import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Stage, Text, usePixiTicker } from "react-pixi-fiber";
import Circle from "../CustomPIXIComponentExample/Circle";
import Rect from "../CustomPIXIComponentExample/Rect";

// returns a base 10 translation of a gray scale hex string build from a single
// number between 0 and 255. if num is > 255 or < 0 it's clamped to the limit.
const grayFromNum = num => {
  const hex = ("00" + Math.max(0, Math.min(255, num)).toString(16)).substr(-2);
  return parseInt(`${hex.repeat(3)}`, 16);
};

/**
 * Implements `react-pixi-fiber`'s `usePixiTicker` hook, and the `useState` hook.
 * Handles animation of the circle and square background.
 */
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

      // flip direction once min or max has been reached.
      if ((current.value >= max && current.direction === 1) || (current.value <= min && current.direction === -1)) {
        data.direction *= -1;
      }

      // increment or decrement `
      data.value += data.direction;

      return data;
    });
  }, [direction, max, min, value, setData]);

  return data.value;
}

const AnimationContext = React.createContext();

/**
 * implements `useContext`, `useEffect` and `useRef`.
 */
const Title = () => {
  const { title } = useContext(AnimationContext);
  const pixiText = useRef(null);

  // horizontally center the title's pivot point. this also works fine with `useEffect`.
  useEffect(() => {
    pixiText.current.pivot.set(pixiText.current.width / 2, 0);
  }, [title]);

  return <Text ref={pixiText} text={title} x={400} y={0} />;
};

const Animation = () => {
  const number1 = useAnimatedValue({ direction: 1, max: 255, min: 0, value: 0 });
  const number2 = useAnimatedValue({ direction: -1, max: 255, min: 0, value: 255 });
  const [text1, setText1] = useState(`number1: ${number1}`);
  const [text2, setText2] = useState(`number2: ${number2}`);

  // update the contents of the `Text` instances.
  useEffect(() => {
    setText1(`number1: ${number1}`);
    setText2(`number2: ${number2}`);
  }, [number1, number2]);

  return (
    <Fragment>
      <Title />
      <Rect x={275} y={175} width={250} height={250} fill={grayFromNum(number1)} />
      <Circle x={400} y={300} radius={100} fill={grayFromNum(number2)} />
      <Text text={text1} x={0} y={500} />
      <Text text={text2} x={0} y={550} />
    </Fragment>
  );
};

const HooksExample = () => {
  if (typeof useState === "function") {
    return (
      <Stage options={{ backgroundColor: 0xff0000, height: 600, width: 800 }}>
        <AnimationContext.Provider value={{ title: "animation" }}>
          <Animation />
        </AnimationContext.Provider>
      </Stage>
    );
  } else {
    return (
      <Stage options={{ backgroundColor: 0xff0000, height: 600, width: 800 }}>
        <Text text={`Sorry, your version of React (${React.version}) doesn't support hooks.`} x={0} y={500} />
      </Stage>
    );
  }
};

export default HooksExample;
