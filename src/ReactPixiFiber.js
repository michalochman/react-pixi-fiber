import ReactFiberReconciler from "react-reconciler";
import emptyObject from "fbjs/lib/emptyObject";
import invariant from "fbjs/lib/invariant";
import {
  unstable_now as now,
  unstable_scheduleCallback as scheduleDeferredCallback,
  unstable_cancelCallback as cancelDeferredCallback,
} from "scheduler";
import { createInstance, setInitialProperties, diffProperties, updateProperties } from "./ReactPixiFiberComponent";
import { validateProperties as validateUnknownProperties } from "./ReactPixiFiberUnknownPropertyHook";

let findStrictRoot;
let validatePropertiesInDevelopment;

if (__DEV__) {
  // See https://github.com/facebook/react/blob/702fad4b1b48ac8f626ed3f35e8f86f5ea728084/packages/react-reconciler/src/ReactTypeOfMode.js#L13
  const StrictMode = 1;

  // Would be better if this was just exported from react-reconciler
  // Additional try/catch added in case the internal API changes
  // See: https://github.com/facebook/react/blob/702fad4b1b48ac8f626ed3f35e8f86f5ea728084/packages/react-reconciler/src/ReactStrictModeWarnings.new.js#L31
  findStrictRoot = fiber => {
    try {
      let maybeStrictRoot = null;

      let node = fiber;
      while (node !== null) {
        if (node.mode & StrictMode) {
          maybeStrictRoot = node;
        }
        node = node.return;
      }

      return maybeStrictRoot;
    } catch (e) {
      return null;
    }
  };

  validatePropertiesInDevelopment = function (type, props, internalHandle) {
    const strictRoot = findStrictRoot(internalHandle);
    validateUnknownProperties(type, props, strictRoot);
  };
}

/* PixiJS Renderer */

const noTimeout = -1;

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

  child.destroy({ children: true });
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

export function commitUpdate(instance, updatePayload, type, prevProps, nextProps, internalHandle) {
  updateProperties(type, instance, updatePayload, prevProps, nextProps, internalHandle);

  if (__DEV__) {
    validatePropertiesInDevelopment(type, nextProps, internalHandle);
  }
}

export function createTextInstance(text, rootContainer, hostContext, internalHandle) {
  invariant(false, "ReactPixiFiber does not support text instances. Use `Text` component instead.");
}

export function finalizeInitialChildren(instance, type, props, rootContainer, hostContext) {
  setInitialProperties(type, instance, props, rootContainer, hostContext);
  return true;
}

export function getChildHostContext(parentHostContext, type, rootContainer) {
  return parentHostContext;
}

export function getRootHostContext(rootContainer) {
  return emptyObject;
}

export function getPublicInstance(instance) {
  return instance;
}

export function prepareForCommit(containerInfo) {
  return null;
}

export function preparePortalMount(containerInfo) {
  // Noop
}

export function prepareUpdate(instance, type, oldProps, newProps, rootContainer, hostContext) {
  return diffProperties(type, instance, oldProps, newProps);
}

export function resetAfterCommit(containerInfo) {
  // Noop
}

export function resetTextContent(instance) {
  // Noop
}

export function scheduleTimeout(fn, delay) {
  setTimeout(fn, delay);
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

export function commitTextUpdate(textInstance, prevText, nextText) {
  // Noop
}

export function cancelTimeout(id) {
  clearTimeout(id);
}

export function clearContainer(container) {
  container.removeChildren();
}

export function commitMount(instance, type, props, internalHandle) {
  if (__DEV__) {
    validatePropertiesInDevelopment(type, props, internalHandle);
  }
}

export function hideInstance(instance) {
  instance.visible = false;
}

export function unhideInstance(instance, props) {
  instance.visible = typeof props.visible !== "undefined" ? props.visible : true;
}

export function hideTextInstance(instance) {
  // Noop
}

export function unhideTextInstance(instance, props) {
  // Noop
}

export const supportsMutation = true;

const hostConfig = {
  appendChild: appendChild,
  appendChildToContainer: appendChild,
  appendInitialChild: appendChild,
  cancelTimeout: cancelTimeout,
  clearContainer: clearContainer,
  commitMount: commitMount,
  commitTextUpdate: commitTextUpdate,
  commitUpdate: commitUpdate,
  createInstance: createInstance,
  createTextInstance: createTextInstance,
  finalizeInitialChildren: finalizeInitialChildren,
  getChildHostContext: getChildHostContext,
  getRootHostContext: getRootHostContext,
  getPublicInstance: getPublicInstance,
  hideInstance: hideInstance,
  hideTextInstance: hideTextInstance,
  insertBefore: insertBefore,
  insertInContainerBefore: insertBefore,
  noTimeout: noTimeout,
  now: now,
  prepareForCommit: prepareForCommit,
  preparePortalMount: preparePortalMount,
  prepareUpdate: prepareUpdate,
  removeChild: removeChild,
  removeChildFromContainer: removeChild,
  resetAfterCommit: resetAfterCommit,
  resetTextContent: resetTextContent,
  scheduleTimeout: scheduleTimeout,
  shouldSetTextContent: shouldSetTextContent,
  supportsMutation: supportsMutation,
  unhideInstance: unhideInstance,
  unhideTextInstance: unhideTextInstance,
  // needed before https://github.com/facebook/react/pull/14984
  cancelPassiveEffects: cancelDeferredCallback,
  scheduleDeferredCallback: scheduleDeferredCallback,
  schedulePassiveEffects: scheduleDeferredCallback,
  // needed before https://github.com/facebook/react/pull/19124
  shouldDeprioritizeSubtree: shouldDeprioritizeSubtree,
};

// React Pixi Fiber renderer is primary if used without React DOM
export const ReactPixiFiberAsPrimaryRenderer = ReactFiberReconciler({ ...hostConfig, isPrimaryRenderer: true });

// React Pixi Fiber renderer is secondary to React DOM renderer if used together
export const ReactPixiFiberAsSecondaryRenderer = ReactFiberReconciler({ ...hostConfig, isPrimaryRenderer: false });

// If use ReactDOM to render, try use ReactDOM.unstable_batchedUpdates
export const unstable_batchedUpdates = ReactPixiFiberAsPrimaryRenderer.batchedUpdates;

export default ReactPixiFiberAsSecondaryRenderer;
