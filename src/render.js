import invariant from "fbjs/lib/invariant";

export const roots = new Map();

/*
 * element should be any instance of PIXI DisplayObject
 * containerTag should be an instance of PIXI root Container (i.e. the Stage)
 */
export function createRender(ReactPixiFiber) {
  return function render (element, containerTag, callback, parentComponent) {
    let root = roots.get(containerTag);
    if (!root) {
      // TODO should render secondary when Stage is rendering
      root = ReactPixiFiber.createContainer(containerTag);
      roots.set(containerTag, root);

      ReactPixiFiber.injectIntoDevTools({
        findFiberByHostInstance: ReactPixiFiber.findFiberByHostInstance,
        bundleType: __DEV__ ? 1 : 0,
        version: __PACKAGE_VERSION__,
        rendererPackageName: __PACKAGE_NAME__,
      });
    }

    ReactPixiFiber.updateContainer(element, root, parentComponent, callback);

    return ReactPixiFiber.getPublicRootInstance(root);
  }
}

export function createUnmount(ReactPixiFiber) {
  return function unmount (containerTag) {
    const root = roots.get(containerTag);

    invariant(root, "ReactPixiFiber did not render into container provided");

    ReactPixiFiber.updateContainer(null, root);
  }
}
