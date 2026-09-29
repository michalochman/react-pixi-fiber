import {
  createInstance,
  diffProperties,
  setInitialProperties,
  translate,
  updateProperties,
} from "./ReactPixiFiberComponent";
import { validateProperties as validateUnknownProperties } from "./ReactPixiFiberUnknownPropertyHook";
import { getBoundBehavior } from "./registry";
import { getStrictModeBit } from "./configure";
import { findStrictRoot } from "./utils";
import invariant from "./invariant";
import type { HostOps, PixiFragmentInstance } from "./types";

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
  if (findStrictRoot(internalHandle, getStrictModeBit()) != null)
    validateUnknownProperties(type, translate(type, props));
}

type Listener = (...args: any[]) => void;

// The children are read on each access, so their order stays current; the reconciler reports added and removed
// children only so their listeners follow.
class FragmentInstance implements PixiFragmentInstance {
  listeners: [string, Listener][] = [];
  readChildren: () => any[];

  constructor(readChildren: () => any[]) {
    this.readChildren = readChildren;
  }

  get children(): any[] {
    return this.readChildren();
  }

  getBounds(): any[] {
    return this.children.filter(child => typeof child.getBounds === "function").map(child => child.getBounds());
  }

  off(event: string, fn: Listener): void {
    const count = this.listeners.length;
    this.listeners = this.listeners.filter(([e, f]) => e !== event || f !== fn);
    if (this.listeners.length === count) return;
    for (const child of this.children) child.off(event, fn);
  }

  on(event: string, fn: Listener): void {
    if (this.listeners.some(([e, f]) => e === event && f === fn)) return;
    this.listeners.push([event, fn]);
    for (const child of this.children) child.on(event, fn);
  }
}

// The reconciler can report a child twice (added while hidden, then revealed), and a PixiJS EventEmitter keeps
// duplicates, so each listener is removed before it is added.
export function commitNewChildToFragmentInstance(child: any, instance: PixiFragmentInstance): void {
  for (const [event, fn] of (instance as FragmentInstance).listeners) {
    child.off(event, fn);
    child.on(event, fn);
  }
}

export function createFragmentInstance(readChildren: () => any[]): PixiFragmentInstance {
  return new FragmentInstance(readChildren);
}

export function deleteChildFromFragmentInstance(child: any, instance: PixiFragmentInstance): void {
  for (const [event, fn] of (instance as FragmentInstance).listeners) child.off(event, fn);
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
  commitNewChildToFragmentInstance,
  createFragmentInstance,
  deleteChildFromFragmentInstance,
};
