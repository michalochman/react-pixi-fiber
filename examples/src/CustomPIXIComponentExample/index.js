import React, { Component } from "react";
import { Stage, Text } from "react-pixi-fiber";
import Circle from "./Circle";
import DraggableContainer from "./DraggableContainer";
import Rect from "./Rect";

const COLORS = [0xff00ff, 0x00ffff];
const POSITIONS = [{ x: 300, y: 200 }, { x: 400, y: 200 }, { x: 400, y: 300 }, { x: 300, y: 300 }];
const OPTIONS = {
  backgroundColor: 0x1099bb,
  height: 600,
  width: 800,
};

class CustomComponentExample extends Component {
  state = {
    color: 0,
    position: 0,
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState(state => ({
        ...state,
        color: (state.color + 1) % COLORS.length,
        position: (state.position + 1) % POSITIONS.length,
      }));
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <Stage options={OPTIONS}>
        <DraggableContainer>
          <Circle x={50} y={50} radius={50} fill={0xffff00} />
          <Text anchor="0.5,0.5" text={"drag\nme\nnow"} style={{ align: "center", fontSize: 20 }} x={50} y={50} />
        </DraggableContainer>
        <Rect
          x={POSITIONS[this.state.position].x}
          y={POSITIONS[this.state.position].y}
          width={100}
          height={100}
          fill={COLORS[this.state.color]}
        />
      </Stage>
    );
  }
}

export default CustomComponentExample;
