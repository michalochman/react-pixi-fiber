import type * as PIXI from "pixi.js";
import React from "react";
import { AppProvider } from "../AppProvider";
import { ReactPixiFiberAsSecondaryRenderer } from "../ReactPixiFiber";
import { diffProperties, setInitialProperties, updateProperties } from "../ReactPixiFiberComponent";
import { createRender, createUnmount } from "../render";
import { getContainerProps } from "./props";
import { TAGS } from "../tags";

export const render = createRender(ReactPixiFiberAsSecondaryRenderer);
export const unmount = createUnmount(ReactPixiFiberAsSecondaryRenderer);

// Stage props as the helpers read them; the public shape is `StageProps` in `types.ts`.
export type Props = Record<string, any>;

export const STAGE_OPTIONS_RECREATE = false;
export const STAGE_OPTIONS_UNMOUNT = true;

export function cleanupStage(app: PIXI.Application, stageOptions: boolean = STAGE_OPTIONS_RECREATE): void {
  // Do not remove canvas from DOM, there are two ways canvas made it's way to PIXI.Application:
  // 1) canvas was rendered by Stage component - it will be removed by React when Stage is unmounted
  // 2) canvas was passed in options as `view` - removing canvas created externally may have unexpected consequences
  const removeView = false;

  // Unmount stage tree
  unmount(app.stage);

  // Give components a chance to finish unmounting before destroying PIXI.Application
  setTimeout(() => {
    // Destroy PIXI.Application and what it rendered if necessary
    app.destroy(removeView, stageOptions);
  }, 0);
}

export function getDimensions(props: Props): [number, number] {
  const { height, width } = props.options || {};

  return [width, height];
}

export function renderApp(app: PIXI.Application, props: Props, instance?: unknown): void {
  const provider = <AppProvider app={app}>{props.children}</AppProvider>;

  if (typeof instance === "object") {
    render(provider, app.stage, undefined, instance);
  } else {
    render(provider, app.stage);
  }
}

export function renderStage(app: PIXI.Application, props: Props, instance?: unknown): void {
  // Determine what props to apply
  const stageProps = getContainerProps(props);

  setInitialProperties(TAGS.Container, app.stage, stageProps);
  renderApp(app, props, instance);
}

export function rerenderStage(app: PIXI.Application, oldProps: Props, newProps: Props, instance?: unknown): void {
  // Determine what has changed
  const oldStageProps = getContainerProps(oldProps);
  const newStageProps = getContainerProps(newProps);
  const updatePayload = diffProperties(TAGS.Container, app.stage, oldStageProps, newStageProps);

  if (updatePayload !== null) {
    updateProperties(TAGS.Container, app.stage, updatePayload);
  }

  renderApp(app, newProps, instance);
}

export function resizeRenderer(app: PIXI.Application, oldProps: Props, newProps: Props): void {
  const [oldWidth, oldHeight] = getDimensions(oldProps);
  const [newWidth, newHeight] = getDimensions(newProps);

  if (newHeight !== oldHeight || newWidth !== oldWidth) {
    app.renderer.resize(newWidth, newHeight);
  }
}
