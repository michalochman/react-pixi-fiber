import * as React from "react";
import * as PIXI from "pixi.js";

declare module "react-pixi-fiber" {
  /**
   * Helpers
   */

  // The shape of `T` without it's `children` property.
  type Childless<T> = Partial<Omit<T, "children">>;

  // Returns optional keys of `T`
  type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];
  // Returns required keys of `T`
  type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];
  // Returns keys `K` of `T` where `T[K]` is of type `U`
  type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];

  // Constructs a type by picking the set of optional properties `T`.
  type OptionalProperties<T> = Pick<T, OptionalKeys<T>>;
  // Constructs a type by picking the set of required properties `T`.
  type RequiredProperties<T> = Pick<T, RequiredKeys<T>>;

  /**
   * Points
   */

  // Point-like object with `x`, `y` keys.
  // e.g. `position={{ x: 13, y: 37 }}`
  export interface PointLikeObject {
    x: number;
    y: number;
  }

  // Point-like tuple with `x` and `y` encoded as a single value or provided as a separate values.
  // e.g. `pivot={[13, 37]}`
  export type PointLikeTuple = [number, number];

  // Point-like number with `x` and `y` encoded  as a single value
  // e.g. `scale={2}`
  export type PointLikeNumber = number;

  // Point-like string with `x` and `y` separated by a comma
  // e.g. `anchor="1,0.5"`
  export type PointLikeString = string;

  // Point-like type
  export type PointLike = PIXI.IPoint | PointLikeObject | PointLikeTuple | PointLikeNumber | PointLikeString;

  // Properties of `T` that extend `PIXI.IPoint` interface
  export type PointProperties<T> = Extract<keyof T, KeysOfType<Required<T>, PIXI.IPoint>>;

  // Replace type of properties declared in `T` as `PIXI.IPoint` to `PointLike`.
  export type WithPointLike<T> =
    // Omit all properties declared it `T` as `PIXI.IPoint`.
    Omit<T, PointProperties<T>> &
      // Pick all required point properties from `T` with type changed to `PointLike` and make sure they are still required.
      Pick<{ [U in PointProperties<RequiredProperties<T>>]: PointLike }, PointProperties<RequiredProperties<T>>> &
      // Pick all optional point properties from `T` with type changed to `PointLike` and make sure they are still optional.
      Pick<{ [U in PointProperties<OptionalProperties<T>>]?: PointLike }, PointProperties<OptionalProperties<T>>>;

  /**
   * Interactivity
   */

  // Extra properties to add to allow us to set event handlers using props.
  export type InteractiveComponent = {
    [P in PIXI.interaction.InteractionEventTypes]?: (event: PIXI.interaction.InteractionEvent) => void
  };

  /**
   * Base components
   */

  // Takes `PIXI.DisplayObject` or its subclass and updates its fields to be used with `ReactPixiFiber`.
  export type DisplayObjectProperties<T> = WithPointLike<Childless<T>> & InteractiveComponent;

  // A component wrapper for `PIXI.BitmapText`.
  // see: http://pixijs.download/dev/docs/PIXI.BitmapText.html
  export class BitmapText extends React.Component<DisplayObjectProperties<PIXI.BitmapText>> {}

  // A component wrapper for `PIXI.Container`.
  // see: http://pixijs.download/dev/docs/PIXI.Container.html
  export class Container extends React.Component<DisplayObjectProperties<PIXI.Container>> {}

  // A component wrapper for `PIXI.Graphics`.
  // see: http://pixijs.download/dev/docs/PIXI.Graphics.html
  export class Graphics extends React.Component<DisplayObjectProperties<PIXI.Graphics>> {}

  // A component wrapper for `PIXI.ParticleContainer`.
  // see: http://pixijs.download/dev/docs/PIXI.ParticleContainer.html
  export class ParticleContainer extends React.Component<DisplayObjectProperties<PIXI.ParticleContainer>> {}

  // A component wrapper for `PIXI.Sprite`.
  // see: http://pixijs.download/dev/docs/PIXI.Sprite.html
  export class Sprite extends React.Component<DisplayObjectProperties<PIXI.Sprite>> {}

  // A component wrapper for `PIXI.Text`.
  // see: http://pixijs.download/dev/docs/PIXI.Text.html
  export class Text extends React.Component<DisplayObjectProperties<PIXI.Text>> {}

  // A component wrapper for `PIXI.TilingSprite`.
  // see: http://pixijs.download/dev/docs/PIXI.TilingSprite.html
  export class TilingSprite extends React.Component<DisplayObjectProperties<PIXI.TilingSprite>> {}

  /**
   * Rendering: using Stage component or using render and unmount
   */

  interface StagePropertiesWithApp {
    app: PIXI.Application;
    options?: never;
  }
  interface StagePropertiesWithOptions {
    app?: never;
    options: ConstructorParameters<typeof PIXI.Application>[0];
  }

  // Allow either `app` or `options` passed to `Stage`.
  export type StageProperties = (StagePropertiesWithApp | StagePropertiesWithOptions) &
    React.CanvasHTMLAttributes<HTMLCanvasElement>;

  // A component wrapper for PIXI `Stage`.
  // see: http://pixijs.download/dev/docs/PIXI.Application.html
  export class Stage extends React.Component<StageProperties> {}
  export function createStageClass(): React.ComponentType<StageProperties>;

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
  export type CustomDisplayObjectCreator<DisplayObject extends PIXI.DisplayObject, Props> = (
    props: Props
  ) => CustomDisplayObject<DisplayObject, Props>;

  // Used to apply `newProps` to your `CustomPIXIComponent` in a custom way.
  export type CustomDisplayObjectPropSetter<DisplayObject extends PIXI.DisplayObject, Props> = (
    displayObject: DisplayObject,
    oldProps: Props,
    newProps: Props
  ) => void;

  // Used to do something after `displayObject` is attached, which happens after `componentDidMount` lifecycle method.
  export type CustomDisplayObjectAttachHandler<DisplayObject extends PIXI.DisplayObject> = (
    displayObject: DisplayObject
  ) => void;

  // Used to do something (usually cleanup) before detaching `displayObject`, which happens before `componentWillUnmount` lifecycle method.
  export type CustomDisplayObjectDetachHandler<DisplayObject extends PIXI.DisplayObject> = (
    displayObject: DisplayObject
  ) => void;

  // Inject API adds `_customApplyProps`, `_customDidAttach`, `_customWillDetach` methods.
  export interface CustomDisplayObject<DisplayObject extends PIXI.DisplayObject, Props> extends PIXI.DisplayObject {
    _customApplyProps?: CustomDisplayObjectPropSetter<DisplayObject, Props>;
    _customDidAttach?: CustomDisplayObjectAttachHandler<DisplayObject>;
    _customWillDetach?: CustomDisplayObjectDetachHandler<DisplayObject>;
  }

  // `CustomPIXIComponent` `behavior` object.
  export interface CustomPIXIComponentBehaviorDefinition<DisplayObject extends PIXI.DisplayObject, Props> {
    customDisplayObject: CustomDisplayObjectCreator<DisplayObject, Props>;
    customApplyProps?: CustomDisplayObjectPropSetter<DisplayObject, Props>;
    customDidAttach?: CustomDisplayObjectAttachHandler<DisplayObject>;
    customWillDetach?: CustomDisplayObjectDetachHandler<DisplayObject>;
  }

  // `CustomPIXIComponent` has `behavior` defined either as an object or factory function.
  export type CustomPIXIComponentBehavior<DisplayObject extends PIXI.DisplayObject, Props> =
    | CustomPIXIComponentBehaviorDefinition<DisplayObject, Props>
    | CustomDisplayObjectCreator<DisplayObject, Props>;

  // Create a custom component.
  export function CustomPIXIComponent<DisplayObject extends PIXI.DisplayObject, Props>(
    behavior: CustomPIXIComponentBehavior<DisplayObject, Props>,
    type: string
  ): React.ComponentType<Props & Omit<DisplayObjectProperties<DisplayObject>, keyof Props>>;

  // Used to apply `newProps` to your `DisplayObject`.
  export type applyProps<DisplayObject extends PIXI.DisplayObject, Props> = (
    displayObject: DisplayObject,
    oldProps: Props,
    newProps: Props
  ) => void;

  /**
   * `PIXI.Application` context.
   */

  export type AppContext = React.Context<PIXI.Application>;

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
