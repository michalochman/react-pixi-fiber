import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import { display } from "./pixiLayers";

// No custom props, the stage is always sortable
export type LayeredStageProps = {};

type LayeredStageInstance = PIXI.Container & {
  _updateStageRafId: number;
  updateStage: () => void;
};

const TYPE = "LayeredStage";

export default CustomPIXIComponent<LayeredStageInstance, LayeredStageProps>(
  {
    customDisplayObject: () => {
      const stage: LayeredStageInstance = new display.Stage();
      stage.sortableChildren = true;
      return stage;
    },
    customDidAttach: instance => {
      const updateStage = () => {
        instance.updateStage();
        instance._updateStageRafId = window.requestAnimationFrame(updateStage);
      };
      updateStage();
    },
    customWillDetach: instance => {
      window.cancelAnimationFrame(instance._updateStageRafId);
      instance.destroy();
    },
  },
  TYPE
);
