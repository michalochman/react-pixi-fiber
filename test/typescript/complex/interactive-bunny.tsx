import * as React from 'react';
import { Bunny } from './bunny';
import { StagedComponent } from './lib';

const BUNNY_NORMAL = 0.5;
const BUNNY_HIGHLIGHT = 1;
const BUNNY_ROTATION = 0;
const BUNNY_STARTX = 0;
const BUNNY_STARTY = 0;

export interface InteractiveBunnyProperties {
  /** Optional starting x position */
  x?: number;
  /** Optional starting y position */
  y?: number;
  /** Optional drag position validation */
  validateDrag?: (x: number, y: number) => boolean;
}

interface InteractiveBunnyState {
  /** Alpha value */
  alpha: number;
  /** X position */
  x: number;
  /** Y position */
  y: number;
}

export class InteractiveBunny extends StagedComponent<InteractiveBunnyProperties, InteractiveBunnyState> {
  state: Readonly<InteractiveBunnyState> = {
    alpha: BUNNY_NORMAL,
    x: this.props.x || BUNNY_STARTX,
    y: this.props.y || BUNNY_STARTY,
  };

  componentWillReceiveProps(nextProps: InteractiveBunnyProperties) {
    if ((nextProps.x !== this.props.x && nextProps.x !== this.state.x)
    || (nextProps.y !== this.props.y && nextProps.y !== this.state.y)) {
      this.setState({ x: nextProps.x || 0, y: nextProps.y || 0 });
    }
  }

  private handleHoverIn = () => this.setState({ alpha: BUNNY_HIGHLIGHT });

  private handleHoverOut = () => this.setState({ alpha: BUNNY_NORMAL });

  private handleDrag = (x: number, y: number) =>
    (this.props.validateDrag ? this.props.validateDrag(x, y) : true) && this.setState({ x, y })

  render() {
    return (
      <Bunny
        onHoverIn={this.handleHoverIn}
        onDrag={this.handleDrag}
        onHoverOut={this.handleHoverOut}
        {...this.state}
      />
    );
  }
}
