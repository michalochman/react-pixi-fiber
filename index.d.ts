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

  /** The structure of a staged component's context. */
  export interface StagedComponentContext {
    app: PIXI.Application;
  }

  /** a React component with context configured and typed. */
  export abstract class StagedComponent<P = {}, S = {}> extends React.Component<P, S> {
    context: StagedComponentContext;
  }

  /** A React stateless funtional component with typed context.  To configure, use the `lift` or `connect` HoC's. */
  export interface StagedStatlessComponent<P = {}> {
    (props: P & { children?: React.ReactNode }, context: StagedComponentContext): React.ReactElement<any> | null;
    propTypes?: React.ValidationMap<P>;
    contextTypes?: React.ValidationMap<any>;
    defaultProps?: Partial<P>;
    displayName?: string;
  }

  /** A shorthand alias for StagedStatelessComponent<P>. */
  export type StagedSFC<P = {}> = StagedStatlessComponent<P>;

  /** BitmapText component properties. */
  export interface BitmapTextProperties {
    text?: string;
  }

  /**
   * A component wrapper for PIXI.extras.BitmapText.
   *
   * see: http://pixijs.download/dev/docs/PIXI.extras.BitmapText.html
   */
  export class BitmapText extends React.Component<TilingSpriteProperties> {}

  /** Container component properties. */
  export interface ContainerProperties {}

  /**
   * A component wrapper for PIXI.extras.BitmapText.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Container.html
   */
  export class Container extends React.Component<TilingSpriteProperties> {}

  /** Graphics component properties. */
  export interface GraphicsProperties {}

  /**
   * A component wrapper for PIXI.Graphics.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Graphics.html
   */
  export class Graphics extends React.Component<TilingSpriteProperties> {}

  /** ParticleContainer component properties. */
  export interface ParticleContainerProperties {
    maxSize?: number;
    properties?: PIXI.particles.ParticleContainerProperties,
    batchSize?: number;
    autoResize?: boolean;
  }

  /**
   * A component wrapper for PIXI.particles.ParticleContainer.
   *
   * see: http://pixijs.download/dev/docs/PIXI.particles.ParticleContainer.html
   */
  export class ParticleContainer extends React.Component<TilingSpriteProperties> {}

  /** Sprite component properties. */
  export interface SpriteProperties extends Partial<PIXI.Sprite> {
    // anchor?: PIXI.Point;
    // texture
  }

  /**
   * A component wrapper for PIXI.Sprite.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Sprite.html
   */
  export class Sprite extends React.Component<SpriteProperties> {}

  /** Text component properties */
  export interface TextProperties {
    text?: string;
    style?: PIXI.TextStyle;
  }

  /**
   * A component wrapper for PIXI.Text.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Text.html
   */
  export class Text extends React.Component<TilingSpriteProperties> {}

  /** `TilingSprite` component properties. */
  export interface TilingSpriteProperties {
    texture?: PIXI.Texture;
    width?: number;
    height?: number;
  }

  /**
   * A component wrapper for `PIXI.extras.TilingSprite`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.extras.TilingSprite.html
   */
  export class TilingSprite extends React.Component<TilingSpriteProperties> {}

  /** `Stage` component properties. */
  export interface StageProperties {
    backgroundColor?: number;
    width?: number;
    height?: number;
  }

  /**
   * A component wrapper for `PIXI.Application`.
   *
   * see: http://pixijs.download/dev/docs/PIXI.Application.html
   */
  export class Stage extends React.Component<StageProperties> {}

  /** Custom React Reconciler render method. */
  export function render(pixiElement: any, stage: any, callback?: Function): void;

  /**
   * Project a React stateless functional component to a PIXI statless functional component.
   *
   * @example
   * const Comp = lift((props, context) =>  <Sprite />);
   */
  function lift<P, C extends StagedComponentContext = StagedComponentContext>(fn: (props: P, context: C) => JSX.Element): StagedSFC<P>;

  /** Connect definition predicate */
  export interface EnhancerWithOwnProperties<C, P extends C> {
    (component: React.ComponentClass<P> | React.StatelessComponent<P>): React.ComponentClass<Omit<P, keyof C>>;
  }

  /**
   * Connect the context to a React component via property mapping.
   *
   * @example
   * interface CompProperties {}
   *
   * interface CompContextProperties { app: PIXI.Application; }
   *
   * interface CompMergedProperties extends CompProperties, CompContextProperties {}
   *
   * const Comp: StagedSFC<CompMergedProperties> = (props, context) =>  <Sprite />;
   *
   * const mapContextToProps = (context: StagedComponentContext): CompContextProperties => ({ app: context.app });
   *
   * connect<CompContextProperties, CompMergedProperties>(mapContextToProps)(Comp);
   */
  function connect<C extends object, P extends C>(fn: (context: StagedComponentContext) => C): EnhancerWithOwnProperties<C, P>;
}
