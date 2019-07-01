import ReactFiberReconciler from "react-reconciler";
import emptyObject from "fbjs/lib/emptyObject";
import invariant from "fbjs/lib/invariant";
import now from "performance-now";
import * as PIXI from "pixi.js";
import { createInjectedTypeInstance, isInjectedType } from "./inject";
import { CHILDREN, DEFAULT_PROPS } from "./props";
import { TYPES } from "./types";
import { filterByKey, including, includingReservedProps, not, setPixiValue } from "./utils";

/* Render Methods */

// TODO consider whitelisting props based on component type
export function defaultApplyProps(instance, oldProps, newProps) {
  Object.keys(newProps)
    .filter(not(includingReservedProps))
    .forEach(propName => {
      const value = newProps[propName];

      // Set value if defined
      if (typeof value !== "undefined") {
        setPixiValue(instance, propName, value);
      } else if (typeof instance[propName] !== "undefined" && typeof DEFAULT_PROPS[propName] !== "undefined") {
        // Reset to default value (if it is defined) when display object had prop set and no longer has
        if (__DEV__) {
          console.warn(`setting default value: ${propName} was ${instance[propName]} is ${value} for`, instance);
        }
        setPixiValue(instance, propName, DEFAULT_PROPS[propName]);
      } else {
        if (__DEV__) {
          console.warn(`ignoring prop: ${propName} was ${instance[propName]} is ${value} for`, instance);
        }
      }
    });
}

export function applyProps(instance, oldProps, newProps) {
  if (typeof instance._customApplyProps === "function") {
    instance._customApplyProps(instance, oldProps, newProps);
  } else {
    defaultApplyProps(instance, oldProps, newProps);
  }
}

// Calculate the diff between the two objects.
// See: https://github.com/facebook/react/blob/97e2911/packages/react-dom/src/client/ReactDOMFiberComponent.js#L546
export function diffProps(pixiElement, type, lastRawProps, nextRawProps, rootContainerElement) {
  let updatePayload = null;

  let lastProps = lastRawProps;
  let nextProps = nextRawProps;
  let propKey;

  for (propKey in lastProps) {
    if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
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
    if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || (nextProp == null && lastProp == null)) {
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

/* PixiJS Renderer */

export function appendChild(parentInstance, child) {
  // TODO do we need to remove the child first if it's already added?
  parentInstance.removeChild(child);

  parentInstance.addChild(child);
  if (typeof child._customDidAttach === "function") {
    child._customDidAttach(child);
  }
}

export function removeChild(parentInstance, child) {
  if (typeof child._customWillDetach === "function") {
    child._customWillDetach(child);
  }

  parentInstance.removeChild(child);

  child.destroy();
}

export function insertBefore(parentInstance, child, beforeChild) {
  invariant(child !== beforeChild, "ReactPixiFiber cannot insert node before itself");

  const childExists = parentInstance.children.indexOf(child) !== -1;

  if (childExists) {
    parentInstance.removeChild(child);
  }

  const index = parentInstance.getChildIndex(beforeChild);
  parentInstance.addChildAt(child, index);
}

export function commitUpdate(instance, updatePayload, type, lastRawProps, nextRawProps, internalInstanceHandle) {
  // injected types need to have full control over passed props
  if (isInjectedType(type)) {
    applyProps(instance, lastRawProps, nextRawProps);
    return;
  }

  // updatePayload is in the form of [propKey1, propValue1, ...]
  const updatedPropKeys = including(updatePayload.filter((item, i) => i % 2 === 0));
  const oldProps = filterByKey(lastRawProps, updatedPropKeys);
  const newProps = filterByKey(nextRawProps, updatedPropKeys);

  // regular components only receive props that have changed
  applyProps(instance, oldProps, newProps);
}

export function createInstance(type, props, internalInstanceHandle) {
  let instance;

  switch (type) {
    case TYPES.BITMAP_TEXT:
      try {
        instance = new PIXI.extras.BitmapText(props.text, props.style);
      } catch (e) {
        instance = new PIXI.BitmapText(props.text, props.style);
      }
      break;
    case TYPES.CONTAINER:
      instance = new PIXI.Container();
      break;
    case TYPES.GRAPHICS:
      instance = new PIXI.Graphics();
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
      instance = createInjectedTypeInstance(type, props, internalInstanceHandle, defaultApplyProps);
      break;
  }

  invariant(instance, "ReactPixiFiber does not support the type: `%s`.", type);

  applyProps(instance, {}, props);

  return instance;
}

export function createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
  invariant(false, "ReactPixiFiber does not support text instances. Use Text component instead.");
}

export function finalizeInitialChildren(pixiElement, type, props, rootContainerInstance, hostContext) {
  return false;
}

export function getChildHostContext(parentHostContext, type) {
  return emptyObject;
}

export function getRootHostContext(rootContainerInstance) {
  return emptyObject;
}

export function getPublicInstance(inst) {
  return inst;
}

export function prepareForCommit() {
  // Noop
}

export function prepareUpdate(pixiElement, type, oldProps, newProps, rootContainerInstance, hostContext) {
  return diffProps(pixiElement, type, oldProps, newProps, rootContainerInstance);
}

export function resetAfterCommit() {
  // Noop
}

export function resetTextContent(pixiElement) {
  // Noop
}

export function shouldDeprioritizeSubtree(type, props) {
  const isAlphaVisible = typeof props.alpha === "undefined" || props.alpha > 0;
  const isRenderable = typeof props.renderable === "undefined" || props.renderable === true;
  const isVisible = typeof props.visible === "undefined" || props.visible === true;

  return !(isAlphaVisible && isRenderable && isVisible);
}

export function shouldSetTextContent(type, props) {
  return false;
}

export function commitTextUpdate(textInstance, oldText, newText) {
  // Noop
}

export function commitMount(instance, type, newProps) {
  // Noop
}

export const supportsMutation = true;

const hostConfig = {
  appendChild: appendChild,
  appendChildToContainer: appendChild,
  appendInitialChild: appendChild,
  commitMount: commitMount,
  commitTextUpdate: commitTextUpdate,
  commitUpdate: commitUpdate,
  createInstance: createInstance,
  createTextInstance: createTextInstance,
  finalizeInitialChildren: finalizeInitialChildren,
  getChildHostContext: getChildHostContext,
  getRootHostContext: getRootHostContext,
  getPublicInstance: getPublicInstance,
  insertBefore: insertBefore,
  insertInContainerBefore: insertBefore,
  now: now,
  prepareForCommit: prepareForCommit,
  prepareUpdate: prepareUpdate,
  removeChild: removeChild,
  removeChildFromContainer: removeChild,
  resetAfterCommit: resetAfterCommit,
  resetTextContent: resetTextContent,
  shouldDeprioritizeSubtree: shouldDeprioritizeSubtree,
  shouldSetTextContent: shouldSetTextContent,
  supportsMutation: supportsMutation,
};

// React Pixi Fiber renderer is primary if used without React DOM
export const ReactPixiFiberAsPrimaryRenderer = ReactFiberReconciler({ ...hostConfig, isPrimaryRenderer: true });

// React Pixi Fiber renderer is secondary to React DOM renderer if used together
export const ReactPixiFiberAsSecondaryRenderer = ReactFiberReconciler({ ...hostConfig, isPrimaryRenderer: false });

// If use ReactDOM to render, try use ReactDOM.unstable_batchedUpdates
export const unstable_batchedUpdates = ReactPixiFiberAsPrimaryRenderer.batchedUpdates;

export default ReactPixiFiberAsSecondaryRenderer;
