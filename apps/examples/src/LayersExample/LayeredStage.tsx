import { PIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import { display } from "./pixiLayers";

// No custom props, the stage is always sortable
export type LayeredStageProps = {};

type LayeredStageInstance = PIXI.Container & {
  _updateStageRafId: number;
  updateStage: () => void;
};

const TYPE = "LayeredStage";

export default PIXIComponent<LayeredStageInstance, LayeredStageProps>(TYPE, {
  create: () => {
    const stage: LayeredStageInstance = new display.Stage();
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
