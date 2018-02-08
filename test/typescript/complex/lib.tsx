import * as PIXI from 'pixi.js';
import * as PropTypes from 'prop-types';
import * as React from 'react';

export const contextTypes = { app: PropTypes.object };

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
  ref?: (i: P) => any;
  static contextTypes = contextTypes;
  context: StagedComponentContext = {} as any as StagedComponentContext;
}

/** A React stateless funtional component with typed context.  To configure, use the `lift` or `connect` HoC's. */
export interface StagedStatelessComponent<P = {}> {
  (props: P & { children?: React.ReactNode }, context: StagedComponentContext): React.ReactElement<any> | null;
  propTypes?: React.ValidationMap<P>;
  contextTypes?: React.ValidationMap<any>;
  defaultProps?: Partial<P>;
  displayName?: string;
}

/** A shorthand alias for StagedStatelessComponent<P>. */
export type StagedSFC<P = {}> = StagedStatelessComponent<P>;

/**
 * Project a React stateless functional component to a PIXI statless functional component.
 *
 * @example
 * const Comp = lift((props, context) =>  <Sprite />);
 */
export function lift<P, C extends StagedComponentContext = StagedComponentContext>(fn: (props: P, context: C) => JSX.Element): StagedSFC<P> {
  const Comp = fn as any as StagedSFC<P>;
  Comp.contextTypes = contextTypes;
  return Comp;
}

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
export function connect<C extends object, P extends C>(fn: (context: StagedComponentContext) => C): EnhancerWithOwnProperties<C, P> {
  return (Component: React.ComponentClass<P> | React.StatelessComponent<P>): React.ComponentClass<Omit<P, keyof C>> =>
    class WrappedComponent extends StagedComponent<P> {
      render() {
        return <Component {...this.props} {...fn(this.context)} />;
      }
    } as any as React.ComponentClass<Omit<P, keyof C>>;
}
