import React, { useCallback, useRef } from "react";
import { Stage } from "react-pixi-fiber";
import Animated from "./animatedPixiTarget";
import * as PIXI from "pixi.js";
import Bunny from "../Bunny";

const OPTIONS = {
  backgroundColor: 0x1099bb,
  height: 600,
  width: 800,
};

const centerAnchor = new PIXI.Point(0.5, 0.5);

function BunnyExample() {
  const animationProgress = useRef(new Animated.Value(0));
  const handleDown = useCallback(() => {
    Animated.spring(animationProgress.current, { toValue: 1 }).start();
  }, []);
  const handleUp = useCallback(() => {
    Animated.spring(animationProgress.current, { toValue: 0 }).start();
  }, []);

  return (
    <Stage options={OPTIONS}>
      <Bunny
        anchor={centerAnchor}
        as={Animated.Sprite}
        interactive
        pointerdown={handleDown}
        pointerup={handleUp}
        position="400,300"
        rotation={animationProgress.current.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.PI * 2],
        })}
        scale={animationProgress.current.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 8],
        })}
      />
    </Stage>
  );
}

export default BunnyExample;
