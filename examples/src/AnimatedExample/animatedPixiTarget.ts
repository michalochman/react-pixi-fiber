import { Sprite, applyDisplayObjectProps } from "react-pixi-fiber";
import * as Animated from "animated";
import * as PIXI from "pixi.js";

function ApplyAnimatedValues(instance, props) {
  if (instance instanceof PIXI.DisplayObject) {
    // Component has custom way of applying props - use that
    if (typeof instance._customApplyProps === "function") {
      instance._customApplyProps(instance, {}, props);
    } else {
      // TODO check if this is safe
      const type = instance.constructor.name;
      applyDisplayObjectProps(type, instance, {}, props);
    }
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
