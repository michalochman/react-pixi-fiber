/*global PIXI*/
import { CustomPIXIComponent } from "react-pixi-fiber";

const TYPE = "LayeredStage";
const behavior = {
  customDisplayObject: ({ enableSort = false }) => {
    const stage = new PIXI.display.Stage();
    stage.group.enableSort = enableSort;
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
};

export default CustomPIXIComponent(behavior, TYPE);
