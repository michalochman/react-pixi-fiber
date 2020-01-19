import PropTypes from "prop-types";
import warning from "fbjs/lib/warning";
import possibleStandardNames from "../possibleStandardNames";
import { TYPES } from "../types";
import { filterByKey, including } from "../utils";

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

// Copied from https://reactjs.org/warnings/dont-call-proptypes.html#fixing-the-false-positive-in-third-party-proptypes
const warned = {};
export function deprecated(propType, explanation) {
  return function validate(props, propName, componentName, ...rest) {
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName, ...rest);
  };
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
  height: deprecated(PropTypes.number, "Pass `height` in `options` prop instead."),
  width: deprecated(PropTypes.number, "Pass `height` in `options` prop instead."),
};

export const defaultProps = {
  options: {},
};

export const includingContainerProps = including(Object.keys(possibleStandardNames[TYPES.CONTAINER]));
export const includingStageProps = including(Object.keys(propTypes));
export const includingCanvasProps = key => !includingContainerProps(key) && !includingStageProps(key);

export const getCanvasProps = props => filterByKey(props, includingCanvasProps);
export const getContainerProps = props => filterByKey(props, includingContainerProps);
