import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

type DragHandler = (instance: DraggableContainerInstance) => void;

export type DraggableContainerProps = {
  onDragEnd?: DragHandler;
  onDragMove?: DragHandler;
  onDragStart?: DragHandler;
};

// Drag handlers passed as props are set on the instance by react-pixi-fiber,
// listeners are stored on the instance so `customWillDetach` can remove them.
export class DraggableContainerInstance extends PIXI.Container implements DraggableContainerProps {
  onDragEnd?: DragHandler;
  onDragMove?: DragHandler;
  onDragStart?: DragHandler;

  private draggedObject: DraggableContainerInstance | null = null;

  dragStart = () => {
    this.draggedObject = this;
    this.onDragStart?.(this);
  };

  dragEnd = () => {
    this.draggedObject = null;
    this.onDragEnd?.(this);
  };

  dragMove = (e: PIXI.InteractionEvent) => {
    if (this.draggedObject === null) {
      return;
    }
    const { movementX, movementY } = e.data.originalEvent as MouseEvent;
    this.draggedObject.position.x += movementX;
    this.draggedObject.position.y += movementY;
    this.onDragMove?.(this);
  };
}

const TYPE = "DraggableContainer";

export default CustomPIXIComponent<DraggableContainerInstance, DraggableContainerProps>(
  {
    customDisplayObject: () => new DraggableContainerInstance(),
    customDidAttach: instance => {
      instance.interactive = true;
      instance.cursor = "pointer";

      instance.on("mousedown", instance.dragStart);
      instance.on("mouseup", instance.dragEnd);
      instance.on("mousemove", instance.dragMove);
    },
    customWillDetach: instance => {
      instance.off("mousedown", instance.dragStart);
      instance.off("mouseup", instance.dragEnd);
      instance.off("mousemove", instance.dragMove);
    },
  },
  TYPE
);
