import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

const TYPE = "DraggableContainer";
const behavior = {
  customDisplayObject: props => new PIXI.Container(),
  customDidAttach: instance => {
    instance.interactive = true;
    instance.cursor = "pointer";

    let draggedObject = null;
    this.dragStart = () => (draggedObject = instance);
    this.dragStop = () => (draggedObject = null);
    this.drag = e => {
      if (draggedObject === null) {
        return;
      }
      draggedObject.position.x += e.data.originalEvent.movementX;
      draggedObject.position.y += e.data.originalEvent.movementY;
    };

    instance.on("mousedown", this.dragStart);
    instance.on("mouseup", this.dragStop);
    instance.on("mousemove", this.drag);
  },
  customWillDetach: instance => {
    instance.off("mousedown", this.dragStart);
    instance.off("mouseup", this.dragStop);
    instance.off("mousemove", this.drag);
  },
};

export default CustomPIXIComponent(behavior, TYPE);
