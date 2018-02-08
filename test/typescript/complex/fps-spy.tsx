import * as React from 'react';
import { StagedComponent } from './lib';

export interface FPSSpyProperties {
  /** Handle FPS change event. */
  onChange: (fps: number) => void;
}

export class FPSSpy extends StagedComponent<FPSSpyProperties> {
  /** The last _rounded_ `PIXI.ticker.Ticker`'s `FPS` value. */
  private fps?: number = undefined;

  componentDidMount() {
    if (!this.props.onChange) { return; }
    this.context.app.ticker.add(this.emitChange);
  }

  /** Emit if the _rounded_ value of `PIXI.ticker.Ticker`'s `FPS` property changed. */
  private emitChange = () => {
    const fps = Math.round(this.context.app.ticker.FPS);
    if (this.props.onChange && this.fps !== fps) {
      this.fps = fps;
      this.props.onChange(this.fps);
    }
  };

  render() {
    return null;
  }
}
