import invariant from "fbjs/lib/invariant";
import type * as PIXI from "pixi.js";
import type * as React from "react";
import { version } from "react";

export function getDevToolsVersion(): string {
  return version;
}

export const roots = new Map<PIXI.Container, unknown>();

/*
 * element should be any instance of PIXI DisplayObject
 * containerTag should be an instance of PIXI root Container (i.e. the Stage)
 */
export function createRender(ReactPixiFiber: any) {
  return function render(
    element: React.ReactElement<any> | React.ReactElement<any>[] | PIXI.DisplayObject | PIXI.DisplayObject[],
    containerTag: PIXI.Container,
    callback?: Function,
    parentComponent?: unknown
  ): void {
    let root = roots.get(containerTag);
    if (!root) {
      root = ReactPixiFiber.createContainer(containerTag);
      roots.set(containerTag, root);

      ReactPixiFiber.injectIntoDevTools({
        findFiberByHostInstance: ReactPixiFiber.findFiberByHostInstance,
        bundleType: __DEV__ ? 1 : 0,
        version: getDevToolsVersion(),
        rendererPackageName: __PACKAGE_NAME__,
      });
    }

    ReactPixiFiber.updateContainer(element, root, parentComponent, callback);

    return ReactPixiFiber.getPublicRootInstance(root);
  };
}

export function createUnmount(ReactPixiFiber: any) {
  return function unmount(containerTag: PIXI.Container): void {
    const root = roots.get(containerTag);

    invariant(root, "ReactPixiFiber did not render into container provided");

    ReactPixiFiber.updateContainer(null, root);
  };
}
