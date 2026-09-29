import type * as React from "react";
import type * as PIXI from "pixi.js";
import type { Behavior } from "./registry";

/**
 * Compatibility
 */

// Returns either real keys of `PIXI.interaction` (if it exists) or generic `string` (if it doesn't exist).
// `PIXI.interaction` was removed without deprecation notice in https://github.com/pixijs/pixi.js/pull/6681
// shipped in pixi.js@5.3.0. We want to support earlier versions of PixiJS as well so we need this hack for now.
// @ts-ignore TS2694
export type InteractionCompatibility = Exclude<keyof typeof PIXI.interaction, number | symbol>;
// Returns either real keys of `PIXI.InteractionEvent` (if it exists) or generic `string` (if it doesn't exist).
// `PIXI.InteractionEvent` was removed in pixi.js@7.0.0.
// @ts-ignore TS2694
export type InteractionEventCompatibility = Exclude<keyof typeof PIXI.InteractionEvent, number | symbol>;
export type InteractionEvent = string extends InteractionEventCompatibility
  ? never
  : string extends InteractionCompatibility
    ? // @ts-ignore TS2694
      PIXI.InteractionEvent
    : // @ts-ignore TS2694
      PIXI.interaction.InteractionEvent;
// Hardcoded due to the InteractionEventTypes being removed since pixi.js@6.0.0
export type InteractionPointerEvents =
  | "pointerdown"
  | "pointercancel"
  | "pointerup"
  | "pointertap"
  | "pointerupoutside"
  | "pointermove"
  | "pointerover"
  | "pointerout";
export type InteractionTouchEvents =
  | "touchstart"
  | "touchcancel"
  | "touchend"
  | "touchendoutside"
  | "touchmove"
  | "tap";
export type InteractionMouseEvents =
  | "rightdown"
  | "mousedown"
  | "rightup"
  | "mouseup"
  | "rightclick"
  | "click"
  | "rightupoutside"
  | "mouseupoutside"
  | "mousemove"
  | "mouseover"
  | "mouseout";
export type InteractionPixiEvents = "added" | "removed";
export type InteractionEventTypes =
  | InteractionPointerEvents
  | InteractionTouchEvents
  | InteractionMouseEvents
  | InteractionPixiEvents;

/**
 * Helpers
 */

// Returns keys `K` of `T` where type of `T[K]` partially matches `U`.
// e.g. KeysThatMayHaveType<{ foo: string, bar: string | null }, string> -> "foo" | "bar"
// e.g. KeysThatMayHaveType<{ foo: number, bar: string | null }, string> -> "bar"
export type KeysThatMayHaveType<T, U> = { [K in keyof T]: U extends T[K] ? K : never }[keyof T];

// Returns keys `K` of `T` where type of `T[K]` is not specifically `any`.
export type KeysThatAreNotAny<T> = { [K in keyof T]: any extends T[K] ? never : K }[keyof T];

// The shape of `T` with `children` property that React understands.
// Every `PIXI.DisplayObject` we wrap is a `PIXI.Container`, so all of them accept children.
export type PropsWithReactChildren<T> = Omit<T, "children"> & { children?: React.ReactNode };

// Returns `T` when it extends `PIXI.DisplayObject`, otherwise returns `U`.
// This is a hack which we use to be able to use these types with types from PixiJS v4 and v5
export type PixiTypeFallback<T, U> = T extends PIXI.DisplayObject ? T : U;

// Gets the length of an array/tuple type.
// see: https://dev.to/kjleitz/comment/gb5d
export type LengthOfTuple<T extends any[]> = T extends { length: infer L } ? L : never;

// Drops the first element of a tuple.
// see: https://dev.to/kjleitz/comment/gb5d
export type DropFirstInTuple<T extends any[]> = ((...args: T) => any) extends (arg: any, ...rest: infer U) => any
  ? U
  : T;

// Gets the type of the last element of a tuple.
// see: https://dev.to/kjleitz/comment/gb5d
export type LastInTuple<T extends any[]> = T[LengthOfTuple<DropFirstInTuple<T>>];

/**
 * Points
 */

// Point types used by PixiJS. PIXI.IPoint exists in PIXIJS v5 only.
export type PixiPoint = PIXI.Point | PIXI.ObservablePoint | PIXI.IPoint;

// Point-like object with `x`, `y` keys.
// e.g. `position={{ x: 13, y: 37 }}`
export interface PointLikeObject {
  x: number;
  y: number;
}

// Point-like tuple with `x` and `y` encoded as a single value or provided as a separate values.
// e.g. `pivot={[13, 37]}` or `scale={[2]}` (single element sets both `x` and `y`)
export type PointLikeTuple = [number] | [number, number];

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
export type InteractiveComponent = InteractionEvent extends never
  ? // pixi.js >= 7
    {}
  : // pixi.js <= 6
    { [P in InteractionEventTypes]?: (event: InteractionEvent) => void };

/**
 * Base components
 */

// `Instance` is the display object a `ref` on the component receives.
export type PixiElement<Props, Instance = Props> = Props & React.ClassAttributes<Instance> & InteractiveComponent;

// This is similar to React.FunctionComponent<P>
// `I` is the display object a `ref` on the component receives.
export interface PixiComponent<P = {}, I = P> {
  (props: PixiElement<P, I>): React.ReactElement<P>;
}

// Takes `PIXI.DisplayObject` or its subclass and updates its fields to be used with `ReactPixiFiber`.
export type DisplayObjectProps<T> = PropsWithReactChildren<Partial<WithPointLike<T>>>;

// A component wrapper for `PIXI.AnimatedSprite`.
// see: https://pixijs.download/v6.5.10/docs/PIXI.AnimatedSprite.html
export type AnimatedSpriteProps = DisplayObjectProps<PIXI.AnimatedSprite> & {
  // `autoUpdate` is not a property on `PIXI.AnimatedSprite`, but is used in constructor
  autoUpdate?: boolean;
};

// A component wrapper for `PIXI.BitmapText` (or `PIXI.extras.BitmapText` in PixiJS v4).
// see: https://pixijs.download/v6.5.10/docs/PIXI.BitmapText.html
export type BitmapTextProps = DisplayObjectProps<
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

// A component wrapper for `PIXI.Container`.
// see: https://pixijs.download/v6.5.10/docs/PIXI.Container.html
export type ContainerProps = DisplayObjectProps<PIXI.Container>;

// A component wrapper for `PIXI.Graphics`.
// see: https://pixijs.download/v6.5.10/docs/PIXI.Graphics.html
export type GraphicsProps = DisplayObjectProps<PIXI.Graphics>;

// A component wrapper for `PIXI.NineSlicePlane` (or `PIXI.mesh.NineSlicePlane` in PixiJS v4).
// see: https://pixijs.download/v6.5.10/docs/PIXI.NineSlicePlane.html
export type NineSliceSpriteProps = DisplayObjectProps<
  PixiTypeFallback<
    // @ts-ignore TS2694
    PIXI.mesh.NineSlicePlane,
    PIXI.NineSlicePlane
  >
>;
/** @deprecated Renamed to `NineSliceSpriteProps`, removed in 4.0.0 */
export type NineSlicePlaneProps = NineSliceSpriteProps;

// A component wrapper for `PIXI.Mesh`.
// see: https://pixijs.download/v6.5.10/docs/PIXI.Mesh.html
export type MeshProps = DisplayObjectProps<PIXI.Mesh>;

// A component wrapper for `PIXI.SimpleMesh`.
// see: https://pixijs.download/v6.5.10/docs/PIXI.SimpleMesh.html
export type MeshSimpleProps = DisplayObjectProps<PIXI.SimpleMesh> & {
  // Constructor arguments that are not properties on `PIXI.SimpleMesh`
  uvs?: Float32Array | number[];
  indices?: Uint16Array | number[];
};

// A component wrapper for `PIXI.SimplePlane`.
// see: https://pixijs.download/v6.5.10/docs/PIXI.SimplePlane.html
export type MeshPlaneProps = DisplayObjectProps<PIXI.SimplePlane> & {
  // Constructor arguments that are not properties on `PIXI.SimplePlane`
  verticesX?: number;
  verticesY?: number;
};

// A component wrapper for `PIXI.SimpleRope`.
// see: https://pixijs.download/v6.5.10/docs/PIXI.SimpleRope.html
export type MeshRopeProps = DisplayObjectProps<PIXI.SimpleRope> & {
  // Constructor arguments that are not properties on `PIXI.SimpleRope`
  points?: PIXI.IPoint[];
  textureScale?: number;
};

// A component wrapper for `PIXI.ParticleContainer` (or `PIXI.particles.ParticleContainer` in PixiJS v4).
// see: https://pixijs.download/v6.5.10/docs/PIXI.ParticleContainer.html
export type ParticleContainerProps = DisplayObjectProps<
  PixiTypeFallback<
    // @ts-ignore TS2694
    PIXI.particles.ParticleContainer,
    PIXI.ParticleContainer
  >
>;

// A component wrapper for `PIXI.Sprite`.
// see: https://pixijs.download/v6.5.10/docs/PIXI.Sprite.html
export type SpriteProps = DisplayObjectProps<PIXI.Sprite>;

// A component wrapper for `PIXI.Text`.
// see: https://pixijs.download/v6.5.10/docs/PIXI.Text.html
export type TextProps = Omit<DisplayObjectProps<PIXI.Text>, "style"> & {
  // `PIXI.Text` reads `style` as `TextStyle` but its setter also accepts a partial style.
  style?: PIXI.TextStyle | Partial<PIXI.ITextStyle>;
};

// A component wrapper for `PIXI.TilingSprite` (or `PIXI.extras.TilingSprite` in PixiJS v4).
// see: https://pixijs.download/v6.5.10/docs/PIXI.TilingSprite.html
export type TilingSpriteProps = DisplayObjectProps<
  PixiTypeFallback<
    // @ts-ignore TS2694
    PIXI.extras.TilingSprite,
    PIXI.TilingSprite
  >
>;

/**
 * PixiJS adapter
 */

// Prop names the core types, by kind. Names not listed are set on the instance as-is (decision 1).
export interface PixiPropertyTable {
  boolean: readonly string[];
  numeric: readonly string[];
  positiveNumeric: readonly string[];
  vector: readonly string[];
  callback: readonly string[];
}

export interface PixiAdapter {
  components: Record<string, Behavior>;
  defaults?: Record<string, Record<string, unknown>>;
  properties: PixiPropertyTable;
  isPoint(value: unknown): value is { x: number; y: number };
  copyPoint(target: { x: number; y: number }, value: { x: number; y: number }): void;
  createApplication(options: Record<string, unknown>): unknown | Promise<unknown>;
  destroyApplication(app: any, removeView: boolean, stageOptions: unknown): void;
  isApplication(value: unknown): boolean;
  translateProps?(type: string, props: Record<string, unknown>): Record<string, unknown>;
}

/**
 * React adapter
 */

// The core's tree and prop operations, independent of the react-reconciler version. A React adapter builds its
// reconciler host config from them.
export interface HostOps {
  createInstance(type: string, props: Record<string, unknown>, rootContainer: unknown): any;
  appendChild(parent: any, child: any): void;
  insertBefore(parent: any, child: any, before: any): void;
  removeChild(parent: any, child: any): void;
  clearContainer(container: any): void;
  hideInstance(instance: any): void;
  unhideInstance(instance: any, props: Record<string, unknown>): void;
  setInitialProperties(type: string, instance: any, props: Record<string, unknown>): void;
  diffProperties(
    type: string,
    instance: any,
    prevProps: Record<string, unknown>,
    nextProps: Record<string, unknown>
  ): unknown[] | null;
  updateProperties(
    type: string,
    instance: any,
    payload: unknown[] | null,
    prevProps: Record<string, unknown>,
    nextProps: Record<string, unknown>,
    internalHandle?: unknown
  ): void;
  // Development only. `internalHandle` is the fiber, so the core can gate on <StrictMode> with the adapter's bit.
  validateProperties(type: string, props: Record<string, unknown>, internalHandle?: unknown): void;
}

export interface Renderer {
  render(element: React.ReactNode, container: any, callback?: () => void, parentComponent?: unknown): unknown;
  unmount(container: any): void;
  getStackAddendum(): string;
}

export interface ReactAdapter {
  createRenderer(hostOps: HostOps, options: { isPrimaryRenderer: boolean }): Renderer;
  strictModeBit: number;
}

/**
 * Rendering: using Stage component or using render and unmount
 */

export interface StagePropsWithApp {
  app: PIXI.Application;
  options?: never;
}
export interface StagePropsWithOptions {
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
> & {
  /** Called with the application after the first render of `children` into `app.stage`. */
  onInit?: (app: PIXI.Application) => void;
  /** @deprecated Pass `width` in `options`. */
  width?: number;
  /** @deprecated Pass `height` in `options`. */
  height?: number;
};

export type StageRef = {
  _app: React.RefObject<PIXI.Application>;
  _canvas: React.RefObject<HTMLCanvasElement>;
  props: StageProps;
};

// Type of Stage component.
export type StageComponent = React.ForwardRefExoticComponent<StageProps & { ref?: React.Ref<StageRef> }> & StageRef;

/**
 * Components registered with `PIXIComponent`
 */

// A display object created by a `PIXIComponent` behavior.
export type PIXIComponentInstance<T extends PIXI.DisplayObject, P> = T;

// Used create an instance of `PIXI.DisplayObject`.
// Also used as a `PIXIComponent` `behavior` factory function.
export type DisplayObjectCreator<T extends PIXI.DisplayObject, P> = (props: P) => PIXIComponentInstance<T, P>;

// Props accepted by a `PIXIComponent`: props defined on the component overwrite props of underlying DisplayObject.
export type PIXIComponentProps<T extends PIXI.DisplayObject, P> = P & DisplayObjectProps<Omit<T, keyof P>>;

// `this` available inside `applyProps`, see `registry.ts`.
// `applyDisplayObjectProps` is already bound to `type` and `displayObject`.
export interface DisplayObjectPropSetterContext<T extends PIXI.DisplayObject, P> {
  applyDisplayObjectProps: (
    oldProps: Partial<PIXIComponentProps<T, P>> | undefined,
    newProps: Partial<PIXIComponentProps<T, P>>
  ) => void;
}

// Used to apply `newProps` to your `PIXIComponent` in a custom way.
export type DisplayObjectPropSetter<T extends PIXI.DisplayObject, P> = (
  this: DisplayObjectPropSetterContext<T, P>,
  displayObject: T,
  oldProps: P | undefined,
  newProps: P
) => void;

// Used to do something after `displayObject` is added to its parent, which happens before `componentDidMount`.
export type DisplayObjectAttachHandler<T extends PIXI.DisplayObject> = (displayObject: T) => void;

// Used to do something (usually cleanup) before removing `displayObject`, which happens after `componentWillUnmount`.
export type DisplayObjectDetachHandler<T extends PIXI.DisplayObject> = (displayObject: T) => void;

// `PIXIComponent` `behavior` object.
export interface PIXIComponentBehaviorDefinition<T extends PIXI.DisplayObject, P> {
  create: DisplayObjectCreator<T, P>;
  applyProps?: DisplayObjectPropSetter<T, P>;
  afterAdd?: DisplayObjectAttachHandler<T>;
  beforeRemove?: DisplayObjectDetachHandler<T>;
}

// The 2.x `behavior` object keys. The registry maps them to the new keys and warns once per key in development.
export interface LegacyPIXIComponentBehaviorDefinition<T extends PIXI.DisplayObject, P> {
  /** @deprecated use `create` */
  customDisplayObject: DisplayObjectCreator<T, P>;
  /** @deprecated use `applyProps` */
  customApplyProps?: DisplayObjectPropSetter<T, P>;
  /** @deprecated use `afterAdd` */
  customDidAttach?: DisplayObjectAttachHandler<T>;
  /** @deprecated use `beforeRemove` */
  customWillDetach?: DisplayObjectDetachHandler<T>;
}

// `PIXIComponent` has `behavior` defined either as an object or factory function.
export type PIXIComponentBehavior<T extends PIXI.DisplayObject, P> =
  | PIXIComponentBehaviorDefinition<T, P>
  | LegacyPIXIComponentBehaviorDefinition<T, P>
  | DisplayObjectCreator<T, P>;

/** @deprecated Renamed to `PIXIComponentInstance`, removed in 4.0.0 */
export type CustomDisplayObject<T extends PIXI.DisplayObject, P> = PIXIComponentInstance<T, P>;
/** @deprecated Renamed to `DisplayObjectCreator`, removed in 4.0.0 */
export type CustomDisplayObjectCreator<T extends PIXI.DisplayObject, P> = DisplayObjectCreator<T, P>;
/** @deprecated Renamed to `PIXIComponentProps`, removed in 4.0.0 */
export type CustomPIXIComponentProps<T extends PIXI.DisplayObject, P> = PIXIComponentProps<T, P>;
/** @deprecated Renamed to `DisplayObjectPropSetterContext`, removed in 4.0.0 */
export type CustomDisplayObjectPropSetterContext<T extends PIXI.DisplayObject, P> = DisplayObjectPropSetterContext<
  T,
  P
>;
/** @deprecated Renamed to `DisplayObjectPropSetter`, removed in 4.0.0 */
export type CustomDisplayObjectPropSetter<T extends PIXI.DisplayObject, P> = DisplayObjectPropSetter<T, P>;
/** @deprecated Renamed to `DisplayObjectAttachHandler`, removed in 4.0.0 */
export type CustomDisplayObjectAttachHandler<T extends PIXI.DisplayObject> = DisplayObjectAttachHandler<T>;
/** @deprecated Renamed to `DisplayObjectDetachHandler`, removed in 4.0.0 */
export type CustomDisplayObjectDetachHandler<T extends PIXI.DisplayObject> = DisplayObjectDetachHandler<T>;
/** @deprecated Renamed to `PIXIComponentBehaviorDefinition` (new keys), removed in 4.0.0 */
export type CustomPIXIComponentBehaviorDefinition<
  T extends PIXI.DisplayObject,
  P,
> = LegacyPIXIComponentBehaviorDefinition<T, P>;
/** @deprecated Renamed to `PIXIComponentBehavior`, removed in 4.0.0 */
export type CustomPIXIComponentBehavior<T extends PIXI.DisplayObject, P> = PIXIComponentBehavior<T, P>;

/**
 * `PIXI.Application` context.
 */

// You can use `interface ComponentProps extends PixiAppProperties {}` with component wrapped by `withApp`.
export interface PixiAppProperties {
  app: PIXI.Application;
}
