import React from "react";
import Reconciler from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants";
import type { HostOps, ReactAdapter, Renderer } from "react-pixi-fiber";

// https://github.com/facebook/react/blob/v18.3.1/packages/react-reconciler/src/ReactTypeOfMode.js: StrictLegacyMode
export const strictModeBit = 8;
const LegacyRoot = 0;
const emptyObject = Object.freeze({});

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const scheduleMicrotask: (callback: () => void) => void =
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
      : setTimeout;

// The mutation host config of react-reconciler 0.29.2. The hydration, persistence and test selector keys are left
// out: the reconciler reads them only behind supportsHydration, supportsPersistence and supportsTestSelectors.
// Typed loosely on purpose: it goes straight into Reconciler, and the declaration stays free of inferred core types.
export function createHostConfig(hostOps: HostOps): Record<string, unknown> {
  return {
    supportsMutation: true,
    supportsPersistence: false,
    supportsHydration: false,
    supportsMicrotasks: true,
    supportsTestSelectors: false,
    noTimeout: -1,
    scheduleTimeout: setTimeout,
    cancelTimeout: clearTimeout,
    scheduleMicrotask,
    now: () =>
      typeof performance === "object" && typeof performance.now === "function" ? performance.now() : Date.now(),
    getCurrentEventPriority: () => DefaultEventPriority,
    getRootHostContext: () => emptyObject,
    getChildHostContext: (parentHostContext: unknown) => parentHostContext,
    getPublicInstance: (instance: unknown) => instance,
    prepareForCommit: () => null,
    resetAfterCommit() {},
    preparePortalMount() {},
    shouldSetTextContent: () => false,
    createInstance: (type: string, props: Record<string, unknown>, rootContainer: unknown) =>
      hostOps.createInstance(type, props, rootContainer),
    createTextInstance() {
      invariant(false, "ReactPixiFiber does not support text instances. Use `Text` component instead.");
    },
    appendInitialChild: hostOps.appendChild,
    appendChild: hostOps.appendChild,
    appendChildToContainer: hostOps.appendChild,
    insertBefore: hostOps.insertBefore,
    insertInContainerBefore: hostOps.insertBefore,
    removeChild: hostOps.removeChild,
    removeChildFromContainer: hostOps.removeChild,
    clearContainer: hostOps.clearContainer,
    hideInstance: hostOps.hideInstance,
    unhideInstance: hostOps.unhideInstance,
    hideTextInstance() {},
    unhideTextInstance() {},
    finalizeInitialChildren(instance: unknown, type: string, props: Record<string, unknown>) {
      hostOps.setInitialProperties(type, instance, props);
      return true;
    },
    commitMount(instance: unknown, type: string, props: Record<string, unknown>, internalHandle: unknown) {
      if (__DEV__) hostOps.validateProperties(type, props, internalHandle);
    },
    prepareUpdate(
      instance: unknown,
      type: string,
      oldProps: Record<string, unknown>,
      newProps: Record<string, unknown>
    ) {
      return hostOps.diffProperties(type, instance, oldProps, newProps);
    },
    commitUpdate(
      instance: unknown,
      payload: unknown[],
      type: string,
      prevProps: Record<string, unknown>,
      nextProps: Record<string, unknown>,
      internalHandle: unknown
    ) {
      hostOps.updateProperties(type, instance, payload, prevProps, nextProps, internalHandle);
      if (__DEV__) hostOps.validateProperties(type, nextProps, internalHandle);
    },
    commitTextUpdate() {},
    resetTextContent() {},
    detachDeletedInstance() {},
    prepareScopeUpdate() {},
    getInstanceFromNode() {
      invariant(false, "Not yet implemented.");
    },
    getInstanceFromScope() {
      invariant(false, "Not yet implemented.");
    },
    beforeActiveInstanceBlur() {},
    afterActiveInstanceBlur() {},
  };
}

function getStackAddendum(): string {
  if (!__DEV__) return "";
  const internals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  const frame = internals && internals.ReactDebugCurrentFrame;
  if (frame == null) return "";
  const stack = frame.getStackAddendum();
  return stack != null ? stack : "";
}

export default function react18(): ReactAdapter {
  return {
    strictModeBit,
    createRenderer(hostOps, { isPrimaryRenderer }): Renderer {
      const reconciler = Reconciler({ ...createHostConfig(hostOps), isPrimaryRenderer } as any);
      const roots = new Map<unknown, unknown>();
      return {
        render(element, container, callback, parentComponent) {
          let root = roots.get(container);
          if (!root) {
            root = reconciler.createContainer(container, LegacyRoot, null, false, null, "", console.error, null);
            roots.set(container, root);
            reconciler.injectIntoDevTools({
              findFiberByHostInstance: () => null,
              bundleType: __DEV__ ? 1 : 0,
              version: React.version,
              rendererPackageName: "react-pixi-fiber",
            });
          }
          reconciler.updateContainer(element, root as any, parentComponent as any, callback as any);
          return reconciler.getPublicRootInstance(root as any);
        },
        unmount(container) {
          const root = roots.get(container);
          invariant(root, "ReactPixiFiber did not render into container provided");
          reconciler.updateContainer(null, root as any, null, null);
        },
        getStackAddendum,
      };
    },
  };
}
