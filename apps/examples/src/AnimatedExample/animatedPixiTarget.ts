import { Sprite, applyProps } from "react-pixi-fiber";
import * as Animated from "animated";
import * as PIXI from "pixi.js";

type Props = Record<string, unknown>;

function ApplyAnimatedValues(instance: unknown, props: Props) {
  if (instance instanceof PIXI.DisplayObject) {
    applyProps(instance, {}, props);
  } else {
    return false;
  }
}

function mapStyle(style: unknown) {
  return style;
}

Animated.inject.ApplyAnimatedValues(ApplyAnimatedValues, mapStyle);

const ReactPixiFiberAnimated = {
  ...Animated,
  Sprite: Animated.createAnimatedComponent(Sprite),
};

export default ReactPixiFiberAnimated;
