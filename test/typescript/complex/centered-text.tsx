import * as PIXI from 'pixi.js';
import * as React from 'react';
import { Text } from 'react-pixi-fiber';
import { StagedComponent } from './lib';

export interface CenteredTextProperties {
  /** Optional text. */
  text?: string;
  /** Max width of bounding box beginning at top/left of (x, y). */
  maxWidth: number;
  /** Position of top-left X-coordinate of bounding box. */
  x?: number;
  /** Position of top-left Y-coordinate of bounding box. */
  y?: number;
}

interface CenteredTextState {
  /** The width of the text being displayed. */
  textWidth: number;
}

export class CenteredText extends StagedComponent<CenteredTextProperties, CenteredTextState> {
  state: CenteredTextState = {
    textWidth: 0,
  };

  /** Internal PIXI.Text instance. */
  private text: PIXI.Text | null = null;

  private textChanged: boolean = false;

  componentDidMount() {
    // set the initial text width
    this.setTextWidth();
  }

  componentWillReceiveProps(nextProps: CenteredTextProperties) {
    // text width is changing
    if (nextProps.text !== this.props.text) {
      this.textChanged = true;
    }
  }

  componentDidUpdate() {
    // update text width if text changed
    if (this.textChanged) {
      this.setTextWidth();
      this.textChanged = false;
    }
  }

  /** Set the width of the text for centering. */
  private setTextWidth() {
    if (!this.text) { return; }
    this.setState({ textWidth: this.text.width });
  }

  render() {
    return (
      <Text
        ref={text => { this.text = text; }}
        text={this.props.text}
        x={(this.props.x || 0) + (this.props.maxWidth / 2) - (this.state.textWidth / 2)}
        y={this.props.y || 0}
      />
    );
  }
}
