import React from "react";
import { AppProvider } from "../AppProvider";
import ReactPixiFiberRootFactory from "../ReactPixiFiberRootFactory";
import { ReactPixiFiberAsSecondaryRenderer } from "../ReactPixiFiber";
import { diffProperties, setInitialProperties, updateProperties } from "../ReactPixiFiberComponent";
import { internalReactPixiFiberRootInstanceKey } from "../ReactPixiFiberComponentTree";
import { getContainerProps } from "./propTypes";
import { TYPES } from "../types";

const ReactPixiFiberRoot = ReactPixiFiberRootFactory(ReactPixiFiberAsSecondaryRenderer);

export const STAGE_OPTIONS_RECREATE = false;
export const STAGE_OPTIONS_UNMOUNT = true;

export function cleanupStage(app, stageOptions = STAGE_OPTIONS_RECREATE) {
  // Do not remove canvas from DOM, there are two ways canvas made it's way to PIXI.Application:
  // 1) canvas was rendered by Stage component - it will be removed by React when Stage is unmounted
  // 2) canvas was passed in options as `view` - removing canvas created externally may have unexpected consequences
  const removeView = false;

  // Unmount stage tree
  app[internalReactPixiFiberRootInstanceKey].unmount(() => {
    // Destroy PIXI.Application and what it rendered if necessary
    app.destroy(removeView, stageOptions);
  });
}

export function createReactRoot(container, mode) {
  if (mode === "blocking") {
    return ReactPixiFiberRoot.createBlockingRoot(container);
  }
  if (mode === "concurrent") {
    return ReactPixiFiberRoot.createRoot(container);
  }
  if (mode === "legacy") {
    return ReactPixiFiberRoot.createLegacyRoot(container);
  }
}

export function getDimensions(props) {
  const {
    options: { height, width },
  } = props;

  return [width, height];
}

export function renderApp(app, props) {
  const provider = <AppProvider app={app}>{props.children}</AppProvider>;

  let root = app[internalReactPixiFiberRootInstanceKey];
  if (!root) {
    root = app[internalReactPixiFiberRootInstanceKey] = createReactRoot(app.stage, props.mode);
  }
  root.render(provider);
}

export function renderStage(app, props) {
  // Determine what props to apply
  const stageProps = getContainerProps(props);

  setInitialProperties(TYPES.CONTAINER, app.stage, stageProps);
  renderApp(app, props);
}

export function rerenderStage(app, oldProps, newProps) {
  // Determine what has changed
  const oldStageProps = getContainerProps(oldProps);
  const newStageProps = getContainerProps(newProps);
  const updatePayload = diffProperties(TYPES.CONTAINER, app.stage, oldStageProps, newStageProps);

  if (updatePayload !== null) {
    updateProperties(TYPES.CONTAINER, app.stage, updatePayload);
  }

  renderApp(app, newProps);
}

export function resizeRenderer(app, oldProps, newProps) {
  const [oldWidth, oldHeight] = getDimensions(oldProps);
  const [newWidth, newHeight] = getDimensions(newProps);

  if (newHeight !== oldHeight || newWidth !== oldWidth) {
    app.renderer.resize(newWidth, newHeight);
  }
}
