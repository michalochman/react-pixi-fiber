import * as PIXI from 'pixi.js';
import * as React from 'react';
import { Stage, Sprite, Text } from 'react-pixi-fiber';
import { Banner } from './banner';
import { InteractiveBunny } from './interactive-bunny';
import { FPSSpy } from './fps-spy';

const height = 450;
const width = 600;

const messages = [
  { text: 'Welcome!', delay: 2000, duration: 5000 },
  { text: 'Hover and drag to interact.', duration: 5000 },
  { text: 'Enjoy React PIXI Fiber!', duration: 5000 },
  {},
];

const inStage = (x: number, y: number) => (x >= 0 && x < width) && (y >= 0 && y < height);

interface Position { x: number; y: number; }

const isPosition = (p: Position | Partial<Position>): p is Position =>
  typeof p.x === 'number' && typeof p.y === 'number';

interface AppState {
  bunnies: Position[];
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    bunnies: [
      { x: width / 3, y: height / 2 },
      { x: 2 * width / 3, y: height / 2 },
    ],
  }

  private fps: HTMLSpanElement | null = null;

  updateFPSCounter = (fps: number) => {
    if (!this.fps) { return; }
    this.fps.innerText = fps.toString();
  }

  updatePosition(index: number, value: Position | Partial<Position>) {
    const bunnies = [...this.state.bunnies];
    bunnies[index] = isPosition(value) ? value : { ...bunnies[index], ...value };
    this.setState({ bunnies });
  }

  validateDrag = (index: number) => (x: number, y: number) => {
    this.updatePosition(index, { x, y });
    return inStage(x, y);
  }

  handlePositionChange = (index: number, field: keyof Position) => (e: React.ChangeEvent<HTMLInputElement>) =>
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
