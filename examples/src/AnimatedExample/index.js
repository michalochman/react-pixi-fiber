import React, { Component } from "react";
import { Stage } from "react-pixi-fiber";
import Animated from "animated";
import AnimatedSprite from "./AnimatedSprite";
import * as PIXI from "pixi.js";
import bunny from "../Bunny/bunny.png";

const OPTIONS = {
  backgroundColor: 0x1099bb,
};

const centerAnchor = new PIXI.Point(0.5, 0.5);

class BunnyExample extends Component {
  state = {
    rotation: new Animated.Value(0),
  };

  handleDown = () => {
    Animated.spring(this.state.rotation, { toValue: 1 }).start();
  };

  handleUp = () => {
    Animated.spring(this.state.rotation, { toValue: 0 }).start();
  };

  render() {
    return (
      <Stage width={800} height={600} options={OPTIONS}>
        <AnimatedSprite
          anchor={centerAnchor}
          interactive
          pointerdown={this.handleDown}
          pointerup={this.handleUp}
          position="400,300"
          rotation={this.state.rotation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Math.PI * 2],
          })}
          scale={this.state.rotation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 2],
          })}
          texture={PIXI.Texture.fromImage(bunny)}
        />
      </Stage>
    );
  }
}

export default BunnyExample;
