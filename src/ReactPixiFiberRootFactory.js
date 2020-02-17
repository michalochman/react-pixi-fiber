import invariant from "fbjs/lib/invariant";
import * as PIXI from "pixi.js";
import { isContainerMarkedAsRoot, markContainerAsRoot, unmarkContainerAsRoot } from "./ReactPixiFiberComponentTree";

export function getDevToolsVersion() {
  return require("react").version;
}

// See: https://github.com/facebook/react/blob/9def56ec0e1e71928ee999f48c00b1803ed8772a/packages/shared/ReactRootTags.js#L12
export const LegacyRoot = 0;
export const BlockingRoot = 1;
export const ConcurrentRoot = 2;

// Is it necessary to narrow this down to PIXI.Container?
export function isValidContainer(container) {
  return container instanceof PIXI.DisplayObject;
}

function warnIfReactPixiContainerInDEV(container) {
  if (__DEV__) {
    if (isContainerMarkedAsRoot(container)) {
      if (container._reactRootContainer) {
        console.error(
          "You are calling ReactPixiFiber.createRoot() on a container that was previously " +
            "passed to ReactPixiFiber.render(). This is not supported."
        );
      } else {
        console.error(
          "You are calling ReactPixiFiber.createRoot() on a container that " +
            "has already been passed to createRoot() before. Instead, call " +
            "root.render() on the existing root instead if you want to update it."
        );
      }
    }
  }
}

// TODO default value of hostRootFiberTag should be taken from ReactDOM if rendered with ReactDOM root
export default function ReactPixiFiberRootFactory(ReactPixiFiber) {
  const { createContainer, injectIntoDevTools, updateContainer } = ReactPixiFiber;

  injectIntoDevTools({
    bundleType: __DEV__ ? 1 : 0,
    version: getDevToolsVersion(),
    rendererPackageName: __PACKAGE_NAME__,
  });

  function ReactPixiFiberRoot(container, tag) {
    this._internalRoot = createRootImpl(container, tag);
  }

  ReactPixiFiberRoot.prototype.render = function(children) {
    const root = this._internalRoot;
    const container = root.containerInfo;

    updateContainer(children, root, null, null);
  };

  ReactPixiFiberRoot.prototype.unmount = function(callback) {
    const root = this._internalRoot;
    const container = root.containerInfo;
    updateContainer(null, root, null, () => {
      unmarkContainerAsRoot(container);

      // Used for PIXI.Application cleanup
      if (typeof callback === "function") {
        callback();
      }
    });
  };

  function createRootImpl(container, tag) {
    // ReactPixiFiber does not support hydration
    const hydrate = false;
    const root = createContainer(container, tag, hydrate);
    markContainerAsRoot(root.current, container);

    return root;
  }

  // See: https://reactjs.org/docs/concurrent-mode-adoption.html#enabling-concurrent-mode
  // See: https://github.com/facebook/react/blob/9def56ec0e1e71928ee999f48c00b1803ed8772a/packages/react-dom/src/client/ReactDOMRoot.js#L64
  // TODO
  function createRoot(container) {
    invariant(isValidContainer(container), "createRoot(...): Target container is not a PIXI.DisplayObject.");
    warnIfReactPixiContainerInDEV(container);
    return new ReactPixiFiberRoot(container, ConcurrentRoot);
  }

  // See: https://reactjs.org/docs/concurrent-mode-adoption.html#migration-step-blocking-mode
  // See: https://github.com/facebook/react/blob/9def56ec0e1e71928ee999f48c00b1803ed8772a/packages/react-dom/src/client/ReactDOMRoot.js#L64
  // TODO
  function createBlockingRoot(container) {
    invariant(isValidContainer(container), "createRoot(...): Target container is not a PIXI.DisplayObject.");
    warnIfReactPixiContainerInDEV(container);
    return new ReactPixiFiberRoot(container, BlockingRoot);
  }

  // Legacy root
  // TODO
  function createLegacyRoot(container) {
    return new ReactPixiFiberRoot(container, LegacyRoot);
  }

  return {
    createBlockingRoot: createBlockingRoot,
    createLegacyRoot: createLegacyRoot,
    createRoot: createRoot,
  };
}
