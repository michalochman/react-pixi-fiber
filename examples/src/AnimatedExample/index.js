import React, { Component } from "react";
import { Stage } from "react-pixi-fiber";
import Animated from "./animatedPixiTarget";
import * as PIXI from "pixi.js";
import bunny from "../Bunny/bunny.png";

const OPTIONS = {
  backgroundColor: 0x1099bb,
};

const centerAnchor = new PIXI.Point(0.5, 0.5);

class BunnyExample extends Component {
  state = {
    animationProgress: new Animated.Value(0),
  };

  handleDown = () => {
    Animated.spring(this.state.animationProgress, { toValue: 1 }).start();
  };

  handleUp = () => {
    Animated.spring(this.state.animationProgress, { toValue: 0 }).start();
  };

  render() {
    return (
      <Stage width={800} height={600} options={OPTIONS}>
        <Animated.Sprite
          anchor={centerAnchor}
          interactive
          pointerdown={this.handleDown}
          pointerup={this.handleUp}
          position="400,300"
          rotation={this.state.animationProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Math.PI * 2],
          })}
          scale={this.state.animationProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 8],
          })}
          texture={PIXI.Texture.fromImage(bunny)}
        />
      </Stage>
    );
  }
}

export default BunnyExample;
