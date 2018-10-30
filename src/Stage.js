import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as PIXI from "pixi.js";
import { AppProvider, AppContext } from "./AppProvider";
import { DEFAULT_PROPS } from "./props";
import { applyProps } from "./ReactPixiFiber";
import { render, unmount } from "./render";
import { filterByKey, including } from "./utils";
import { usePreviousProps } from "./hooks";

export function validateCanvas(props, propName, componentName) {
  // Let's assume that element is canvas if the element is Element and implements getContext
  const element = props[propName];
  if (typeof element === "undefined") {
    return;
  }

  const isCanvas = element instanceof Element && typeof element.getContext === "function";
  if (!isCanvas) {
    const propType = typeof element;
    return new Error(
      `Invalid prop '${propName}' of type '${propType}' supplied to '${componentName}', expected '<canvas> Element'.`
    );
  }
}

const propTypes = {
  options: PropTypes.shape({
    antialias: PropTypes.bool,
    autoStart: PropTypes.bool,
    backgroundColor: PropTypes.number,
    clearBeforeRender: PropTypes.bool,
    forceCanvas: PropTypes.bool,
    forceFXAA: PropTypes.bool,
    height: PropTypes.number,
    legacy: PropTypes.bool,
    powerPreference: PropTypes.string,
    preserveDrawingBuffer: PropTypes.bool,
    resolution: PropTypes.number,
    roundPixels: PropTypes.bool,
    sharedLoader: PropTypes.bool,
    sharedTicker: PropTypes.bool,
    transparent: PropTypes.bool,
    view: validateCanvas,
    width: PropTypes.number,
  }),
  children: PropTypes.node,
  height: PropTypes.number,
  width: PropTypes.number,
};

export const includingDisplayObjectProps = including(Object.keys(DEFAULT_PROPS));
export const includingStageProps = including(Object.keys(propTypes));
export const includingCanvasProps = key => !includingDisplayObjectProps(key) && !includingStageProps(key);

export const getCanvasProps = props => filterByKey(props, includingCanvasProps);
export const getDisplayObjectProps = props => filterByKey(props, includingDisplayObjectProps);

export let appTestHook = null;

export function usePixiApp(props) {
  const { options, width, height } = props;
  const canvasProps = getCanvasProps(props);
  const canvasRef = useRef(null);
  const [app, setApp] = useState(null);
  // Do not render anything if view is passed to options
  const canvas = options && options.view ? null : <canvas ref={canvasRef} {...canvasProps} />;

  // Initialize pixi application on mount
  useLayoutEffect(() => {
    const appInstance = new PIXI.Application({
      height,
      width,
      view: canvasRef.current,
      ...options,
    });

    appTestHook = appInstance;

    setApp(appInstance);

    // Destroy pixi application on unmount
    return () => {
      unmount(appInstance.stage);
      appInstance.destroy();
      appTestHook = null;
    };
  }, []);

  return { app, canvas };
}

function Stage(props) {
  const { children, height, options, width } = props;
  const { app, canvas } = usePixiApp(props);
  const prevProps = usePreviousProps(props);
  const update = () => {
    const provider = <AppProvider app={app}>{children}</AppProvider>;
    const stageProps = getDisplayObjectProps(props);

    applyProps(app.stage, {}, stageProps);
    render(provider, app.stage);
  };
  const resize = () => {
    // Root container has been resized - resize renderer
    const currentHeight = (options && options.height) || height;
    const currentWidth = (options && options.width) || width;
    const prevHeight = (prevProps.options && prevProps.options.height) || prevProps.height;
    const prevWidth = (prevProps.options && prevProps.options.width) || prevProps.width;

    if (currentHeight !== prevHeight || currentWidth !== prevWidth) {
      app.renderer.resize(currentWidth, currentHeight);
    }
  };

  // Update and resize stage on component update
  useLayoutEffect(() => {
    if (!app) return;

    update();
    resize();
  });

  return canvas;
}

Stage.propTypes = propTypes;

export default Stage;
