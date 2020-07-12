import * as React from "react";
import * as PIXI from "pixi.js";


declare module "react-pixi-fiber" {
  /**
   * Compatibility
   */

  // Returns either real keys of `PIXI.interaction` (if it exists) or generic `string` (if it doesn't exist).
  // `PIXI.interaction` was removed without deprecation notice in https://github.com/pixijs/pixi.js/pull/6681
  // shipped in pixi.js@5.3.0. We want to support earlier versions of PixiJS as well so we need this hack for now.
  // @ts-ignore TS2694
  type InteractionCompatibility = Exclude<keyof typeof PIXI.interaction, number | symbol>;
  type InteractionEvent = string extends InteractionCompatibility
    // @ts-ignore TS2694
    ? PIXI.InteractionEvent
    // @ts-ignore TS2694
    : PIXI.interaction.InteractionEvent;
  type InteractionEventTypes = string extends InteractionCompatibility
    // @ts-ignore TS2694
    ? PIXI.InteractionEventTypes
    // @ts-ignore TS2694
    : PIXI.interaction.InteractionEventTypes;

  /**
   * Helpers
   */

  // Returns keys `K` of `T` where type of `T[K]` partially matches `U`.
  // e.g. KeysThatMayHaveType<{ foo: string, bar: string | null }, string> -> "foo" | "bar"
  // e.g. KeysThatMayHaveType<{ foo: number, bar: string | null }, string> -> "bar"
  type KeysThatMayHaveType<T, U> = { [K in keyof T]: U extends T[K] ? K : never }[keyof T];

  // Returns keys `K` of `T` where type of `T[K]` is not specifically `any`.
  type KeysThatAreNotAny<T> = { [K in keyof T]: any extends T[K] ? never : K }[keyof T];

  // The shape of `T` with `children` property that React understands.
  type PropsWithReactChildren<T> = Omit<T, "children"> & { children?: React.ReactNode };

  // Returns `T` when it extends `PIXI.DisplayObject`, otherwise returns `U`.
  // This is a hack which we use to be able to use these types with types from PixiJS v4 and v5
  type PixiTypeFallback<T, U> = T extends PIXI.DisplayObject ? T : U;

  // Gets the length of an array/tuple type.
  // see: https://dev.to/kjleitz/comment/gb5d
  type LengthOfTuple<T extends any[]> = T extends { length: infer L } ? L : never;

  // Drops the first element of a tuple.
  // see: https://dev.to/kjleitz/comment/gb5d
  type DropFirstInTuple<T extends any[]> = ((...args: T) => any) extends (arg: any, ...rest: infer U) => any ? U : T;

  // Gets the type of the last element of a tuple.
  // see: https://dev.to/kjleitz/comment/gb5d
  type LastInTuple<T extends any[]> = T[LengthOfTuple<DropFirstInTuple<T>>];

  /**
   * Points
   */

  // Point types used by PixiJS. PIXI.IPoint exists in PIXIJS v5 only.
  type PixiPoint = PIXI.Point | PIXI.ObservablePoint | PIXI.IPoint;

  // Point-like object with `x`, `y` keys.
  // e.g. `position={{ x: 13, y: 37 }}`
  export interface PointLikeObject {
    x: number;
    y: number;
  }

  // Point-like tuple with `x` and `y` encoded as a single value or provided as a separate values.
  // e.g. `pivot={[13, 37]}`
  export type PointLikeTuple = [number, number];

  // Point-like number with `x` and `y` encoded  as a single value.
  // e.g. `scale={2}`
  export type PointLikeNumber = number;

  // Point-like string with `x` and `y` separated by a comma.
  // e.g. `anchor="1,0.5"`
  export type PointLikeString = string;

  // Point-like type.
  export type PointLike = PixiPoint | PointLikeObject | PointLikeTuple | PointLikeNumber | PointLikeString;

  // Properties of `T` that extend `PixiPoint`.
  export type PointProperties<T> = Extract<keyof T, Extract<KeysThatMayHaveType<T, PixiPoint>, KeysThatAreNotAny<T>>>;

  // Replace type of properties declared in `T` as `PIXI.IPoint` to `PointLike`.
  export type WithPointLike<T> =
    // Omit all properties declared it `T` as `PIXI.IPoint`.
    Omit<T, PointProperties<T>> &
      // Pick all point properties from `T` with type changed to `PointLike`.
      Pick<{ [U in PointProperties<T>]: PointLike }, PointProperties<T>>;

  /**
   * Interactivity
   */

  // Extra properties to add to allow us to set event handlers using props.
  export type InteractiveComponent = { [P in InteractionEventTypes]?: (event: InteractionEvent) => void };

  /**
   * Base components
   */

  type PixiElement<Props> = Props & React.ClassAttributes<Props> & InteractiveComponent;

  // This is similar to React.FunctionComponent<P>
  export interface PixiComponent<P = {}> {
    (props: PixiElement<P>): React.ReactElement<P>;
  }

  // Takes `PIXI.DisplayObject` or its subclass and updates its fields to be used with `ReactPixiFiber`.
  export type DisplayObjectProps<T> = PropsWithReactChildren<Partial<WithPointLike<T>>>;

  // A component wrapper for `PIXI.BitmapText` (or `PIXI.extras.BitmapText` in PixiJS v4).
  // see: http://pixijs.download/dev/docs/PIXI.BitmapText.html
  export type BitmapText = DisplayObjectProps<
    PixiTypeFallback<
      // @ts-ignore TS2694
      PIXI.extras.BitmapText,
      PIXI.BitmapText
    >
  > & {
    // `style` is not a property on `PIXI.BitmapText`, but is used in constructor
    style?: ConstructorParameters<
      PixiTypeFallback<
        // @ts-ignore TS2694
        typeof PIXI.extras.BitmapText,
        typeof PIXI.BitmapText
      >
    >[1];
  };
  export const BitmapText: PixiComponent<BitmapText>;

  // A component wrapper for `PIXI.Container`.
  // see: http://pixijs.download/dev/docs/PIXI.Container.html
  export type Container = DisplayObjectProps<PIXI.Container>;
  export const Container: PixiComponent<Container>;

  // A component wrapper for `PIXI.Graphics`.
  // see: http://pixijs.download/dev/docs/PIXI.Graphics.html
  export type Graphics = DisplayObjectProps<PIXI.Graphics>;
  export const Graphics: PixiComponent<Graphics>;

  // A component wrapper for `PIXI.NineSlicePlane` (or `PIXI.mesh.NineSlicePlane` in PixiJS v4).
  // see: http://pixijs.download/dev/docs/PIXI.NineSlicePlane.html
  export type NineSlicePlane = DisplayObjectProps<
    PixiTypeFallback<
      // @ts-ignore TS2694
      PIXI.mesh.NineSlicePlane,
      PIXI.NineSlicePlane
    >
  >;
  export const NineSlicePlane: PixiComponent<NineSlicePlane>;

  // A component wrapper for `PIXI.ParticleContainer` (or `PIXI.particles.ParticleContainer` in PixiJS v4).
  // see: http://pixijs.download/dev/docs/PIXI.ParticleContainer.html
  export type ParticleContainer = DisplayObjectProps<
    PixiTypeFallback<
      // @ts-ignore TS2694
      PIXI.particles.ParticleContainer,
      PIXI.ParticleContainer
    >
  >;
  export const ParticleContainer: PixiComponent<ParticleContainer>;

  // A component wrapper for `PIXI.Sprite`.
  // see: http://pixijs.download/dev/docs/PIXI.Sprite.html
  export type Sprite = DisplayObjectProps<PIXI.Sprite>;
  export const Sprite: PixiComponent<Sprite>;

  // A component wrapper for `PIXI.Text`.
  // see: http://pixijs.download/dev/docs/PIXI.Text.html
  export type Text = DisplayObjectProps<PIXI.Text>;
  export const Text: PixiComponent<Text>;

  // A component wrapper for `PIXI.TilingSprite` (or `PIXI.extras.TilingSprite` in PixiJS v4).
  // see: http://pixijs.download/dev/docs/PIXI.TilingSprite.html
  export type TilingSprite = DisplayObjectProps<
    PixiTypeFallback<
      // @ts-ignore TS2694
      PIXI.extras.TilingSprite,
      PIXI.TilingSprite
    >
  >;
  export const TilingSprite: PixiComponent<TilingSprite>;

  /**
   * Rendering: using Stage component or using render and unmount
   */

  interface StagePropsWithApp {
    app: PIXI.Application;
    options?: never;
  }
  interface StagePropsWithOptions {
    app?: never;
    // Take last element of constructor parameters which returns ApplicationOptions for both PixiJS v4 and v5
    options: LastInTuple<ConstructorParameters<typeof PIXI.Application>>;
  }

  export type StageAsCanvasProps = React.CanvasHTMLAttributes<HTMLCanvasElement>;
  export type StageAsContainerProps = DisplayObjectProps<PIXI.Container>;
  // Allow either `app` or `options` passed to `Stage` but not both.
  export type StageProps = Omit<
    (StagePropsWithApp | StagePropsWithOptions) & StageAsCanvasProps & StageAsContainerProps,
    "height" | "width"
  >;

  // Type of Stage as class component.
  export type StageClass = React.ComponentType<StageProps & { ref?: React.Ref<React.ReactNode> }> & {
    _app: PIXI.Application;
    props: StageProps;
  };

  // Type of Stage as function component.
  // TODO allow passing ref that would receive object of { _app: PIXI.Application } shape
  export type StageFunction = React.FunctionComponent<StageProps>;

  // A component wrapper for PIXI `Stage` as function component.
  // see: http://pixijs.download/dev/docs/PIXI.Application.html#stage
  export const Stage: StageFunction;

  // Factory returning Stage as class component.
  export function createStageClass(): StageClass;

  // Standalone ReactPixiFiber render method.
  export function render(
    pixiElement: React.ReactElement<any> | React.ReactElement<any>[] | PIXI.DisplayObject | PIXI.DisplayObject[],
    stage: PIXI.Container,
    callback?: Function
  ): void;

  // Standalone ReactPixiFiber unmount method.
  export function unmount(stage: PIXI.Container): void;

  /**
   * Custom components
   */

  // Used create an instance of `PIXI.DisplayObject`.
  // Also used as a `CustomPIXIComponent` `behavior` factory function.
  export type CustomDisplayObjectCreator<T extends PIXI.DisplayObject, P> = (props: P) => CustomDisplayObject<T, P>;

  // Used to apply `newProps` to your `CustomPIXIComponent` in a custom way.
  export type CustomDisplayObjectPropSetter<T extends PIXI.DisplayObject, P> = (
    displayObject: T,
    oldProps: P,
    newProps: P
  ) => void;

  // Used to do something after `displayObject` is attached, which happens after `componentDidMount` lifecycle method.
  export type CustomDisplayObjectAttachHandler<T extends PIXI.DisplayObject> = (displayObject: T) => void;

  // Used to do something (usually cleanup) before detaching `displayObject`, which happens before `componentWillUnmount` lifecycle method.
  export type CustomDisplayObjectDetachHandler<T extends PIXI.DisplayObject> = (displayObject: T) => void;

  // Inject API adds `_customApplyProps`, `_customDidAttach`, `_customWillDetach` methods.
  export interface CustomDisplayObject<T extends PIXI.DisplayObject, P> extends PIXI.DisplayObject {
    _customApplyProps?: CustomDisplayObjectPropSetter<T, P>;
    _customDidAttach?: CustomDisplayObjectAttachHandler<T>;
    _customWillDetach?: CustomDisplayObjectDetachHandler<T>;
  }

  // `CustomPIXIComponent` `behavior` object.
  export interface CustomPIXIComponentBehaviorDefinition<T extends PIXI.DisplayObject, P> {
    customDisplayObject: CustomDisplayObjectCreator<T, P>;
    customApplyProps?: CustomDisplayObjectPropSetter<T, P>;
    customDidAttach?: CustomDisplayObjectAttachHandler<T>;
    customWillDetach?: CustomDisplayObjectDetachHandler<T>;
  }

  // `CustomPIXIComponent` has `behavior` defined either as an object or factory function.
  export type CustomPIXIComponentBehavior<T extends PIXI.DisplayObject, P> =
    | CustomPIXIComponentBehaviorDefinition<T, P>
    | CustomDisplayObjectCreator<T, P>;

  // Create a custom component.
  export function CustomPIXIComponent<T extends PIXI.DisplayObject, P>(
    behavior: CustomPIXIComponentBehavior<T, P>,
    type: string
  ): // Props defined on custom component overwrite props of underlying DisplayObject
  PixiComponent<P & DisplayObjectProps<Omit<T, keyof P>>>;

  // Used to apply `newProps` to your `DisplayObject`.
  export function applyProps<T extends PIXI.DisplayObject, P>(displayObject: T, oldProps: P, newProps: P): void;

  /**
   * `PIXI.Application` context.
   */

  export const AppContext: React.Context<PIXI.Application>;

  // `withApp` higher-order component that injects `app` property of `PIXI.Application` type to your component.
  // You can use `interface ComponentProps extends PixiAppProperties {}` with component wrapped by `withApp`.
  export interface PixiAppProperties {
    app: PIXI.Application;
  }
  export function withApp<P extends PixiAppProperties>(
    Component: React.ComponentType<P>
  ): React.ComponentType<Omit<P, keyof PixiAppProperties>>;

  /**
   * Hooks
   */

  export function usePixiApp(): PIXI.Application;
  export function usePixiTicker(callback: (deltaTime: number) => void): void;

  /**
   * Batched updates
   */

  // BatchedUpdates same as ReactDOM.
  // see: https://github.com/AlexGalays/typescript-example/blob/5de2b59ba1984c41d24f022e1675f07c6015be5a/typings/react/react-dom.d.ts#L30
  export function unstable_batchedUpdates<A, B>(callback: (a: A, b: B) => any, a: A, b: B): void;
  export function unstable_batchedUpdates<A>(callback: (a: A) => any, a: A): void;
  export function unstable_batchedUpdates(callback: () => any): void;
}
