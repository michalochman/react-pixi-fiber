import ReactFiberReconciler from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants";
import invariant from "./invariant";
import type * as PIXI from "pixi.js";
import { createInstance, setInitialProperties, diffProperties, updateProperties } from "./ReactPixiFiberComponent";
import { validateProperties as validateUnknownProperties } from "./ReactPixiFiberUnknownPropertyHook";
import { getBoundBehavior } from "./registry";
import { getStrictModeBit } from "./config";
import { findStrictRoot } from "./utils";

type Instance = PIXI.Container;
type Props = Record<string, any>;

const emptyObject = Object.freeze({}) as Record<string, never>;

let validatePropertiesInDevelopment: (type: string, props: Props, internalHandle: unknown) => void;

if (__DEV__) {
  validatePropertiesInDevelopment = function (type, props, internalHandle) {
    const strictRoot = findStrictRoot(internalHandle, getStrictModeBit());
    if (strictRoot != null) {
      validateUnknownProperties(type, props);
    }
  };
}

/* PixiJS Renderer */

const noTimeout = -1;

export function afterActiveInstanceBlur(): void {
  // Noop
}

export function appendChild(parentInstance: PIXI.Container | null | undefined, child: Instance): void {
  if (parentInstance == null) return;

  // TODO do we need to remove the child first if it's already added?
  parentInstance.removeChild(child);

  parentInstance.addChild(child);
  const bound = getBoundBehavior(child);
  if (bound && bound.afterAdd) bound.afterAdd(child);
}

export function removeChild(parentInstance: PIXI.Container, child: Instance): void {
  const bound = getBoundBehavior(child);
  if (bound && bound.beforeRemove) bound.beforeRemove(child);

  parentInstance.removeChild(child);

  child.destroy({ children: true });
}

export function insertBefore(parentInstance: PIXI.Container, child: Instance, beforeChild: Instance): void {
  invariant(child !== beforeChild, "ReactPixiFiber cannot insert node before itself");

  const childExists = parentInstance.children.indexOf(child) !== -1;

  if (childExists) {
    parentInstance.removeChild(child);
  }

  const index = parentInstance.getChildIndex(beforeChild);
  parentInstance.addChildAt(child, index);
  const bound = getBoundBehavior(child);
  if (bound && bound.afterAdd) bound.afterAdd(child);
}

export function commitUpdate(
  instance: Instance,
  updatePayload: unknown[],
  type: string,
  prevProps: Props,
  nextProps: Props,
  internalHandle: unknown
): void {
  updateProperties(type, instance, updatePayload, prevProps, nextProps, internalHandle);

  if (__DEV__) {
    validatePropertiesInDevelopment(type, nextProps, internalHandle);
  }
}

export function createTextInstance(
  text: string,
  rootContainer: unknown,
  hostContext: unknown,
  internalHandle: unknown
): never {
  invariant(false, "ReactPixiFiber does not support text instances. Use `Text` component instead.");
}

export function detachDeletedInstance(node: unknown): void {
  // Noop
}

export function finalizeInitialChildren(
  instance: Instance,
  type: string,
  props: Props,
  rootContainer: unknown,
  hostContext: unknown
): boolean {
  setInitialProperties(type, instance, props, rootContainer, hostContext);
  return true;
}

export function getChildHostContext<T>(parentHostContext: T, type: string, rootContainer: unknown): T {
  return parentHostContext;
}

export function getCurrentEventPriority(): number {
  return DefaultEventPriority;
}

export function getInstanceFromNode(): never {
  invariant(false, "Not yet implemented.");
}

export function getInstanceFromScope(): never {
  invariant(false, "Not yet implemented.");
}

export function getRootHostContext(rootContainer: unknown): object {
  return emptyObject;
}

export function getPublicInstance<T>(instance: T): T {
  return instance;
}

export function prepareForCommit(containerInfo: unknown): null {
  return null;
}

export function preparePortalMount(containerInfo: unknown): void {
  // Noop
}

export function prepareUpdate(
  instance: Instance,
  type: string,
  oldProps: Props,
  newProps: Props,
  rootContainer: unknown,
  hostContext: unknown
): unknown[] | null {
  return diffProperties(type, instance, oldProps, newProps);
}

export function prepareScopeUpdate(): void {
  // Noop
}

export function resetAfterCommit(containerInfo: unknown): void {
  // Noop
}

export function resetTextContent(instance: unknown): void {
  // Noop
}

export function scheduleTimeout(fn: () => void, delay?: number): void {
  setTimeout(fn, delay);
}

export function shouldSetTextContent(type: string, props: Props): boolean {
  return false;
}

export function beforeActiveInstanceBlur(): void {
  // Noop
}

export function commitTextUpdate(textInstance: unknown, prevText: string, nextText: string): void {
  // Noop
}

export function cancelTimeout(id: ReturnType<typeof setTimeout> | undefined): void {
  clearTimeout(id);
}

export function clearContainer(container: PIXI.Container | null | undefined): void {
  if (container) {
    container.removeChildren();
  }
}

export function commitMount(instance: Instance, type: string, props: Props, internalHandle: unknown): void {
  if (__DEV__) {
    validatePropertiesInDevelopment(type, props, internalHandle);
  }
}

export function hideInstance(instance: Instance): void {
  instance.visible = false;
}

export function unhideInstance(instance: Instance, props: Props): void {
  instance.visible = typeof props.visible !== "undefined" ? props.visible : true;
}

export function hideTextInstance(instance: unknown): void {
  // Noop
}

export function unhideTextInstance(instance: unknown, props: Props): void {
  // Noop
}

export function now(): () => number {
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
        ? (callback: () => void) =>
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
