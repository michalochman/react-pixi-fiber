import { PIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import { display } from "./pixiLayers";

export type LayerProps = {
  group: unknown;
};

const TYPE = "Layer";

export default PIXIComponent<PIXI.Container, LayerProps>(TYPE, {
  create: ({ group }) => new display.Layer(group),
});
