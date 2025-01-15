import ReactFiberReconciler from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants";
import emptyObject from "fbjs/lib/emptyObject";
import invariant from "fbjs/lib/invariant";
import { createInstance, setInitialProperties, diffProperties, updateProperties } from "./ReactPixiFiberComponent";
import { validateProperties as validateUnknownProperties } from "./ReactPixiFiberUnknownPropertyHook";
import { findStrictRoot } from "./utils";

let validatePropertiesInDevelopment;

if (__DEV__) {
  validatePropertiesInDevelopment = function (type, props, internalHandle) {
    const strictRoot = findStrictRoot(internalHandle);
    if (strictRoot != null) {
      validateUnknownProperties(type, props);
    }
  };
}

/* PixiJS Renderer */

const noTimeout = -1;

export function afterActiveInstanceBlur() {
  // Noop
}

export function appendChild(parentInstance, child) {
  if (parentInstance == null) return;

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

export function detachDeletedInstance(node) {
  // Noop
}

export function finalizeInitialChildren(instance, type, props, rootContainer, hostContext) {
  setInitialProperties(type, instance, props, rootContainer, hostContext);
  return true;
}

export function getChildHostContext(parentHostContext, type, rootContainer) {
  return parentHostContext;
}

export function getCurrentEventPriority() {
  return DefaultEventPriority;
}

export function getInstanceFromNode() {
  invariant(false, "Not yet implemented.");
}

export function getInstanceFromScope() {
  invariant(false, "Not yet implemented.");
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

export function prepareScopeUpdate() {
  // Noop
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

export function shouldSetTextContent(type, props) {
  return false;
}

export function beforeActiveInstanceBlur() {
  // Noop
}

export function commitTextUpdate(textInstance, prevText, nextText) {
  // Noop
}

export function cancelTimeout(id) {
  clearTimeout(id);
}

export function clearContainer(container) {
  if (container) {
    container.removeChildren();
  }
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

export function now() {
  return typeof performance === "object" && typeof performance.now === "function"
    ? () => performance.now()
    : () => Date.now();
}

export const supportsMutation = true;
export const supportsPersistence = false;
export const supportsHydration = false;
export const supportsMicrotasks = true;

const hostConfig = {
  afterActiveInstanceBlur: afterActiveInstanceBlur,
  appendChild: appendChild,
  appendChildToContainer: appendChild,
  appendInitialChild: appendChild,
  beforeActiveInstanceBlur: beforeActiveInstanceBlur,
  cancelTimeout: cancelTimeout,
  clearContainer: clearContainer,
  commitMount: commitMount,
  commitTextUpdate: commitTextUpdate,
  commitUpdate: commitUpdate,
  createInstance: createInstance,
  createTextInstance: createTextInstance,
  detachDeletedInstance: detachDeletedInstance,
  finalizeInitialChildren: finalizeInitialChildren,
  getChildHostContext: getChildHostContext,
  getCurrentEventPriority: getCurrentEventPriority,
  getInstanceFromNode: getInstanceFromNode,
  getInstanceFromScope: getInstanceFromScope,
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
  prepareScopeUpdate: prepareScopeUpdate,
  removeChild: removeChild,
  removeChildFromContainer: removeChild,
  resetAfterCommit: resetAfterCommit,
  resetTextContent: resetTextContent,
  scheduleTimeout: scheduleTimeout,
  shouldSetTextContent: shouldSetTextContent,
  supportsHydration: supportsHydration,
  scheduleMicrotask:
    typeof queueMicrotask === "function"
      ? queueMicrotask
      : typeof Promise !== "undefined"
      ? callback =>
          Promise.resolve(null)
            .then(callback)
            .catch(error => {
              setTimeout(() => {
                throw error;
              });
            })
      : setTimeout,
  supportsMicrotasks: true,
  supportsMutation: supportsMutation,
  supportsPersistence: supportsPersistence,

  unhideInstance: unhideInstance,
  unhideTextInstance: unhideTextInstance,
};

// React Pixi Fiber renderer is primary if used without React DOM
export const ReactPixiFiberAsPrimaryRenderer = ReactFiberReconciler({ ...hostConfig, isPrimaryRenderer: true });

// React Pixi Fiber renderer is secondary to React DOM renderer if used together
export const ReactPixiFiberAsSecondaryRenderer = ReactFiberReconciler({ ...hostConfig, isPrimaryRenderer: false });

export default ReactPixiFiberAsSecondaryRenderer;
