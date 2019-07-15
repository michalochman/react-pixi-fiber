import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as PIXI from "pixi.js";
import { AppProvider } from "./AppProvider";
import { getCanvasProps, getDisplayObjectProps, propTypes } from "./stageProps";
import { DEFAULT_PROPS, EVENT_PROPS } from "./props";
import { applyProps } from "./ReactPixiFiber";
import { render, unmount } from "./render";
import { usePreviousProps, usePixiApp } from "./hooks";
import { including } from "./utils";

export let appTestHook = null;

const applyUpdate = (app, props, instance) => {
  const provider = <AppProvider app={app}>{props.children}</AppProvider>;
  const stageProps = getDisplayObjectProps(props);

  applyProps(app.stage, {}, stageProps);

  // a stage class component instance has been passed.
  if (typeof instance === 'object') {
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

  // Stage.propTypes = propTypes;

  return Stage;
}

export function createStageClass() {
  class Stage extends React.Component {
    // static propTypes = propTypes;

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
      resizeRenderer(this._app, prevProps, this.props);
      applyUpdate(this._app, this.props, this);
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

  return Stage;
}

const Stage = typeof useState === "function" ? createStageFunction() : createStageClass();

Stage.propTypes = propTypes;

export default Stage;
