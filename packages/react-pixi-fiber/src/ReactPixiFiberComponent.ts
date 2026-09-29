// Based on: https://github.com/facebook/react/blob/27535e7bfcb63e8a4d65f273311e380b4ca12eff/packages/react-dom/src/client/ReactDOMFiberComponent.js
import invariant from "./invariant";
import * as PIXI from "pixi.js";
import { CHILDREN } from "./props";
import { TYPES } from "./tags";
import { createRegisteredInstance, getBoundBehavior, getUserComponent } from "./registry";
import { setValueForProperty } from "./PixiPropertyOperations";

type Instance = PIXI.DisplayObject;
type Props = Record<string, any>;

// PixiJS v4 keeps these classes under extras/mesh/particles, which v5+ does not export. Reading them from a
// plain copy of the namespace stops bundlers from reporting them as missing ES module exports.
const PIXI_V4 = Object.assign({}, PIXI) as unknown as Record<string, any>;

export function createInstance(
  type: string,
  props: Props,
  rootContainer?: unknown,
  hostContext?: unknown,
  internalHandle?: unknown
): PIXI.DisplayObject {
  let instance: PIXI.DisplayObject | undefined;

  switch (type) {
    case TYPES.BITMAP_TEXT:
      const style =
        typeof props.style !== "undefined"
          ? props.style
          : {
              align: props.align,
              font: props.font,
              tint: props.tint,
            };
      try {
        instance = new PIXI_V4.extras.BitmapText(props.text, style);
      } catch (e) {
        instance = new PIXI.BitmapText(props.text, style);
      }
      break;
    case TYPES.CONTAINER:
      instance = new PIXI.Container();
      break;
    case TYPES.GRAPHICS:
      instance = new PIXI.Graphics();
      break;
    case TYPES.NINE_SLICE_PLANE:
      try {
        instance = new PIXI_V4.mesh.NineSlicePlane(
          props.texture,
          props.leftWidth,
          props.topHeight,
          props.rightWidth,
          props.bottomHeight
        );
      } catch (e) {
        instance = new PIXI.NineSlicePlane(
          props.texture,
          props.leftWidth,
          props.topHeight,
          props.rightWidth,
          props.bottomHeight
        );
      }
      break;
    case TYPES.PARTICLE_CONTAINER:
      try {
        instance = new PIXI_V4.particles.ParticleContainer(
          props.maxSize,
          props.properties,
          props.batchSize,
          props.autoResize
        );
      } catch (e) {
        instance = new PIXI.ParticleContainer(props.maxSize, props.properties, props.batchSize, props.autoResize);
      }
      break;
    case TYPES.SPRITE:
      instance = new PIXI.Sprite(props.texture);
      break;
    case TYPES.TEXT:
      instance = new PIXI.Text(props.text, props.style, props.canvas);
      break;
    case TYPES.TILING_SPRITE:
      try {
        instance = new PIXI_V4.extras.TilingSprite(props.texture, props.width, props.height);
      } catch (e) {
        instance = new PIXI.TilingSprite(props.texture, props.width, props.height);
      }
      break;
    default: {
      const behavior = getUserComponent(type);
      invariant(behavior, "ReactPixiFiber does not support the type: `%s`.", type);
      instance = createRegisteredInstance(type, behavior, props, applyDisplayObjectProps) as PIXI.DisplayObject;
      break;
    }
  }

  invariant(instance, "ReactPixiFiber does not support the type: `%s`.", type);

  return instance;
}

export function setInitialPixiProperties(
  type: string,
  instance: Instance,
  rawProps: Props,
  rootContainer?: unknown,
  hostContext?: unknown
): void {
  for (const propKey in rawProps) {
    if (!rawProps.hasOwnProperty(propKey)) {
      continue;
    }
    const nextProp = rawProps[propKey];
    if (propKey === CHILDREN) {
      // Noop. Text children not supported
    } else {
      setValueForProperty(type, instance, propKey, nextProp);
    }
  }
}

export function setInitialProperties(
  type: string,
  instance: Instance,
  rawProps: Props,
  rootContainer?: unknown,
  hostContext?: unknown
): void {
  // components with their own applyProps need to have full control over passed props
  const bound = getBoundBehavior(instance);
  if (bound && bound.applyProps) {
    bound.applyProps(instance, undefined, rawProps);
    return;
  }

  setInitialPixiProperties(type, instance, rawProps, rootContainer, hostContext);
}

// Calculate the diff between the two objects.
// See: https://github.com/facebook/react/blob/97e2911/packages/react-dom/src/client/ReactDOMFiberComponent.js#L546
export function diffProperties(
  type: string,
  instance: Instance,
  lastRawProps: Props,
  nextRawProps: Props
): unknown[] | null {
  let updatePayload: unknown[] | null = null;

  let lastProps = lastRawProps;
  let nextProps = nextRawProps;
  let propKey;

  for (propKey in lastProps) {
    if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey)) {
      continue;
    }
    if (propKey === CHILDREN) {
      // Noop. Text children not supported
    } else {
      // For all other deleted properties we add it to the queue. We use
      // the whitelist in the commit phase instead.
      (updatePayload = updatePayload || []).push(propKey, null);
    }
  }
  for (propKey in nextProps) {
    const nextProp = nextProps[propKey];
    const lastProp = lastProps != null ? lastProps[propKey] : undefined;
    if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp) {
      continue;
    }
    if (propKey === CHILDREN) {
      // Noop. Text children not supported
    } else {
      // For any other property we always add it to the queue and then we
      // filter it out using the whitelist during the commit.
      (updatePayload = updatePayload || []).push(propKey, nextProp);
    }
  }
  return updatePayload;
}

// Used to apply `newProps` to your `DisplayObject`.
export function applyDisplayObjectProps<T extends PIXI.DisplayObject, P>(
  type: string,
  instance: T,
  oldProps: P,
  newProps: P
): void {
  const updatePayload = diffProperties(type, instance, oldProps as Props, newProps as Props);
  if (updatePayload !== null) {
    updatePixiProperties(type, instance, updatePayload);
  }
}

export function updatePixiProperties(
  type: string,
  instance: Instance,
  updatePayload: unknown[],
  prevProps?: Props,
  nextProps?: Props,
  internalHandle?: unknown
): void {
  for (let i = 0; i < updatePayload.length; i += 2) {
    const propKey = updatePayload[i] as string;
    const propValue = updatePayload[i + 1];
    if (propKey === CHILDREN) {
      // Noop. Text children not supported
    } else {
      setValueForProperty(type, instance, propKey, propValue, internalHandle);
    }
  }
}

// Apply the diff.
export function updateProperties(
  type: string,
  instance: Instance,
  updatePayload: unknown[],
  prevProps?: Props,
  nextProps?: Props,
  internalHandle?: unknown
): void {
  // components with their own applyProps need to have full control over passed props
  const bound = getBoundBehavior(instance);
  if (bound && bound.applyProps) {
    bound.applyProps(instance, prevProps, nextProps);
    return;
  }

  updatePixiProperties(type, instance, updatePayload, prevProps, nextProps, internalHandle);
}

// Re-applies props to an instance the way the component that created it does: through its own `applyProps`
// when it has one, otherwise through the display-object prop pipeline for its tag.
export function applyProps(
  instance: any,
  oldProps: Record<string, unknown> | undefined,
  newProps: Record<string, unknown>
): void {
  const bound = getBoundBehavior(instance);
  invariant(
    bound,
    "`applyProps` expects an instance that react-pixi-fiber created. Use `applyDisplayObjectProps(type, instance, oldProps, newProps)` for other display objects."
  );
  if (bound.applyProps) {
    bound.applyProps(instance, oldProps, newProps);
  } else {
    applyDisplayObjectProps(bound.tag, instance, oldProps || {}, newProps);
  }
}
