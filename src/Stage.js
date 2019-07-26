import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as PIXI from "pixi.js";
import { AppProvider } from "./AppProvider";
import { DEFAULT_PROPS, EVENT_PROPS } from "./props";
import { applyProps } from "./ReactPixiFiber";
import { render, unmount } from "./render";
import { usePreviousProps, usePixiApp } from "./hooks";
import { filterByKey, including } from "./utils";

export let appTestHook = null;

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

export const propTypes = {
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

export const includingDisplayObjectProps = including(Object.keys(DEFAULT_PROPS).concat(EVENT_PROPS));
export const includingStageProps = including(Object.keys(propTypes));
export const includingCanvasProps = key => !includingDisplayObjectProps(key) && !includingStageProps(key);

export const getCanvasProps = props => filterByKey(props, includingCanvasProps);
export const getDisplayObjectProps = props => filterByKey(props, includingDisplayObjectProps);

const applyUpdate = (app, props, instance) => {
  const provider = <AppProvider app={app}>{props.children}</AppProvider>;
  const stageProps = getDisplayObjectProps(props);

  applyProps(app.stage, {}, stageProps);

  // a stage class component instance has been passed.
  if (typeof instance === "object") {
    render(provider, app.stage, undefined, instance);
  } else {
    render(provider, app.stage);
  }
};

const getDimensions = props => {
  const { options, width, height } = props;
  const realWidth = (options && options.width) || width;
  const realHeight = (options && options.height) || height;

  return [realWidth, realHeight];
};

const resizeRenderer = (app, prevProps, props) => {
  const { options, width, height } = props;
  const [prevWidth, prevHeight] = getDimensions(prevProps);
  const [currentWidth, currentHeight] = getDimensions(props);

  if (currentHeight !== prevHeight || currentWidth !== prevWidth) {
    app.renderer.resize(currentWidth, currentHeight);
  }
};

export function createStageFunction() {
  function Stage(props) {
    const { height, options, width } = props;
    const { app, canvas } = usePixiApp(props);
    const prevProps = usePreviousProps(props);

    // Re-render and resize stage on component update
    useLayoutEffect(() => {
      if (!app) return;
      appTestHook = app;

      applyUpdate(app, props);
      resizeRenderer(app, prevProps, props);
    });

    return canvas;
  }

  Stage.propTypes = propTypes;

  return Stage;
}

export function createStageClass() {
  class Stage extends React.Component {
    componentDidMount() {
      const { children, height, options, width } = this.props;
      const view = this._canvas;

      this._app = appTestHook = new PIXI.Application({ height, width, view, ...options });

      // Apply root Container props
      applyUpdate(this._app, this.props, this);
    }

    componentDidUpdate(prevProps) {
      const { children, height, options, width } = this.props;
      const { options: prevOptions } = prevProps;
      applyUpdate(this._app, this.props, this);
      resizeRenderer(this._app, prevProps, this.props);
    }

    componentWillUnmount() {
      unmount(this._app.stage);
      this._app.destroy();
    }

    render() {
      const { options } = this.props;
      const canvasProps = getCanvasProps(this.props);

      // Do not render anything if view is passed to options
      if (typeof options !== "undefined" && options.view) {
        return null;
      } else {
        return <canvas ref={ref => (this._canvas = ref)} {...canvasProps} />;
      }
    }
  }

  Stage.propTypes = propTypes;

  return Stage;
}

const Stage = typeof useState === "function" ? createStageFunction() : createStageClass();

export default Stage;
