import warning from "fbjs/lib/warning";
import * as PIXI from "pixi.js";

// Copied from https://reactjs.org/warnings/dont-call-proptypes.html#fixing-the-false-positive-in-third-party-proptypes
const deprecatedWarned = {};

export function deprecated(propType, explanation) {
  return function validate(props, propName, componentName, ...rest) {
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!deprecatedWarned[message]) {
        warning(false, message);
        deprecatedWarned[message] = true;
      }
    }

    return propType(props, propName, componentName, ...rest);
  };
}

export function validateApp(props, propName, componentName) {
  const app = props[propName];
  if (typeof app === "undefined") {
    return;
  }

  const { options } = props;

  warning(
    Object.keys(options || {}).length === 0,
    `'options' property of '${componentName}' has no effect when 'app' property is provided. Only use 'app' or 'options', never both.`
  );

  const isPixiApplication = app instanceof PIXI.Application;
  if (!isPixiApplication) {
    const propType = typeof app;
    return new Error(
      `Invalid prop '${propName}' of type '${propType}' supplied to '${componentName}', expected 'PIXI.Application'.`
    );
  }
}

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
