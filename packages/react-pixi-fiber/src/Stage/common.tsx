import type * as PIXI from "pixi.js";
import React from "react";
import { AppProvider } from "../AppProvider";
import { diffProperties, setInitialProperties, updateProperties } from "../ReactPixiFiberComponent";
import { renderers } from "../render";
import { getPixiAdapter } from "../config";
import { getContainerProps } from "./props";
import { TAGS } from "../tags";

// React Pixi Fiber renderer is secondary to React DOM renderer when Stage is rendered by React DOM
export const render = renderers.secondary.render;
export const unmount = renderers.secondary.unmount;

// Stage props as the helpers read them; the public shape is `StageProps` in `types.ts`.
export type Props = Record<string, any>;

export const STAGE_OPTIONS_RECREATE = false;
export const STAGE_OPTIONS_UNMOUNT = true;

// `null` unmounts the stage tree without destroying the application: a provided application is not ours to destroy.
export function cleanupStage(app: PIXI.Application, stageOptions: boolean | null): void {
  // Do not remove canvas from DOM, there are two ways canvas made it's way to PIXI.Application:
  // 1) canvas was rendered by Stage component - it will be removed by React when Stage is unmounted
  // 2) canvas was passed in options as `view` - removing canvas created externally may have unexpected consequences
  const removeView = false;

  // Unmount stage tree
  unmount(app.stage);

  if (stageOptions === null) return;

  // Give components a chance to finish unmounting before destroying PIXI.Application
  setTimeout(() => {
    // Destroy PIXI.Application and what it rendered if necessary
    getPixiAdapter().destroyApplication(app, removeView, stageOptions);
  }, 0);
}

export function getDimensions(props: Props): [number | undefined, number | undefined] {
  const { height, width } = props.options || {};

  return [width, height];
}

export function renderApp(app: PIXI.Application, props: Props): void {
  render(<AppProvider app={app}>{props.children}</AppProvider>, app.stage);
}

export function renderStage(app: PIXI.Application, props: Props): void {
  // Determine what props to apply
  const stageProps = getContainerProps(props);

  setInitialProperties(TAGS.Container, app.stage, stageProps);
  renderApp(app, props);
}

export function rerenderStage(app: PIXI.Application, oldProps: Props, newProps: Props): void {
  // Determine what has changed
  const oldStageProps = getContainerProps(oldProps);
  const newStageProps = getContainerProps(newProps);
  const updatePayload = diffProperties(TAGS.Container, app.stage, oldStageProps, newStageProps);

  if (updatePayload !== null) {
    updateProperties(TAGS.Container, app.stage, updatePayload);
  }

  renderApp(app, newProps);
}

export function resizeRenderer(app: PIXI.Application, oldProps: Props, newProps: Props): void {
  const [oldWidth, oldHeight] = getDimensions(oldProps);
  const [newWidth, newHeight] = getDimensions(newProps);

  if (newHeight !== oldHeight || newWidth !== oldWidth) {
    // As in 2.x, a size removed from `options` passes undefined through to PixiJS.
    app.renderer.resize(newWidth as number, newHeight as number);
  }
}
