import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

const PARTICLE = "Particle";
export const behavior = {
  customDisplayObject: props => new PIXI.Sprite(props.texture),
  customApplyProps: function(instance, oldProps, newProps) {
    if (typeof oldProps !== "undefined" && Object.keys(oldProps).length === 0) {
      return;
    }

    this.applyDisplayObjectProps(oldProps, newProps);
  },
};
export default CustomPIXIComponent(behavior, PARTICLE);
