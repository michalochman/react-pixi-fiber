import * as React from "react";
import * as PIXI from "pixi.js";
import { InteractiveComponent } from "react-pixi-fiber";

declare module "react-pixi-fiber" {
  /** The shape of `T` without it's `children` property. */
  export type Childless<T> = Partial<Omit<T, "children">>;

  /** The shape of a component that has an optional `children` property. */
  export interface ReactChildrenProperties {
    children?: React.ReactNode;
  }

  /** The shape of a component that has app `property` that is an instance of PIXI.Application */
  export interface PixiAppProperties {
    app: PIXI.Application;
  }

  /** Point like object with x,y */
  interface PointLikeObject {
    x: number;
    y: number;
  }

  /** Point like type */
  type PointLike = PIXI.Point | PIXI.ObservablePoint | PointLikeObject | string | [number, number];

  /** Create new type based on O with replaced T properties by K */
  type WithElements<O, T extends keyof any, K> = Omit<O, T> & { [P in T]?: K };

  /** Replace P properties to point like */
  type WithPointLike<T, P extends keyof any> = WithElements<Childless<T>, P, PointLike>;

  /**
   * Extra properties to add to allow us to set event handlers using props
   */
  export type InteractiveComponent = {
    [P in PIXI.interaction.InteractionEventTypes]?: (event: PIXI.interaction.InteractionEvent) => void
  };

  export type WithInteractive<T> = T & InteractiveComponent;

  /**
   * A PIXI Component with children.
   */
  export type Component<T> = Childless<T> & ReactChildrenProperties;

  type ContainerPointProperties = "position" | "scale" | "pivot";
  type SpritePointProperties = ContainerPointProperties | "anchor";
  type BitmapTextPointProperties = ContainerPointProperties | "anchor";
  type TextPointProperties = ContainerPointProperties | "anchor";

  /** `BitmapText` component properties. */
  export type BitmapTextProperties = WithInteractive<WithPointLike<PIXI.BitmapText, BitmapTextPointProperties>>;

  /** `Container` component properties. */
  export type ContainerProperties = WithInteractive<WithPointLike<PIXI.Container, ContainerPointProperties>>;

  /** `ParticleContainer` component properties. */
  export type ParticleContainerProperties = WithInteractive<WithPointLike<PIXI.ParticleContainer, ContainerPointProperties>>;

  /** `Graphics` component properties. */
  export type GraphicsProperties = WithInteractive<WithPointLike<PIXI.Graphics, ContainerPointProperties>>;

  /** `Sprite` component properties. */
  export type SpriteProperties = WithInteractive<WithPointLike<PIXI.Sprite, SpritePointProperties>>;

  /** `TilingSprite` component properties. */
  export type TilingSpriteProperties = WithInteractive<WithPointLike<PIXI.TilingSprite, SpritePointProperties>>;

  /** `Text` component properties */
  export type TextProperties = WithInteractive<WithPointLike<PIXI.Text, TextPointProperties>>;

  /** `Stage` component properties." */
  export interface StageProperties extends WithInteractive<WithPointLike<PIXI.Container, ContainerPointProperties>> {
    options?: {};
  }

  /**
   * A component wrapper for `PIXI.BitmapText`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.extras.BitmapText.html
   */
  export class BitmapText extends React.Component<BitmapTextProperties> {}

  /**
   * A component wrapper for `PIXI.Container`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Container.html
   */
  export class Container extends React.Component<ContainerProperties> {}

  /**
   * A component wrapper for `PIXI.Graphics`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Graphics.html
   */
  export class Graphics extends React.Component<GraphicsProperties> {}

  /**
   * A component wrapper for `PIXI.ParticleContainer`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.ParticleContainer.html
   */
  export class ParticleContainer extends React.Component<TilingSpriteProperties> {}

  /**
   * A component wrapper for `PIXI.Sprite`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Sprite.html
   */
  export class Sprite extends React.Component<SpriteProperties> {}

  /**
   * A component wrapper for `PIXI.Text`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Text.html
   */
  export class Text extends React.Component<TextProperties> {}

  /**
   * A component wrapper for `PIXI.TilingSprite`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.TilingSprite.html
   */
  export class TilingSprite extends React.Component<TilingSpriteProperties> {}

  /**
   * A component wrapper for PIXI `Stage`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Application.html
   */
  export class Stage extends React.Component<StageProperties> {}

  /** Custom React Reconciler render method. */
  export function render(
    pixiElement: React.ReactElement<any> | React.ReactElement<any>[] | PIXI.DisplayObject | PIXI.DisplayObject[],
    stage: PIXI.Container,
    callback?: Function
  ): void;

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
    customApplyProps?: (displayObject: U, oldProps: T, newProps: T) => void;
    /**
     * Use this to do something after displayObject is attached, which happens after componentDidMount lifecycle method.
     */
    customDidAttach?: (displayObject: U) => void;
    /**
     * Use this to do something (usually cleanup) before detaching, which happens before componentWillUnmount lifecycle method.
     */
    customWillDetach?: (displayObject: U) => void;
  }
  /**
   * Create a custom component.
   */
  export function CustomPIXIComponent<T, U extends WithInteractive<PIXI.DisplayObject>> (
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

  const withApp: <T extends PixiAppProperties>(WrappedComponent: React.ComponentType<T>) => React.ComponentType<T>;

  /**
   * BatchedUpdates same as ReactDOM
   */
  export function unstable_batchedUpdates<A, B>(callback: (a: A, b: B) => any, a: A, b: B): void;
  export function unstable_batchedUpdates<A>(callback: (a: A) => any, a: A): void;
  export function unstable_batchedUpdates(callback: () => any): void;
}
