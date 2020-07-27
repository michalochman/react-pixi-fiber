// Based on: https://github.com/facebook/react/blob/27535e7bfcb63e8a4d65f273311e380b4ca12eff/packages/react-dom/src/client/ReactDOMFiberComponent.js
import invariant from "fbjs/lib/invariant";
import * as PIXI from "pixi.js";
import { CHILDREN } from "./props";
import { TYPES } from "./types";
import { createInjectedTypeInstance, isInjectedType } from "./inject";
import { setValueForProperty } from "./PixiPropertyOperations";
import { validateProperties as validateUnknownProperties } from "./ReactPixiFiberUnknownPropertyHook";

let validatePropertiesInDevelopment;

if (__DEV__) {
  validatePropertiesInDevelopment = function(type, props) {
    validateUnknownProperties(type, props);
  };
}

export function createInstance(type, props, internalInstanceHandle) {
  let instance;

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
        instance = new PIXI.extras.BitmapText(props.text, style);
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
        instance = new PIXI.mesh.NineSlicePlane(
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
        instance = new PIXI.particles.ParticleContainer(
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
        instance = new PIXI.extras.TilingSprite(props.texture, props.width, props.height);
      } catch (e) {
        instance = new PIXI.TilingSprite(props.texture, props.width, props.height);
      }
      break;
    default:
      instance = createInjectedTypeInstance(type, props, internalInstanceHandle, applyDisplayObjectProps);
      break;
  }

  invariant(instance, "ReactPixiFiber does not support the type: `%s`.", type);

  return instance;
}

export function setInitialCustomComponentProperties(type, instance, rawProps, rootContainerElement) {
  instance._customApplyProps(instance, undefined, rawProps);
}

export function setInitialPixiProperties(type, instance, rawProps, rootContainerElement) {
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

export function setInitialProperties(type, instance, rawProps, rootContainerElement) {
  // injected types with customApplyProps need to have full control over passed props
  if (isInjectedType(type) && typeof instance._customApplyProps === "function") {
    setInitialCustomComponentProperties(type, instance, rawProps, rootContainerElement);
    return;
  }

  if (__DEV__) {
    validatePropertiesInDevelopment(type, rawProps);
  }

  setInitialPixiProperties(type, instance, rawProps, rootContainerElement);
}

// Calculate the diff between the two objects.
// See: https://github.com/facebook/react/blob/97e2911/packages/react-dom/src/client/ReactDOMFiberComponent.js#L546
export function diffProperties(type, instance, lastRawProps, nextRawProps, rootContainerElement) {
  if (__DEV__) {
    validatePropertiesInDevelopment(type, nextRawProps);
  }

  let updatePayload = null;

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

export function applyDisplayObjectProps(type, instance, oldProps, newProps) {
  const updatePayload = diffProperties(type, instance, oldProps, newProps);
  if (updatePayload !== null) {
    updatePixiProperties(type, instance, updatePayload);
  }
}

export function updateCustomComponentProperties(
  type,
  instance,
  updatePayload,
  lastRawProps,
  nextRawProps,
  internalInstanceHandle
) {
  instance._customApplyProps(instance, lastRawProps, nextRawProps);
}

export function updatePixiProperties(
  type,
  instance,
  updatePayload,
  lastRawProps,
  nextRawProps,
  internalInstanceHandle
) {
  for (let i = 0; i < updatePayload.length; i += 2) {
    const propKey = updatePayload[i];
    const propValue = updatePayload[i + 1];
    if (propKey === CHILDREN) {
      // Noop. Text children not supported
    } else {
      setValueForProperty(type, instance, propKey, propValue);
    }
  }
}

// Apply the diff.
export function updateProperties(type, instance, updatePayload, lastRawProps, nextRawProps, internalInstanceHandle) {
  // injected types with customApplyProps need to have full control over passed props
  if (isInjectedType(type) && typeof instance._customApplyProps === "function") {
    updateCustomComponentProperties(type, instance, updatePayload, lastRawProps, nextRawProps, internalInstanceHandle);
    return;
  }

  updatePixiProperties(type, instance, updatePayload, lastRawProps, nextRawProps, internalInstanceHandle);
}
