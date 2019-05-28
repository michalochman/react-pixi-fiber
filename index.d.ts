import * as React from 'react';
import * as PIXI from 'pixi.js';
import {InteractiveComponent} from "react-pixi-fiber";

declare module 'react-pixi-fiber' {

  /**
   * An object with keys in T not in U.
   *
   * Attribution: https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-377567046
   */
  export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

  /** The shape of an object that has an optional `children` property of any type. */
  interface ObjectWithChildren { children?: any; }

  /** The shape of `T` without it's `children` property. */
  export type Childless<T extends ObjectWithChildren> = Omit<T, 'children'>;

  /** The shape of a component that has an optional `children` property. */
  export interface ChildrenProperties {
    children?: React.ReactNode;
  }

  /**
   * Extra properties to add to allow us to set event handlers using props
   */
  export interface InteractiveComponent {
    pointerdown?: (event: PIXI.interaction.InteractionEvent) => void;
    pointercancel?: (event: PIXI.interaction.InteractionEvent) => void;
    pointerup?: (event: PIXI.interaction.InteractionEvent) => void;
    pointertap?: (event: PIXI.interaction.InteractionEvent) => void;
    pointerupoutside?: (event: PIXI.interaction.InteractionEvent) => void;
    pointermove?: (event: PIXI.interaction.InteractionEvent) => void;
    pointerover?: (event: PIXI.interaction.InteractionEvent) => void;
    pointerout?: (event: PIXI.interaction.InteractionEvent) => void;
    touchstart?: (event: PIXI.interaction.InteractionEvent) => void;
    touchcancel?: (event: PIXI.interaction.InteractionEvent) => void;
    touchend?: (event: PIXI.interaction.InteractionEvent) => void;
    touchendoutside?: (event: PIXI.interaction.InteractionEvent) => void;
    touchmove?: (event: PIXI.interaction.InteractionEvent) => void;
    tap?: (event: PIXI.interaction.InteractionEvent) => void;
    rightdown?: (event: PIXI.interaction.InteractionEvent) => void;
    mousedown?: (event: PIXI.interaction.InteractionEvent) => void;
    rightup?: (event: PIXI.interaction.InteractionEvent) => void;
    mouseup?: (event: PIXI.interaction.InteractionEvent) => void;
    rightclick?: (event: PIXI.interaction.InteractionEvent) => void;
    click?: (event: PIXI.interaction.InteractionEvent) => void;
    rightupoutside?: (event: PIXI.interaction.InteractionEvent) => void;
    mouseupoutside?: (event: PIXI.interaction.InteractionEvent) => void;
    mousemove?: (event: PIXI.interaction.InteractionEvent) => void;
    mouseover?: (event: PIXI.interaction.InteractionEvent) => void;
    mouseout?: (event: PIXI.interaction.InteractionEvent) => void;
  }

  /**
   * A PIXI Component with no children.
   */
  export type ChildlessComponent<T extends ObjectWithChildren> = Partial<Childless<T>>;

  /**
   * A PIXI Component with children.
   */
  export type Component<T extends ObjectWithChildren> = ChildlessComponent<T> & ChildrenProperties;

  /** `BitmapText` component properties. */
  export interface BitmapTextProperties extends ChildlessComponent<PIXI.extras.BitmapText & InteractiveComponent> {
    text: string;
  }

  /**
   * A component wrapper for `PIXI.extras.BitmapText`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.extras.BitmapText.html
   */
  export class BitmapText extends React.Component<BitmapTextProperties> {}

  /** `Container` component properties. */
  export interface ContainerProperties extends ChildlessComponent<PIXI.Container & InteractiveComponent> {}

  /**
   * A component wrapper for `PIXI.Container`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Container.html
   */
  export class Container extends React.Component<ContainerProperties> {}

  /** `Graphics` component properties. */
  export interface GraphicsProperties extends Component<PIXI.Graphics & InteractiveComponent> {}

  /**
   * A component wrapper for `PIXI.Graphics`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Graphics.html
   */
  export class Graphics extends React.Component<GraphicsProperties> {}

  /** `ParticleContainer` component properties. */
  export interface ParticleContainerProperties extends ChildlessComponent<PIXI.particles.ParticleContainer & InteractiveComponent> {}

  /**
   * A component wrapper for `PIXI.particles.ParticleContainer`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.particles.ParticleContainer.html
   */
  export class ParticleContainer extends React.Component<TilingSpriteProperties> {}

  /** `Sprite` component properties. */
  export interface SpriteProperties extends ChildlessComponent<PIXI.Sprite & InteractiveComponent> {}

  /**
   * A component wrapper for `PIXI.Sprite`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Sprite.html
   */
  export class Sprite extends React.Component<SpriteProperties> {}

  /** `Text` component properties */
  export interface TextProperties extends ChildlessComponent<Omit<PIXI.Text, 'anchor'> & InteractiveComponent> {
    anchor?: string | number[] | PIXI.ObservablePoint;
  }

  /**
   * A component wrapper for `PIXI.Text`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Text.html
   */
  export class Text extends React.Component<TextProperties> {}

  /** `TilingSprite` component properties. */
  export interface TilingSpriteProperties extends ChildlessComponent<PIXI.extras.TilingSprite & InteractiveComponent> {
    texture: PIXI.Texture;
  }

  /**
   * A component wrapper for `PIXI.extras.TilingSprite`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.extras.TilingSprite.html
   */
  export class TilingSprite extends React.Component<TilingSpriteProperties> {}

  /** `Stage` component properties." */
  export interface StageProperties extends Component<PIXI.Container & InteractiveComponent> {
    options?: PIXI.ApplicationOptions
  }

  /**
   * A component wrapper for `PIXI.Application`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Application.html
   */
  export class Stage extends React.Component<StageProperties> {}

  /** Custom React Reconciler render method. */
  export function render(pixiElement: React.ReactElement<any> | React.ReactElement<any>[] | PIXI.DisplayObject | PIXI.DisplayObject[], stage: PIXI.Container, callback?: Function): void;

  /**
   * Custom component properties.
   */
  export interface Behavior<T, U extends PIXI.DisplayObject> {
    /**
     * Use this to create an instance of [PIXI.DisplayObject].
     */
    customDisplayObject: (props: T) => U;
    /**
     * Use this to apply newProps to your Component in a custom way.
     */
    customApplyProps?: (displayObject: U, oldProps: T, newProps: T) => any;
    /**
     * Use this to do something after displayObject is attached, which happens after componentDidMount lifecycle method.
     */
    customDidAttach?: (displayObject: U) => any;
    /**
     * Use this to do something (usually cleanup) before detaching, which happens before componentWillUnmount lifecycle method.
     */
    customWillDetach?: (displayObject: U) => any;
  }
  /**
   * Create a custom component.
   */
  export function CustomPIXIComponent<T, U extends PIXI.DisplayObject & InteractiveComponent>(
    behavior: Behavior<T, U>,
    /**
     * The name of this custom component.
     */
    type: string
  ): React.ReactType<T>;

  /**
   * AppContext
   */
  export const AppContext: React.Context<PIXI.Application>;

  /**
   * BatchedUpdates same as ReactDOM
   */
  export function unstable_batchedUpdates<A, B>(callback: (a: A, b: B) => any, a: A, b: B): void;
  export function unstable_batchedUpdates<A>(callback: (a: A) => any, a: A): void;
  export function unstable_batchedUpdates(callback: () => any): void;
}

