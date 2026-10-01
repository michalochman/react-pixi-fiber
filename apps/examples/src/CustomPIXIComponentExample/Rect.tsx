import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

export type RectProps = {
  fill: number;
  height: number;
  width: number;
  x: number;
  y: number;
};

const TYPE = "Rect";

export default CustomPIXIComponent<PIXI.Graphics, RectProps>(
  {
    customDisplayObject: () => new PIXI.Graphics(),
    customApplyProps: function (instance, oldProps, newProps) {
      const { fill, x, y, width, height, ...newPropsRest } = newProps;
      const {
        fill: oldFill,
        x: oldX,
        y: oldY,
        width: oldWidth,
        height: oldHeight,
        ...oldPropsRest
      }: Partial<RectProps> = oldProps || {};
      if (typeof oldProps !== "undefined") {
        instance.clear();
      }
      instance.beginFill(fill);
      instance.drawRect(x, y, width, height);
      instance.endFill();

      this.applyDisplayObjectProps(oldPropsRest, newPropsRest);
    },
  },
  TYPE
);
