import React, { useState } from "react";
import { Stage, Text } from "react-pixi-fiber";
import Circle from "./Circle";
import DraggableContainer from "./DraggableContainer";
import Rect from "./Rect";
import useInterval from "./useInterval";

const COLORS = [0xff00ff, 0x00ffff];
const POSITIONS = [
  { x: 300, y: 200 },
  { x: 400, y: 200 },
  { x: 400, y: 300 },
  { x: 300, y: 300 },
];
const OPTIONS = {
  backgroundColor: 0x1099bb,
  height: 600,
  width: 800,
};

function CustomComponentExample() {
  const [color, setColor] = useState(0);
  const [position, setPosition] = useState(0);

  useInterval(() => {
    setColor(color => color + 1) % COLORS.length;
    setPosition(position => position + 1) % POSITIONS.length;
  }, 2000);

  return (
    <Stage options={OPTIONS}>
      <DraggableContainer>
        <Circle x={50} y={50} radius={50} fill={0xffff00} />
        <Text anchor="0.5,0.5" text={"drag\nme\nnow"} style={{ align: "center", fontSize: 20 }} x={50} y={50} />
      </DraggableContainer>
      <Rect x={POSITIONS[position].x} y={POSITIONS[position].y} width={100} height={100} fill={COLORS[color]} />
    </Stage>
  );
}

export default CustomComponentExample;
