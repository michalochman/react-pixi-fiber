import invariant from "fbjs/lib/invariant";
import { ReactPixiFiberAsPrimaryRenderer as ReactPixiFiber } from "../src/ReactPixiFiber";

export const roots = new Map();

/*
 * element should be any instance of PIXI DisplayObject
 * containerTag should be an instance of PIXI root Container (i.e. the Stage)
 */
export function render(element, containerTag, callback, parentComponent) {
  let root = roots.get(containerTag);
  if (!root) {
    root = ReactPixiFiber.createContainer(containerTag);
    roots.set(containerTag, root);
  }

  ReactPixiFiber.updateContainer(element, root, parentComponent, callback);

  ReactPixiFiber.injectIntoDevTools({
    findFiberByHostInstance: ReactPixiFiber.findFiberByHostInstance,
    bundleType: __DEV__ ? 1 : 0,
    version: __PACKAGE_VERSION__,
    rendererPackageName: __PACKAGE_NAME__,
  });

  return ReactPixiFiber.getPublicRootInstance(root);
}

export function unmount(containerTag) {
  const root = roots.get(containerTag);

  invariant(root, "ReactPixiFiber did not render into container provided");

  ReactPixiFiber.updateContainer(null, root);
}
