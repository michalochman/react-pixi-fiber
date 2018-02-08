import * as PIXI from 'pixi.js';
import * as React from 'react';
import { Sprite } from 'react-pixi-fiber';
import { StagedComponent } from './lib';

const bunny = "https://i.imgur.com/IaUrttj.png";
const centerAnchor = new PIXI.ObservablePoint(() => {}, undefined, 0.5, 0.5);

export interface BunnyProperties {
  /* X position. (default: 0) */
  x?: number;
  /** Y position. (default: 0) */
  y?: number;
  /** Rotation. (default: 0) */
  rotation?: number;
  /** Alpha. (default: 1) */
  alpha?: number;
  /** Event fired when sprite instance is created. */
  onCreated?: (instance: PIXI.Sprite) => any;
  /** Event fired when sprite instance is destroyed. */
  onDestroyed?: (instance: PIXI.Sprite) => any;
  /** Event fired when sprite instance is hovered in. */
  onHoverIn?: (instance: PIXI.Sprite) => any;
  /** Event fired when sprite instance is hovered out. */
  onHoverOut?: (instance: PIXI.Sprite) => any;
  /** Event fired when sprite instance is dragged. */
  onDrag?: (x: number, y: number, instance: PIXI.Sprite) => any;
}

export class Bunny extends StagedComponent<BunnyProperties> {
  /** Internal PIXI.Sprite instance. */
  private sprite: PIXI.Sprite | null = null;

  /** Flag set when dragging. */
  private dragging: boolean = false;

  componentDidMount() {
    this.configureSprite();
    this.emitCreated();
  }

  componentWillUnmount() {
    this.emitDestroyed();
  }

  /** Emit onCreated. */
  private emitCreated = () => this.sprite && this.props.onCreated && this.props.onCreated(this.sprite);

  /** Emit onDestroyed. */
  private emitDestroyed = () => this.sprite && this.props.onDestroyed && this.props.onDestroyed(this.sprite);

  /** Emit onHoverIn. */
  private emitHoverIn = () => this.sprite && this.props.onHoverIn && this.props.onHoverIn(this.sprite)

  /** Emit onHoverOut. */
  private emitHoverOut = () => this.sprite && this.props.onHoverOut && this.props.onHoverOut(this.sprite);

  /** Emit onDrag. */
  private emitDrag = (x: number, y: number) => this.sprite && this.props.onDrag && this.props.onDrag(x, y, this.sprite);

  /** When dragging starts, set the dragging flag. */
  private dragStart = () => { this.dragging = true; }

  /** When dragging, emit a drag event. */
  private dragMove = (e: PIXI.interaction.InteractionEvent) => this.dragging && this.emitDrag(e.data.global.x, e.data.global.y);

  /** When dragging stops, unset the dragging flag.. */
  private dragEnd = () => { this.dragging = false; }

  /** Configure the sprite. */
  private configureSprite() {
    if (!this.sprite) { return; }
    this.sprite
      .on('mouseover', this.emitHoverIn)
      .on('mouseout', this.emitHoverOut)
      .on('mousedown', this.dragStart)
      .on('touchstart', this.dragStart)
      .on('mousemove', this.dragMove)
      .on('touchmove', this.dragMove)
      .on('mouseup', this.dragEnd)
      .on('touchend', this.dragEnd);
  }

  render() {
    return (
      <Sprite
        ref={sprite => { this.sprite = sprite; }}
        anchor={centerAnchor}
        texture={PIXI.Texture.fromImage(bunny)}
        interactive={true}
        {...this.props}
      />
    );
  }
}
