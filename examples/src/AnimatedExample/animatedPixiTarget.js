import { Sprite, applyDisplayObjectProps } from "react-pixi-fiber";
import * as Animated from "animated";
import * as PIXI from "pixi.js";

function ApplyAnimatedValues(instance, props) {
  if (instance instanceof PIXI.DisplayObject) {
    applyDisplayObjectProps(instance, {}, props);
  } else {
    return false;
  }
}

function mapStyle(style) {
  return style;
}

Animated.inject.ApplyAnimatedValues(ApplyAnimatedValues, mapStyle);

const ReactPixiFiberAnimated = {
  ...Animated,
  Sprite: Animated.createAnimatedComponent(Sprite),
};

export default ReactPixiFiberAnimated;
