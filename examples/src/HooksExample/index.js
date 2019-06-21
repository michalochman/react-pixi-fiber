import React, { Component } from "react";
import { Stage, Text } from "react-pixi-fiber";
import DraggableContainer from "./DraggableContainer";
import Circle from "./Circle";

const COLORS = [0xff00ff, 0x00ffff];
const POSITIONS = [{ x: 300, y: 200 }, { x: 400, y: 200 }, { x: 400, y: 300 }, { x: 300, y: 300 }];
const OPTIONS = {
  backgroundColor: 0x1099bb,
};

class HooksExample extends Component {
  state = {
    color: 0,
    position: 0,
  };

  componentDidMount = () => {
    this.timer = setInterval(() => {
      this.setState(state => ({
        ...state,
        color: (state.color + 1) % COLORS.length,
        position: (state.position + 1) % POSITIONS.length,
      }));
    }, 2000);
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <Stage width={800} height={600} options={OPTIONS}>
        <DraggableContainer>
          <Circle x={0} y={0} radius={100} fill={0xffff00} />
          <Text text={"drag\nme\nnow"} style={{ fontSize: 20 }} x={10} y={10} />
        </DraggableContainer>
        <Circle
          x={POSITIONS[this.state.position].x}
          y={POSITIONS[this.state.position].y}
          radius={100}
          fill={COLORS[this.state.color]}
        />
      </Stage>
    );
  }
}

export default HooksExample;
