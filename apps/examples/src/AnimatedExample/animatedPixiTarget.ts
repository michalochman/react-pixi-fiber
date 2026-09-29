import { Sprite, applyDisplayObjectProps, applyProps, getInstanceTag } from "react-pixi-fiber";
import * as Animated from "animated";
import * as PIXI from "pixi.js";

type Props = Record<string, unknown>;

function ApplyAnimatedValues(instance: unknown, props: Props) {
  if (instance instanceof PIXI.DisplayObject) {
    // A `PIXIComponent` instance knows its tag and applies props the way its component does
    if (getInstanceTag(instance) !== undefined) {
      applyProps(instance, {}, props);
    } else {
      // TODO check if this is safe
      const type = instance.constructor.name;
      applyDisplayObjectProps<PIXI.DisplayObject, Props>(type, instance, {}, props);
    }
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
