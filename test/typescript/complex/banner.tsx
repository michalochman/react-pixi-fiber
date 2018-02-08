import * as React from 'react';
import { CenteredText } from './centered-text';
import { StagedComponent } from './lib';

interface BannerMessage {
  text?: string;
  delay?: number;
  duration?: number;
}

export interface BannerProperties {
  messages?: BannerMessage[]
  /** Max width of bounding box beginning at top/left of (x, y). */
  maxWidth: number;
  /** Position of top-left X-coordinate of bounding box. */
  x?: number;
  /** Position of top-left Y-coordinate of bounding box. */
  y?: number;
}

interface BannerState {
  text?: string;
}

export class Banner extends StagedComponent<BannerProperties, BannerState> {
  state: BannerState = {
    text: undefined,
  };

  componentDidMount() {
    this.start();
  }

  async start() {
    const { messages = [] } = this.props;
    for (const message of messages) {
      await this.showMessage(message);
    }
  }

  async showMessage({ text, delay = 0, duration = 0 }: BannerMessage) {
    return new Promise(resolve => {
      setTimeout(
        () => {
          this.setState({ text });
          setTimeout(resolve, duration);
        },
        delay,
      );
    });
  }

  render() {
    return <CenteredText text={this.state.text} {...this.props} />;
  }
}
