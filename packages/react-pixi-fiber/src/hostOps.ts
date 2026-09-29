import { createInstance, diffProperties, setInitialProperties, updateProperties } from "./ReactPixiFiberComponent";
import { validateProperties as validateUnknownProperties } from "./ReactPixiFiberUnknownPropertyHook";
import { getBoundBehavior } from "./registry";
import { getStrictModeBit } from "./configure";
import { findStrictRoot } from "./utils";
import invariant from "./invariant";
import type { HostOps } from "./types";

export function appendChild(parentInstance: any, child: any): void {
  if (parentInstance == null) return;

  // TODO do we need to remove the child first if it's already added?
  parentInstance.removeChild(child);

  parentInstance.addChild(child);
  const bound = getBoundBehavior(child);
  if (bound && bound.afterAdd) bound.afterAdd(child);
}

export function removeChild(parentInstance: any, child: any): void {
  const bound = getBoundBehavior(child);
  if (bound && bound.beforeRemove) bound.beforeRemove(child);

  parentInstance.removeChild(child);

  child.destroy({ children: true });
}

export function insertBefore(parentInstance: any, child: any, beforeChild: any): void {
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

export function clearContainer(container: any): void {
  if (container) {
    container.removeChildren();
  }
}

export function hideInstance(instance: any): void {
  instance.visible = false;
}

export function unhideInstance(instance: any, props: Record<string, unknown>): void {
  instance.visible = typeof props.visible !== "undefined" ? props.visible : true;
}

// Development only: validates under a <StrictMode> ancestor, found on the fiber with the React adapter's mode bit.
export function validateProperties(type: string, props: Record<string, unknown>, internalHandle?: unknown): void {
  if (!__DEV__) return;
  if (findStrictRoot(internalHandle, getStrictModeBit()) != null) validateUnknownProperties(type, props);
}

export const hostOps: HostOps = {
  createInstance: (type, props, rootContainer) => createInstance(type, props, rootContainer),
  appendChild,
  insertBefore,
  removeChild,
  clearContainer,
  hideInstance,
  unhideInstance,
  setInitialProperties,
  diffProperties,
  updateProperties,
  validateProperties,
};
