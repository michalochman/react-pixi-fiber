import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

const TYPE = "DraggableContainer";
const behavior = {
  customDisplayObject: () => new PIXI.Container(),
  customDidAttach: instance => {
    instance.interactive = true;
    instance.cursor = "pointer";

    let draggedObject = null;
    this.dragStart = () => {
      draggedObject = instance;
      if (typeof instance.onDragStart === "function") instance.onDragStart(instance);
    };
    this.dragEnd = () => {
      draggedObject = null;
      if (typeof instance.onDragEnd === "function") instance.onDragEnd(instance);
    };
    this.dragMove = e => {
      if (draggedObject === null) {
        return;
      }
      draggedObject.position.x += e.data.originalEvent.movementX;
      draggedObject.position.y += e.data.originalEvent.movementY;
      if (typeof instance.onDragMove === "function") instance.onDragMove(instance);
    };

    instance.on("mousedown", this.dragStart);
    instance.on("mouseup", this.dragEnd);
    instance.on("mousemove", this.dragMove);
  },
  customWillDetach: instance => {
    instance.off("mousedown", this.dragStart);
    instance.off("mouseup", this.dragEnd);
    instance.off("mousemove", this.dragMove);
  },
};

export default CustomPIXIComponent(behavior, TYPE);
