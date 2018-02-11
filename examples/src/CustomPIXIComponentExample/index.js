import React, { Component } from "react";
import { Stage, Text } from "react-pixi-fiber";
import DraggableContainer from "./DraggableContainer"
import Rect from "./Rect"

const colors = [
  0xFF00FF,
  0x00FFFF,
]
const positions = [
  { x: 300, y: 200 },
  { x: 400, y: 200 },
  { x: 400, y: 300 },
  { x: 300, y: 300 },
]

class CustomComponentExample extends Component {
  state = {
    color: 0,
    position: 0,
  }

  componentDidMount = () => {
    setInterval(() => {
      this.setState(state => ({
        ...state,
        color: (state.color + 1) % colors.length,
        position: (state.position + 1) % positions.length
      }));
    }, 2000);
  }

  render() {
    return (
      <Stage width={800} height={600} backgroundColor={0x1099bb}>
        <DraggableContainer>
          <Rect x={0} y={0} width={100} height={100} fill={0xFFFF00} />
          <Text text={"drag\nme\nnow"} style={{ fontSize: 20 }} x={10} y={10} />
        </DraggableContainer>
        <Rect
          x={positions[this.state.position].x}
          y={positions[this.state.position].y}
          width={100}
          height={100}
          fill={colors[this.state.color]}
        />
      </Stage>
    );
  }
}

export default CustomComponentExample;
