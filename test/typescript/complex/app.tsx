import * as PIXI from 'pixi.js';
import * as React from 'react';
import { Stage, Sprite, Text } from 'react-pixi-fiber';
import { Banner } from './banner';
import { InteractiveBunny } from './interactive-bunny';
import { FPSSpy } from './fps-spy';

/** Example demo width and height. */
const height = 450;
const width = 600;

/** A position within the stage */
interface Position { x: number; y: number; }

/** Initial bunny positions. */
const initialBunnies: Position[] = [
  { x: width / 3, y: height / 2 },
  { x: 2 * width / 3, y: height / 2 },
];

/** Welcome message sequence. */
const messages = [
  { text: 'Welcome!', delay: 2000, duration: 5000 },
  { text: 'Hover and drag to interact.', duration: 5000 },
  { text: 'Enjoy React PIXI Fiber!', duration: 5000 },
  {},
];

interface AppState {
  /** The set of `Position`'s of `InteractiveBunny` being displayed. */
  bunnies: Position[];
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    bunnies: [...initialBunnies],
  }

  /** The `<span>` element presenting the current FPS */
  private fps: HTMLSpanElement | null = null;

  /** Update the FPS counter by mutating the DOM directly to prevent needless re-renders. */
  private updateFPSCounter = (fps: number) => {
    if (!this.fps) { return; }
    this.fps.innerText = fps.toString();
  }

  /**
   * Update a bunny's position on the stage.
   * - if type is `Partial<Position>`, the `value` will be merged with the current value.
   * - if type is `Position`, the `value` will replace the current value.
   */
  private updatePosition(index: number, value: Partial<Position>) {
    const bunnies = [...this.state.bunnies];
    bunnies[index] = { ...bunnies[index], ...value };
    this.setState({ bunnies });
  }

  /** Validate the drag movement of an `InteractiveBunny`. */
  private validateDrag = (index: number) => (x: number, y: number) => {
    const valid = (x >= 0 && x < width) && (y >= 0 && y < height);
    if (valid) {
      this.updatePosition(index, { x, y });
    }
    return valid;
  }

  /** Handle a position update from an `InteractiveBunny`. */
  private handlePositionChange = (index: number, field: keyof Position) => (e: React.ChangeEvent<HTMLInputElement>) =>
    this.updatePosition(index, { [field]: e.target.valueAsNumber })

  render() {
    return (
      <div>
        <Stage
          backgroundColor={0x1099bb}
          height={height}
          width={width}
        >
          {/* @TODO - officially expose `Stage's` inner `PIXI.Application` to parent. Until
              then have spies who have access to it via `context.app` event changes to parent. */}
          <FPSSpy onChange={this.updateFPSCounter} />
          <Banner
            messages={messages}
            y={10}
            maxWidth={width}
          />
          {this.state.bunnies.map((bunny, index) => (
            <InteractiveBunny
              x={bunny.x}
              y={bunny.y}
              validateDrag={this.validateDrag(index)}
              key={index}
            />
          ))}
        </Stage>

        <div>
          <p>FPS: <span ref={fps => { this.fps = fps; }}>N/A</span></p>
          {this.state.bunnies.map((position, id) => (
            <>
              <p key={id}>Bunny {id + 1} position: ({position.x}, {position.y})</p>
              {(['x', 'y'] as (keyof Position)[]).map(axis => (
                <div>
                  <label>{axis}</label>
                  <input
                    type="range"
                    min={0}
                    max={width}
                    value={position[axis]}
                    onChange={this.handlePositionChange(id, axis)}
                  />
                  <input
                    type="number"
                    min={0}
                    max={width}
                    value={position[axis]}
                    onChange={this.handlePositionChange(id, axis)}
                  />
                </div>
              ))}
            </>
          ))}
        </div>
      </div>
    );
  }
}
