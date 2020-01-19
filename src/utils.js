import invariant from "fbjs/lib/invariant";
import * as PIXI from "pixi.js";
import { getStackAddendum } from "./ReactGlobalSharedState";

/* Helper Methods */

export const not = fn => (...args) => !fn(...args);

export const including = props => key => props.indexOf(key) !== -1;

export const unique = (element, index, array) => array.indexOf(element) === index;

export function filterByKey(inputObject, filter) {
  const exportObject = {};

  Object.keys(inputObject)
    .filter(filter)
    .forEach(key => {
      exportObject[key] = inputObject[key];
    });

  return exportObject;
}

/* PIXI related Methods */

export function createPixiApplication(options) {
  return new PIXI.Application(options);
}

// Converts value to an array of coordinates
export function parsePoint(value) {
  let arr = [];
  if (typeof value === "undefined") {
    return arr;
  } else if (typeof value === "string") {
    arr = value.split(",");
  } else if (typeof value === "number") {
    arr = [value];
  } else if (Array.isArray(value)) {
    // shallow copy the array
    arr = value.slice();
  } else if (typeof value.x !== "undefined" && typeof value.y !== "undefined") {
    arr = [value.x, value.y];
  }

  return arr.map(Number);
}

export function isPointType(value) {
  return value instanceof PIXI.Point || value instanceof PIXI.ObservablePoint;
}

// Use Point.copyFrom if available because Point.copy was deprecated in PIXI 5.0
export function copyPoint(instance, propName, value) {
  if (typeof instance[propName].copyFrom === "function") {
    instance[propName].copyFrom(value);
  } else {
    instance[propName].copy(value);
  }
}

// Set props on a DisplayObject by checking the type. If a PIXI.Point or
// a PIXI.ObservablePoint is having its value set, then either a comma-separated
// string with in the form of "x,y" or a size 2 array with index 0 being the x
// coordinate and index 1 being the y coordinate.
// See: https://github.com/Izzimach/react-pixi/blob/a25196251a13ed9bb116a8576d93e9fceac2a14c/src/ReactPIXI.js#L114
export function setPixiValue(instance, propName, value) {
  if (isPointType(instance[propName]) && isPointType(value)) {
    // Just copy the data if a Point type is being assigned to a Point type
    copyPoint(instance, propName, value);
  } else if (isPointType(instance[propName])) {
    // Parse value if a non-Point type is being assigned to a Point type
    const coordinateData = parsePoint(value);

    invariant(
      typeof coordinateData !== "undefined" && coordinateData.length > 0 && coordinateData.length < 3,
      "The property `%s` is a PIXI.Point or PIXI.ObservablePoint and must be set to a comma-separated string of " +
        "either 1 or 2 coordinates, a 1 or 2 element array containing coordinates, or a PIXI Point/ObservablePoint. " +
        "If only one coordinate is given then X and Y will be set to the provided value.%s",
      propName,
      getStackAddendum()
    );

    instance[propName].set(coordinateData.shift(), coordinateData.shift());
  } else {
    // Just assign the value directly if a non-Point type is being assigned to a non-Point type
    instance[propName] = value;
  }
}
