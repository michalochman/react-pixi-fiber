import * as React from 'react';
import { StagedComponent } from './lib';

export interface FPSSpyProperties {
  onChange: (fps: number) => void;
}

export class FPSSpy extends StagedComponent<FPSSpyProperties> {
  fps?: number = undefined;

  componentDidMount() {
    if (!this.props.onChange) { return; }
    this.context.app.ticker.add(this.emitChange);
  }

  emitChange = () => {
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
