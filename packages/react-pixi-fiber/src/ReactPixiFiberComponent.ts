// Based on: https://github.com/facebook/react/blob/27535e7bfcb63e8a4d65f273311e380b4ca12eff/packages/react-dom/src/client/ReactDOMFiberComponent.js
import invariant from "./invariant";
import warning from "./warning";
import type * as PIXI from "pixi.js";
import { getPixiAdapter } from "./config";
import { CHILDREN } from "./props";
import { DEPRECATED_TAGS } from "./tags";
import { createRegisteredInstance, getAdapterComponent, getBoundBehavior, resolveComponent } from "./registry";
import { setValueForProperty } from "./PixiPropertyOperations";
import { getOwn } from "./PixiProperty";

type Instance = PIXI.DisplayObject;
type Props = Record<string, any>;

const warnedDeprecatedTags: Record<string, boolean> = {};
const warnedShadowedTags: Record<string, boolean> = {};

// Tag resolution: the user `PIXIComponent` registry, then the adapter's components, then the deprecated tag map.
export function createInstance(
  type: string,
  props: Props,
  rootContainer?: unknown,
  hostContext?: unknown,
  internalHandle?: unknown
): PIXI.DisplayObject {
  getPixiAdapter(); // throws the missing-configure error before anything else
  let tag = type;
  let resolved = resolveComponent(type);
  if (resolved && resolved.source === "user") {
    if (__DEV__ && getAdapterComponent(type) && !warnedShadowedTags[type]) {
      warnedShadowedTags[type] = true;
      warning(
        false,
        "`%s` is registered with PIXIComponent and also defined by the PixiJS adapter. The PIXIComponent registration wins.",
        type
      );
    }
  }
  const deprecatedTag = getOwn(DEPRECATED_TAGS, type);
  if (!resolved && deprecatedTag !== undefined) {
    if (__DEV__ && !warnedDeprecatedTags[type]) {
      warnedDeprecatedTags[type] = true;
      warning(false, "Tag `%s` is deprecated, use `%s`. It will be removed in 4.0.0.", type, deprecatedTag);
    }
    tag = deprecatedTag;
    resolved = resolveComponent(tag);
  }
  invariant(
    resolved,
    'ReactPixiFiber does not know the tag `%s`. Register it with `PIXIComponent("%s", behavior)` or pass a PixiJS adapter that defines it to `configure`.',
    type,
    type
  );
  return createRegisteredInstance(tag, resolved.behavior, props, applyDisplayObjectProps) as PIXI.DisplayObject;
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
