import React, { Component, Fragment } from "react";
import { render, unstable_batchedUpdates } from "react-pixi-fiber";
import Bunny from "../Bunny";
import * as PIXI from "pixi.js";

const OPTIONS = {
  backgroundColor: 0x1099bb,
};
const asyncFunc = cb => {
  setTimeout(cb, 100);
};

class Canvas extends Component {
  mountStage = canvasEl => {
    this.app = new PIXI.Application({
      ...OPTIONS,
      view: canvasEl,
    });
    render(<BatchedUpdatesExample />, this.app.stage);
  };

  render() {
    return <canvas ref={this.mountStage} width="600" height="800" />;
  }
}

class BatchedUpdatesExample extends Component {
  state = {
    x: 0,
    y: 0,
  };

  componentDidMount() {
    // auto batched in life cycle
    // render once
    this.setStateTwice();
  }

  setStateTwice = () => {
    this.setState({
      x: 100,
      y: 200,
    });
    this.setState({
      x: 300,
      y: 400,
    });
  };

  batched = () => {
    // render once
    asyncFunc(unstable_batchedUpdates(this.setStateTwice));
  };

  normal = () => {
    // render twice
    asyncFunc(this.setStateTwice);
  };

  render() {
    console.log("`render` called");
    const width = 800;
    const height = 600;
    return (
      <Fragment>
        <Bunny x={this.state.x} y={this.state.y} interactive pointerdown={this.normal} />
        <Bunny x={width - this.state.x} y={height - this.state.y} interactive pointerdown={this.batched} />
      </Fragment>
    );
  }
}

export default Canvas;
