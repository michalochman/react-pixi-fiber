import React from "react";
import { getContainerProps } from "./propTypes";
import { AppProvider } from "../AppProvider";
import { ReactPixiFiberAsSecondaryRenderer } from "../ReactPixiFiber";
import { diffProperties, setInitialProperties, updateProperties } from "../ReactPixiFiberComponent";
import { createRender, createUnmount } from "../render";
import { TYPES } from "../types";

export const render = createRender(ReactPixiFiberAsSecondaryRenderer);
export const unmount = createUnmount(ReactPixiFiberAsSecondaryRenderer);

export function cleanup(app, removeView) {
  unmount(app.stage);
  app.destroy(removeView);
}

export function getDimensions(props) {
  const {
    options: { height, width },
  } = props;

  return [width, height];
}

export function resizeRenderer(app, props, prevProps) {
  const [prevWidth, prevHeight] = getDimensions(prevProps);
  const [currentWidth, currentHeight] = getDimensions(props);

  if (currentHeight !== prevHeight || currentWidth !== prevWidth) {
    app.renderer.resize(currentWidth, currentHeight);
  }
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
