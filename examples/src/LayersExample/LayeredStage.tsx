import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import { display } from "./pixiLayers";

export type LayeredStageProps = {
  enableSort?: boolean;
};

type LayeredStageInstance = PIXI.Container & {
  _updateStageRafId: number;
  updateStage: () => void;
};

const TYPE = "LayeredStage";

export default CustomPIXIComponent<LayeredStageInstance, LayeredStageProps>(
  {
    customDisplayObject: ({ enableSort = false }) => {
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
