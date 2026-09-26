import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

export type CircleProps = {
  fill: number;
  radius: number;
  x: number;
  y: number;
};

const TYPE = "Circle";

export default CustomPIXIComponent<PIXI.Graphics, CircleProps>(
  {
    customDisplayObject: () => new PIXI.Graphics(),
    customApplyProps: function (instance, oldProps, newProps) {
      const { fill, x, y, radius, ...newPropsRest } = newProps;
      const { fill: oldFill, radius: oldRadius, ...oldPropsRest }: Partial<CircleProps> = oldProps || {};
      if (typeof oldProps !== "undefined") {
        instance.clear();
      }
      instance.beginFill(fill);
      instance.drawCircle(x, y, radius);
      instance.endFill();

      this.applyDisplayObjectProps(oldPropsRest, newPropsRest);
    },
  },
  TYPE
);
