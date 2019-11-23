import React from "react";
import { AppProvider } from "../AppProvider";
import { ReactPixiFiberAsSecondaryRenderer } from "../ReactPixiFiber";
import { diffProperties, setInitialProperties, updateProperties } from "../ReactPixiFiberComponent";
import { createRender, createUnmount } from "../render";
import { getContainerProps } from "./propTypes";
import { TYPES } from "../types";

export const render = createRender(ReactPixiFiberAsSecondaryRenderer);
export const unmount = createUnmount(ReactPixiFiberAsSecondaryRenderer);

export const STAGE_OPTIONS_RECREATE = false;
export const STAGE_OPTIONS_UNMOUNT = true;

export function cleanupStage(app, stageOptions = STAGE_OPTIONS_RECREATE) {
  // Do not remove canvas from DOM, there are two ways canvas made it's way to PIXI.Application:
  // 1) canvas was rendered by Stage component - it will be removed by React when Stage is unmounted
  // 2) canvas was passed in options as `view` - removing canvas created externally may have unexpected consequences
  const removeView = false;

  // Unmount stage tree
  unmount(app.stage);

  // Destroy PIXI.Application and what it rendered if necessary
  app.destroy(removeView, stageOptions);
}

export function getDimensions(props) {
  const {
    options: { height, width },
  } = props;

  return [width, height];
}

export function renderApp(app, props, instance) {
  const provider = <AppProvider app={app}>{props.children}</AppProvider>;

  if (typeof instance === "object") {
    render(provider, app.stage, undefined, instance);
  } else {
    render(provider, app.stage);
  }
}

export function renderStage(app, props, instance) {
  // Determine what props to apply
  const stageProps = getContainerProps(props);

  setInitialProperties(TYPES.CONTAINER, app.stage, stageProps);
  renderApp(app, props, instance);
}

export function rerenderStage(app, oldProps, newProps, instance) {
  // Determine what has changed
  const oldStageProps = getContainerProps(oldProps);
  const newStageProps = getContainerProps(newProps);
  const updatePayload = diffProperties(TYPES.CONTAINER, app.stage, oldStageProps, newStageProps);

  if (updatePayload !== null) {
    updateProperties(TYPES.CONTAINER, app.stage, updatePayload);
  }

  renderApp(app, newProps, instance);
}

export function resizeRenderer(app, oldProps, newProps) {
  const [oldWidth, oldHeight] = getDimensions(oldProps);
  const [newWidth, newHeight] = getDimensions(newProps);

  if (newHeight !== oldHeight || newWidth !== oldWidth) {
    app.renderer.resize(newWidth, newHeight);
  }
}
