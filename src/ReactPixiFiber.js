import ReactFiberReconciler from "react-reconciler";
import emptyObject from "fbjs/lib/emptyObject";
import invariant from "fbjs/lib/invariant";
import {
  unstable_now as now,
  unstable_scheduleCallback as scheduleDeferredCallback,
  unstable_cancelCallback as cancelDeferredCallback,
} from "scheduler";
import { createInstance, setInitialProperties, diffProperties, updateProperties } from "./ReactPixiFiberComponent";

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

export function commitUpdate(instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
  updateProperties(type, instance, updatePayload, oldProps, newProps, internalInstanceHandle);
}

export function createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
  invariant(false, "ReactPixiFiber does not support text instances. Use `Text` component instead.");
}

export function finalizeInitialChildren(instance, type, props, rootContainerInstance) {
  setInitialProperties(type, instance, props, rootContainerInstance);
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

export function prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance, hostContext) {
  return diffProperties(type, instance, oldProps, newProps, rootContainerInstance);
}

export function resetAfterCommit() {
  // Noop
}

export function resetTextContent(instance) {
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
  cancelPassiveEffects: cancelDeferredCallback,
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
  now: now,
  prepareForCommit: prepareForCommit,
  prepareUpdate: prepareUpdate,
  removeChild: removeChild,
  removeChildFromContainer: removeChild,
  resetAfterCommit: resetAfterCommit,
  resetTextContent: resetTextContent,
  scheduleDeferredCallback: scheduleDeferredCallback,
  schedulePassiveEffects: scheduleDeferredCallback,
  shouldDeprioritizeSubtree: shouldDeprioritizeSubtree,
  shouldSetTextContent: shouldSetTextContent,
  supportsMutation: supportsMutation,
  unhideInstance: unhideInstance,
  unhideTextInstance: unhideTextInstance,
};

// React Pixi Fiber renderer is primary if used without React DOM
export const ReactPixiFiberAsPrimaryRenderer = ReactFiberReconciler({ ...hostConfig, isPrimaryRenderer: true });

// React Pixi Fiber renderer is secondary to React DOM renderer if used together
export const ReactPixiFiberAsSecondaryRenderer = ReactFiberReconciler({ ...hostConfig, isPrimaryRenderer: false });

// If use ReactDOM to render, try use ReactDOM.unstable_batchedUpdates
export const unstable_batchedUpdates = ReactPixiFiberAsPrimaryRenderer.batchedUpdates;

export default ReactPixiFiberAsSecondaryRenderer;
