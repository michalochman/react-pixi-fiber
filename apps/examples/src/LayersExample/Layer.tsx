import { PIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import { Group, Layer as PixiLayer } from "@pixi/layers";

export type LayerProps = {
  group: Group;
};

const TYPE = "Layer";

export default PIXIComponent<PIXI.Container, LayerProps>(TYPE, {
  create: ({ group }) => new PixiLayer(group),
});
