import React, { Component, Fragment } from "react";
import { Stage } from "react-pixi-fiber";
import RotatingBunny from "./RotatingBunny";

const COLORS = [0x1099bb, 0x10bb99];
const SIZES = [{ width: 400, height: 300 }, { width: 300, height: 400 }];

class BunnyExample extends Component {
  state = {
    color: 0,
    count: 0,
    mount: false,
    size: 0,
  };

  addBunny = () => {
    this.setState(state => ({ ...state, count: Math.min(5, state.count + 1) }));
  };

  removeBunny = () => {
    this.setState(state => ({ ...state, count: Math.max(0, state.count - 1) }));
  };

  toggleBackground = () => {
    this.setState(state => ({ ...state, color: state.color ? 0 : 1 }));
  };

  toggleSize = () => {
    this.setState(state => ({ ...state, size: state.size ? 0 : 1 }));
  };

  toggleStage = () => {
    this.setState(state => ({ ...state, mount: !state.mount }));
  };

  renderControls() {
    const { count } = this.state;

    return (
      <div>
        <button onClick={this.toggleStage}>toggle Stage</button>
        <button onClick={this.toggleSize}>toggle size</button>
        <button onClick={this.toggleBackground}>toggle background</button>
        <button disabled={count === 5} onClick={this.addBunny}>
          add bunny
        </button>
        <button disabled={count === 0} onClick={this.removeBunny}>
          remove bunny
        </button>
      </div>
    );
  }

  renderStage() {
    const { color, count, mount, size } = this.state;
    const backgroundColor = COLORS[color];
    const { width, height } = SIZES[size];

    if (!mount) return null;

    return (
      <Stage options={{ backgroundColor, height, width }}>
        {count > 0 && <RotatingBunny x={width / 2} y={height / 2} texture={0} step={0.1} />}
        {count > 1 && <RotatingBunny x={width / 4} y={height / 4} texture={1} step={0.2} />}
        {count > 2 && <RotatingBunny x={width / 4} y={(3 * height) / 4} texture={2} step={-0.25} />}
        {count > 3 && <RotatingBunny x={(3 * width) / 4} y={height / 4} texture={3} step={-0.1} />}
        {count > 4 && <RotatingBunny x={(3 * width) / 4} y={(3 * height) / 4} texture={4} step={-0.02} />}
      </Stage>
    );
  }

  render() {
    return (
      <Fragment>
        {this.renderControls()}
        {this.renderStage()}
      </Fragment>
    );
  }
}

export default BunnyExample;
