import invariant from "fbjs/lib/invariant";
import ReactPixiFiberRootFactory, { isValidContainer } from "./ReactPixiFiberRootFactory";
import { isContainerMarkedAsRoot, unmarkContainerAsRoot } from "./ReactPixiFiberComponentTree";

function warnOnInvalidCallback(callback, callerName) {
  if (__DEV__) {
    if (callback !== null && typeof callback !== "function") {
      console.error(
        "%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.",
        callerName,
        callback
      );
    }
  }
}

export default function ReactPixiFiberLegacyFactory(ReactPixiFiber) {
  const ReactPixiFiberRoot = ReactPixiFiberRootFactory(ReactPixiFiber);
  const createLegacyRoot = ReactPixiFiberRoot.createLegacyRoot;
  const { getPublicRootInstance, unbatchedUpdates, updateContainer } = ReactPixiFiber;

  function legacyRenderSubtreeIntoContainer(parentComponent, children, container, callback) {
    if (__DEV__) {
      warnOnInvalidCallback(callback === undefined ? null : callback, "render");
    }

    let root = container._reactRootContainer;
    let fiberRoot;
    if (!root) {
      // Initial mount
      root = container._reactRootContainer = createLegacyRoot(container);
      fiberRoot = root._internalRoot;
      if (typeof callback === "function") {
        const originalCallback = callback;
        callback = function() {
          const instance = getPublicRootInstance(fiberRoot);
          originalCallback.call(instance);
        };
      }

      // Initial mount should not be batched.
      unbatchedUpdates(() => {
        updateContainer(children, fiberRoot, parentComponent, callback);
      });
    } else {
      fiberRoot = root._internalRoot;
      if (typeof callback === "function") {
        const originalCallback = callback;
        callback = function() {
          const instance = getPublicRootInstance(fiberRoot);
          originalCallback.call(instance);
        };
      }
      // Update
      updateContainer(children, fiberRoot, parentComponent, callback);
    }
    return getPublicRootInstance(fiberRoot);
  }

  // See: https://github.com/facebook/react/blob/9def56ec0e1e71928ee999f48c00b1803ed8772a/packages/react-dom/src/client/ReactDOMLegacy.js#L175
  function render(element, container, callback, parentComponent) {
    invariant(isValidContainer(container), "Target container is not a PIXI.DisplayObject.");
    if (__DEV__) {
      const isModernRoot = isContainerMarkedAsRoot(container) && container._reactRootContainer === undefined;
      if (isModernRoot) {
        console.error(
          "You are calling ReactPixiFiber.render() on a container that was previously " +
            "passed to ReactPixiFiber.createRoot(). This is not supported. " +
            "Did you mean to call root.render(element)?"
        );
      }
    }
    return legacyRenderSubtreeIntoContainer(parentComponent, element, container, callback);
  }

  // See: https://github.com/facebook/react/blob/9def56ec0e1e71928ee999f48c00b1803ed8772a/packages/react-dom/src/client/ReactDOMLegacy.js#L340
  function unmount(container, parentComponent) {
    invariant(isValidContainer(container), "unmount(...): Target container is not a PIXI.DisplayObject.");

    if (__DEV__) {
      const isModernRoot = isContainerMarkedAsRoot(container) && container._reactRootContainer === undefined;
      if (isModernRoot) {
        console.error(
          "You are calling ReactPixiFiber.unmount() on a container that was previously " +
            "passed to ReactPixiFiber.createRoot(). This is not supported. Did you mean to call root.unmount()?"
        );
      }
    }

    if (container._reactRootContainer) {
      // Unmount should not be batched.
      unbatchedUpdates(() => {
        legacyRenderSubtreeIntoContainer(parentComponent, null, container, () => {
          container._reactRootContainer = null;
          unmarkContainerAsRoot(container);
        });
      });
      // If you call unmount twice in quick succession, you'll
      // get `true` twice. That's probably fine?
      return true;
    } else {
      if (__DEV__) {
        console.error("unmount(): The node you're attempting to unmount was not rendered by ReactPixiFiber");
      }

      return false;
    }
  }

  return {
    render: render,
    unmount: unmount,
  };
}
