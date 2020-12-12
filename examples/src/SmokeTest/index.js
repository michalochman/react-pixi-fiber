import React, { Component, Fragment } from "react";
import { createStageClass, Stage } from "react-pixi-fiber";
import RotatingBunny from "../RotatingBunny";

const COLORS = [0x1099bb, 0x10bb99];
const SIZES = [
  { width: 400, height: 300 },
  { width: 300, height: 400 },
];

const StageClass = createStageClass();

class BunnyExample extends Component {
  state = {
    color: 0,
    count: 0,
    mount: false,
    size: 0,
    useStageClass: false,
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

  toggleUseStageClass = () => {
    this.setState(state => ({ ...state, useStageClass: !state.useStageClass }));
  };

  renderControls() {
    const { color, count, mount, size, useStageClass } = this.state;

    return (
      <table style={{ margin: "0 auto 1.5em", textAlign: "left" }}>
        <tbody>
          <tr>
            <td>Stage mounted: {mount ? "yes" : "no"}</td>
            <td>
              <button onClick={this.toggleStage}>toggle Stage</button>
            </td>
          </tr>
          <tr>
            <td>StageClass used: {useStageClass ? "yes" : "no"}</td>
            <td>
              <button onClick={this.toggleUseStageClass}>toggle Use Stage Class</button>
            </td>
          </tr>
          <tr>
            <td>
              Size: {SIZES[size].width}x{SIZES[size].height}
            </td>
            <td>
              <button onClick={this.toggleSize}>toggle size</button>
            </td>
          </tr>
          <tr>
            <td>Background: #{COLORS[color].toString(16)}</td>
            <td>
              <button onClick={this.toggleBackground}>toggle background</button>
            </td>
          </tr>
          <tr>
            <td>Bunnies: {count}</td>
            <td>
              <button disabled={count === 5} onClick={this.addBunny}>
                add bunny
              </button>
              <button disabled={count === 0} onClick={this.removeBunny}>
                remove bunny
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  renderStage() {
    const { color, count, mount, size, useStageClass } = this.state;
    const backgroundColor = COLORS[color];
    const { width, height } = SIZES[size];

    if (!mount) return null;

    const StageComponent = useStageClass ? StageClass : Stage;

    return (
      <StageComponent key={useStageClass ? "class" : "function"} options={{ backgroundColor, height, width }}>
        {count > 0 && <RotatingBunny x={width / 2} y={height / 2} texture={0} step={0.1} />}
        {count > 1 && <RotatingBunny x={width / 4} y={height / 4} texture={1} step={0.2} />}
        {count > 2 && <RotatingBunny x={width / 4} y={(3 * height) / 4} texture={2} step={-0.25} />}
        {count > 3 && <RotatingBunny x={(3 * width) / 4} y={height / 4} texture={3} step={-0.1} />}
        {count > 4 && <RotatingBunny x={(3 * width) / 4} y={(3 * height) / 4} texture={4} step={-0.02} />}
      </StageComponent>
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
