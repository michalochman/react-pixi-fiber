import * as React from 'react';
import * as PIXI from 'pixi.js';

declare module 'react-pixi-fiber' {

  /**
   * The set of object keys in T not in U.
   *
   * Attribution: https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-311923766:
   */
  export type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];

  /**
   * An object with keys in T not in U.
   *
   * Attribution: https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-311923766:
   */
  export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

  /** The shape of an object that has an optional `children` property of any type. */
  interface ObjectWithChildren { children?: any; }

  /** The shape of `T` without it's `children` property. */
  export type Childrenless<T extends ObjectWithChildren> = Omit<T, 'children'>;

  /** The shape of a component that has an optional `children` property. */
  export interface ChildrenProperties {
    children?: React.ReactNode;
  }

  /**
   * This removes the `children` property of all component properties that inherit from `PIXI.Container`
   * and replaces it with a `children` property appropriate for composition with JSX.
   */
  export type ContainerWithChildren<T extends ObjectWithChildren> = Partial<Childrenless<T>> & ChildrenProperties;

  /** `BitmapText` component properties. */
  export interface BitmapTextProperties extends ContainerWithChildren<PIXI.extras.BitmapText> {
    text: string;
  }

  /**
   * A component wrapper for `PIXI.extras.BitmapText`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.extras.BitmapText.html
   */
  export class BitmapText extends React.Component<BitmapTextProperties> {}

  /** `Container` component properties. */
  export interface ContainerProperties extends ContainerWithChildren<PIXI.Container> {}

  /**
   * A component wrapper for `PIXI.extras.BitmapText`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Container.html
   */
  export class Container extends React.Component<ContainerProperties> {}

  /** `Graphics` component properties. */
  export interface GraphicsProperties extends ContainerWithChildren<PIXI.Graphics> {}

  /**
   * A component wrapper for `PIXI.Graphics`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Graphics.html
   */
  export class Graphics extends React.Component<GraphicsProperties> {}

  /** `ParticleContainer` component properties. */
  export interface ParticleContainerProperties extends ContainerWithChildren<PIXI.particles.ParticleContainer> {}

  /**
   * A component wrapper for `PIXI.particles.ParticleContainer`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.particles.ParticleContainer.html
   */
  export class ParticleContainer extends React.Component<TilingSpriteProperties> {}

  /** `Sprite` component properties. */
  export interface SpriteProperties extends ContainerWithChildren<PIXI.Sprite> {}

  /**
   * A component wrapper for `PIXI.Sprite`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Sprite.html
   */
  export class Sprite extends React.Component<SpriteProperties> {}

  /** `Text` component properties */
  export interface TextProperties extends ContainerWithChildren<PIXI.Text> {}

  /**
   * A component wrapper for `PIXI.Text`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Text.html
   */
  export class Text extends React.Component<TextProperties> {}

  /** `TilingSprite` component properties. */
  export interface TilingSpriteProperties extends ContainerWithChildren<PIXI.extras.TilingSprite> {
    texture: PIXI.Texture;
  }

  /**
   * A component wrapper for `PIXI.extras.TilingSprite`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.extras.TilingSprite.html
   */
  export class TilingSprite extends React.Component<TilingSpriteProperties> {}

  /** `Stage` component properties." */
  export interface StageProperties extends ContainerWithChildren<PIXI.Container> {}

  /**
   * A component wrapper for `PIXI.Application`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Application.html
   */
  export class Stage extends React.Component<StageProperties> {}

  /** Custom React Reconciler render method. */
  export function render(pixiElement: any, stage: any, callback?: Function): void;

}
