import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";
import invariant from "fbjs/lib/invariant";
import { AppProvider } from "./AppProvider";
import { getCanvasProps, getDisplayObjectProps, propTypes } from "./stageProps";
import { DEFAULT_PROPS, EVENT_PROPS } from "./props";
import { usePreviousProps, usePixiAppCreator } from "./hooks";
import { ReactPixiFiberAsSecondaryRenderer, applyProps } from "./ReactPixiFiber";
import { createRender, createUnmount } from "./render";
import { createPixiApplication, including } from "./utils";
import * as PIXI from "pixi.js";

const render = createRender(ReactPixiFiberAsSecondaryRenderer);
const unmount = createUnmount(ReactPixiFiberAsSecondaryRenderer);

export const includingDisplayObjectProps = including(Object.keys(DEFAULT_PROPS).concat(EVENT_PROPS));
export const includingStageProps = including(Object.keys(propTypes));
export const includingCanvasProps = key => !includingDisplayObjectProps(key) && !includingStageProps(key);

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
  const [prevWidth, prevHeight] = getDimensions(prevProps);
  const [currentWidth, currentHeight] = getDimensions(props);

  if (currentHeight !== prevHeight || currentWidth !== prevWidth) {
    app.renderer.resize(currentWidth, currentHeight);
  }
};

export function createStageFunction() {
  function Stage(props) {
    const { app: externalApp } = props;
    const { app, canvas } = usePixiAppCreator(props);
    const prevProps = usePreviousProps(props);

    // Re-render and resize stage on component update
    useLayoutEffect(() => {
      if (!app || !app.stage) return;

      applyUpdate(app, props);

      if (!(externalApp instanceof PIXI.Application)) {
        resizeRenderer(app, prevProps, props);
      }
    });

    return canvas;
  }

  Stage.propTypes = propTypes;

  return Stage;
}

export function createStageClass() {
  class Stage extends React.Component {
    componentDidMount() {
      const { app, height, options, width } = this.props;
      const view = this._canvas;

      invariant(
        app == null || app instanceof PIXI.Application,
        "Provided `app` has to be an instance of PIXI.Application"
      );

      this._app = app || createPixiApplication({ height, width, view, ...options });

      // Apply root Container props
      applyUpdate(this._app, this.props, this);
    }

    componentDidUpdate(prevProps) {
      const { app } = this.props;

      applyUpdate(this._app, this.props, this);

      if (!(app instanceof PIXI.Application)) {
        resizeRenderer(this._app, prevProps, this.props);
      }
    }

    componentWillUnmount() {
      const { app } = this.props;

      unmount(this._app.stage);

      if (!(app instanceof PIXI.Application)) {
        this._app.destroy();
      }
    }

    render() {
      const { app, options } = this.props;

      // Do not render anything if view is passed to options
      if (typeof options !== "undefined" && options.view) {
        return null;
      }

      // Do not render anything if app provided
      if (app instanceof PIXI.Application) {
        return null;
      }

      const canvasProps = getCanvasProps(this.props);

      return <canvas ref={ref => (this._canvas = ref)} {...canvasProps} />;
    }
  }

  Stage.propTypes = propTypes;

  return Stage;
}

const Stage = typeof useState === "function" ? createStageFunction() : createStageClass();

export default Stage;
