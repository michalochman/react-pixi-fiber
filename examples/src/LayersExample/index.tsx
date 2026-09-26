// This is demo of pixi-display.js, https://github.com/gameofbombs/pixi-display
// Drag the rabbits to understand what's going on
// https://pixijs.io/examples/#/layers/zorder.js
import { CustomPIXIProperty, Container, Stage } from "react-pixi-fiber";
import ColoredBunny from "./ColoredBunny";
import DraggableContainer from "../CustomPIXIComponentExample/DraggableContainer";
import Layer from "./Layer";
import LayeredStage from "./LayeredStage";
import Rect from "../CustomPIXIComponentExample/Rect";
import { DraggableContainerInstance } from "../CustomPIXIComponentExample/DraggableContainer";
import * as PIXI from "pixi.js";
import { display } from "./pixiLayers";

const OPTIONS = {
  backgroundColor: 0x1099bb,
  height: 600,
  width: 800,
};

// Mark parentGroup prop as legal on Container as long as it's a valid display group
CustomPIXIProperty(Container, "parentGroup", value => value instanceof display.Group);

//META STUFF, groups exist without stage just fine

// z-index = 0, sorting = true;
const greenGroup = new display.Group(0, true);

// green bunnies go down
greenGroup.on("sort", (bunny: PIXI.DisplayObject) => {
  // we are dragging bunny parent, not the bunny itself
  bunny.zOrder = bunny.parent.y;
});

// blue bunnies go up
// z-index = 1, sorting = true, we can provide zOrder function directly in constructor
const blueGroup = new display.Group(1, (bunny: PIXI.DisplayObject) => {
  // we are dragging bunny parent, not the bunny itself
  bunny.zOrder = -bunny.parent.y;
});

// Drag is the best layer, dragged element is above everything else
const dragGroup = new display.Group(2, false);

// Shadows are the lowest
const shadowGroup = new display.Group(-1, false);

const blurFilter = new PIXI.filters.BlurFilter();
blurFilter.blur = 0.5;

type BunnyWithGroup = PIXI.DisplayObject & { oldGroup?: unknown };

const onBunnyDragEnd = (instance: DraggableContainerInstance) => {
  // we are dragging bunny parent, not the bunny itself
  const bunny = instance.children[1] as BunnyWithGroup;
  bunny.parentGroup = bunny.oldGroup;
};

const onBunnyDragStart = (instance: DraggableContainerInstance) => {
  // we are dragging bunny parent, not the bunny itself
  const bunny = instance.children[1] as BunnyWithGroup;
  bunny.oldGroup = bunny.parentGroup;
  bunny.parentGroup = dragGroup;
};

const blueBunnies = Array(10)
  .fill(0)
  .map((i, index) => index);
const greenBunnies = Array(15)
  .fill(0)
  .map((i, index) => index);
const evenBunnies = greenBunnies.filter(index => index % 2 === 0);
const oddBunnies = greenBunnies.filter(index => index % 2 !== 0);

const shadowProps = {
  fill: 0x0,
  filters: [blurFilter],
  height: 44,
  width: 44,
  x: -22,
  y: -22,
};

const stage = new display.Stage();
stage.group.enableSort = true;

function LayersExample() {
  return (
    <Stage options={OPTIONS}>
      {/* specify display list component */}
      <LayeredStage enableSort>
        {/* sorry, group cant exist without layer yet :( */}
        <Layer group={blueGroup} />
        <Layer group={greenGroup} />
        <Layer group={dragGroup} />
        <Layer group={shadowGroup} />
        {/* make obsolete containers. Why do we need them?
         * Just to show that we can do everything without
         * caring of actual parent container */}
        <Container>
          {evenBunnies.map(index => (
            <DraggableContainer
              key={index}
              x={100 + 20 * index}
              y={100 + 20 * index}
              onDragEnd={onBunnyDragEnd}
              onDragStart={onBunnyDragStart}
            >
              <Rect {...shadowProps} parentGroup={shadowGroup} />
              <ColoredBunny fill={0x74fa9a} parentGroup={greenGroup} />
            </DraggableContainer>
          ))}
        </Container>
        <Container>
          {oddBunnies.map(index => (
            <DraggableContainer
              key={index}
              x={100 + 20 * index}
              y={100 + 20 * index}
              onDragEnd={onBunnyDragEnd}
              onDragStart={onBunnyDragStart}
            >
              <Rect {...shadowProps} parentGroup={shadowGroup} />
              <ColoredBunny fill={0x74fa9a} parentGroup={greenGroup} />
            </DraggableContainer>
          ))}
        </Container>
        <Container>
          {blueBunnies.map(index => (
            <DraggableContainer
              key={index}
              x={400 + 20 * index}
              y={400 - 20 * index}
              onDragEnd={onBunnyDragEnd}
              onDragStart={onBunnyDragStart}
            >
              <Rect {...shadowProps} parentGroup={shadowGroup} />
              <ColoredBunny fill={0xbcfdfe} parentGroup={blueGroup} />
            </DraggableContainer>
          ))}
        </Container>
      </LayeredStage>
    </Stage>
  );
}

export default LayersExample;
