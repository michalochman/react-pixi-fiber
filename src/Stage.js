import React from "react";
import PropTypes from "prop-types";
import * as PIXI from "pixi.js";
import { AppProvider } from "./AppProvider";
import { DEFAULT_PROPS } from "./props";
import { applyProps } from "./ReactPixiFiber";
import { render, unmount } from "./render";
import { filterByKey, including } from "./utils";

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

class Stage extends React.Component {
  componentDidMount() {
    const { children, height, options, width } = this.props;

    this._app = new PIXI.Application({
      height,
      width,
      view: this._canvas,
      ...options,
    });

    // Apply root Container props
    const stageProps = getDisplayObjectProps(this.props);
    applyProps(this._app.stage, {}, stageProps);

    render(<AppProvider app={this._app}>{children}</AppProvider>, this._app.stage);
  }

  componentDidUpdate(prevProps, prevState) {
    const { children, height, options, width } = this.props;
    const { options: prevOptions } = prevProps;

    // Apply root Container props
    const stageProps = getDisplayObjectProps(this.props);
    applyProps(this._app.stage, {}, stageProps);

    // Root container has been resized - resize renderer
    const currentHeight = (options && options.height) || height;
    const currentWidth = (options && options.width) || width;
    const prevHeight = (prevOptions && prevOptions.height) || prevProps.height;
    const prevWidth = (prevOptions && prevOptions.width) || prevProps.width;
    if (currentHeight !== prevHeight || currentWidth !== prevWidth) {
      this._app.renderer.resize(currentWidth, currentHeight);
    }

    render(<AppProvider app={this._app}>{children}</AppProvider>, this._app.stage);
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

export default Stage;
