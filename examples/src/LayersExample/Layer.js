/*global PIXI*/
import { CustomPIXIComponent } from "react-pixi-fiber";

const TYPE = "Layer";
const behavior = {
  customDisplayObject: ({ group }) => new PIXI.display.Layer(group),
};

export default CustomPIXIComponent(behavior, TYPE);
