import { PIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import { Stage as LayersStage } from "@pixi/layers";

// No custom props, the stage is always sortable
export type LayeredStageProps = {};

type LayeredStageInstance = LayersStage & {
  _updateStageRafId: number;
};

const TYPE = "LayeredStage";

export default PIXIComponent<LayeredStageInstance, LayeredStageProps>(TYPE, {
  create: () => {
    const stage = new LayersStage() as LayeredStageInstance;
    stage.sortableChildren = true;
    return stage;
  },
  afterAdd: instance => {
    const updateStage = () => {
      instance.updateStage();
      instance._updateStageRafId = window.requestAnimationFrame(updateStage);
    };
    updateStage();
  },
  beforeRemove: instance => {
    window.cancelAnimationFrame(instance._updateStageRafId);
    instance.destroy();
  },
});
