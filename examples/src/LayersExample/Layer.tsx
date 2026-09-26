import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import { display } from "./pixiLayers";

export type LayerProps = {
  group: unknown;
};

const TYPE = "Layer";

export default CustomPIXIComponent<PIXI.Container, LayerProps>(
  {
    customDisplayObject: ({ group }) => new display.Layer(group),
  },
  TYPE
);
