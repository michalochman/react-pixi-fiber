import React from "react";
import Reconciler from "react-reconciler";
import { ConcurrentRoot, DefaultEventPriority, NoEventPriority } from "react-reconciler/constants";
import type { HostOps, ReactAdapter, Renderer } from "react-pixi-fiber";

// https://github.com/facebook/react/blob/v19.3.0/packages/react-reconciler/src/ReactTypeOfMode.js: StrictLegacyMode
export const strictModeBit = 8;
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

// The mutation host config of react-reconciler 0.33.0. Keys left out, and why the reconciler never reads them here:
// hydration, persistence and test selectors sit behind supportsHydration, supportsPersistence and supportsTestSelectors;
// resources and singletons behind supportsResources and supportsSingletons (both undefined); the view transition, gesture
// and fragment instance keys appear in this build only as bare `$$$config.key;` statements, because the features are
// compiled out, so no code path calls them.
// Typed loosely on purpose: it goes straight into Reconciler, and the declaration stays free of inferred core types.
export function createHostConfig(hostOps: HostOps): Record<string, unknown> {
  let currentUpdatePriority: number = NoEventPriority;
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
    setCurrentUpdatePriority(priority: number) {
      currentUpdatePriority = priority;
    },
    getCurrentUpdatePriority: () => currentUpdatePriority,
    resolveUpdatePriority: () =>
      currentUpdatePriority !== NoEventPriority ? currentUpdatePriority : DefaultEventPriority,
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
    commitUpdate(
      instance: unknown,
      type: string,
      prevProps: Record<string, unknown>,
      nextProps: Record<string, unknown>,
      internalHandle: unknown
    ) {
      const payload = hostOps.diffProperties(type, instance, prevProps, nextProps);
      if (payload !== null) hostOps.updateProperties(type, instance, payload, prevProps, nextProps, internalHandle);
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
    rendererPackageName: "react-pixi-fiber",
    rendererVersion: React.version,
    extraDevToolsConfig: null,
    maySuspendCommit: () => false,
    maySuspendCommitOnUpdate: () => false,
    maySuspendCommitInSyncRender: () => false,
    preloadInstance: () => true,
    startSuspendingCommit() {},
    suspendInstance() {},
    waitForCommitToBeReady: () => null,
    getSuspendedCommitReason: () => null,
    shouldAttemptEagerTransition: () => false,
    trackSchedulerEvent() {},
    resolveEventType: () => null,
    resolveEventTimeStamp: () => -1.1,
    resetFormInstance() {},
    bindToConsole: (methodName: "error", args: unknown[]) =>
      Function.prototype.bind.apply(console[methodName], [console, ...args]),
    NotPendingTransition: null,
    HostTransitionContext: {
      $$typeof: Symbol.for("react.context"),
      Provider: null,
      Consumer: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    },
  };
}

function getStackAddendum(): string {
  if (!__DEV__) return "";
  const internals = (React as any).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  const getCurrentStack = internals && internals.getCurrentStack;
  if (typeof getCurrentStack !== "function") return "";
  const stack = getCurrentStack();
  return stack != null ? stack : "";
}

export default function react19(): ReactAdapter {
  return {
    strictModeBit,
    createRenderer(hostOps, { isPrimaryRenderer }): Renderer {
      const reconciler = Reconciler({
        ...createHostConfig(hostOps),
        isPrimaryRenderer,
      } as any);
      const roots = new Map<unknown, unknown>();
      // Uncaught, caught and recoverable errors are all reported on the console.
      const onError = (error: unknown) => {
        console.error(error);
      };
      return {
        render(element, container, callback, parentComponent) {
          let root = roots.get(container);
          if (!root) {
            root = reconciler.createContainer(
              container,
              ConcurrentRoot,
              null,
              false,
              null,
              "",
              onError,
              onError,
              onError,
              () => {},
              null
            );
            roots.set(container, root);
            reconciler.injectIntoDevTools();
          }
          reconciler.updateContainerSync(element, root as any, parentComponent as any, callback as any);
          reconciler.flushSyncWork();
          return reconciler.getPublicRootInstance(root as any);
        },
        unmount(container) {
          const root = roots.get(container);
          invariant(root, "ReactPixiFiber did not render into container provided");
          reconciler.updateContainerSync(null, root as any, null, null);
          reconciler.flushSyncWork();
        },
        getStackAddendum,
      };
    },
  };
}
