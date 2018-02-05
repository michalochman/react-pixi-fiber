/**
 * Exercise TypeScript definitions
 */

import * as React from 'react';
import { StagedComponent, SpriteProperties } from 'react-pixi-fiber';
import { Bunny } from './lift';

interface RotatingBunnyProperties extends SpriteProperties {
  x?: number;
  y?: number;
}

interface RotatingBunnyState {
  rotation: number;
}

class RotatingBunny extends StagedComponent<RotatingBunnyProperties, RotatingBunnyState> {
  state: Readonly<RotatingBunnyState> = {
    rotation: 0,
  };

  componentDidMount() {
    this.context.app.ticker.add(this.animate);
  }

  componentWillUnmount() {
    this.context.app.ticker.remove(this.animate);
  }

  animate = (delta: number) => {
    // just for fun, let's rotate mr rabbit a little
    // delta is 1 if running at 100% performance
    // creates frame-independent tranformation
    this.setState(state => ({
      ...state,
      rotation: state.rotation + 0.1 * delta,
    }));
  };

  render() {
    return <Bunny {...this.props} rotation={this.state.rotation} />;
  }
}
