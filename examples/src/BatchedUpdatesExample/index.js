import React, { Component } from "react";
import { render, unstable_batchedUpdates } from "./react-pixi-fiber.development";
import Bunny from "../Bunny";
import * as PIXI from 'pixi.js';

const OPTIONS = {
  backgroundColor: 0x1099bb,
};
const asyncFunc = (cb) => {
  setTimeout(cb, 100);
}

class Canvas extends Component {
  mountStage = (canvasEl) => {
    this.app = new PIXI.Application({
      ...OPTIONS,
      view: canvasEl
    });
    render(<BatchedUpdatesExample/>, this.app.stage)
  }

  render() {
    return (
      <canvas ref={this.mountStage} width="600" height="800"></canvas>
    )
  }
}

class BatchedUpdatesExample extends Component {
  state = {
    x: 0,
    y: 0
  }

  componentDidMount() {
    // auto batched in life circle
    // render once
    this.setStateTwice();

    // render once
    asyncFunc(
      unstable_batchedUpdates(
        this.setStateTwice
      )
    )

    // render twice
    asyncFunc(this.setStateTwice)
  }

  setStateTwice = () => {
    this.setState({
      x: 100,
      y: 200,
    })
    this.setState({
      x: 300,
      y: 400,
    })
  }

  render() {
    return (
      <Bunny
        x={this.state.x}
        y={this.state.y}
      />
    );
  }
}

export default Canvas;
