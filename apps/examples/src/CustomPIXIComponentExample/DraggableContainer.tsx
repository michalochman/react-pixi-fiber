import { PIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

type DragHandler = (instance: DraggableContainerInstance) => void;

export type DraggableContainerProps = {
  onDragEnd?: DragHandler;
  onDragMove?: DragHandler;
  onDragStart?: DragHandler;
};

// Drag handlers passed as props are set on the instance by react-pixi-fiber,
// listeners are stored on the instance so `beforeRemove` can remove them.
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

  dragMove = (e: PIXI.FederatedPointerEvent) => {
    if (this.draggedObject === null) {
      return;
    }
    const { movementX, movementY } = e;
    this.draggedObject.position.x += movementX;
    this.draggedObject.position.y += movementY;
    this.onDragMove?.(this);
  };
}

const TYPE = "DraggableContainer";

const DraggableContainer = PIXIComponent<DraggableContainerInstance, DraggableContainerProps>(TYPE, {
  create: () => new DraggableContainerInstance(),
  afterAdd: instance => {
    instance.eventMode = "static";
    instance.cursor = "pointer";

    instance.on("mousedown", instance.dragStart);
    instance.on("mouseup", instance.dragEnd);
    instance.on("mouseupoutside", instance.dragEnd);
    // `mousemove` fires only while the pointer is over the container, so a fast drag would lose it.
    instance.on("globalmousemove", instance.dragMove);
  },
  beforeRemove: instance => {
    instance.off("mousedown", instance.dragStart);
    instance.off("mouseup", instance.dragEnd);
    instance.off("mouseupoutside", instance.dragEnd);
    instance.off("globalmousemove", instance.dragMove);
  },
});

export default DraggableContainer;
