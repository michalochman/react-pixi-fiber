// Based on: https://github.com/facebook/react/blob/9c77ffb444598c32c8f92c8d79e406959a10445b/packages/react-dom/src/shared/DOMProperty.js
import { isInjectedType } from "./inject";
import { parsePoint } from "./utils";

// A reserved attribute.
// It is handled by React separately and shouldn't be written to the DOM.
export const RESERVED = 0;

// A simple string attribute.
// Attributes that aren't in the whitelist are presumed to have this type.
export const STRING = 1;

// A real boolean attribute.
// When true, it should be present (set either to an empty string or its name).
export const BOOLEAN = 2;

// An attribute that must be numeric or parse as a numeric.
// When falsy, it should be removed.
export const NUMERIC = 3;

// An attribute that must be positive numeric or parse as a positive numeric.
// When falsy, it should be removed.
export const POSITIVE_NUMERIC = 4;

// An attribute that must be vector or parse as a vector.
// When falsy, it should be removed.
export const VECTOR = 5;

// An attribute that must be function
// When falsy, it should be removed.
export const CALLBACK = 6;

export function shouldIgnoreAttribute(type, name, propertyInfo) {
  if (propertyInfo !== null) {
    return propertyInfo.type === RESERVED;
  }
  if (isInjectedType(type)) {
    return false;
  }
  return false;
}

export function shouldRemoveAttributeWithWarning(type, name, value, propertyInfo) {
  if (propertyInfo !== null && propertyInfo.type === RESERVED) {
    return false;
  }
  switch (typeof value) {
    case "boolean":
      if (isInjectedType(type)) {
        return false;
      }
      return propertyInfo === null || !propertyInfo.acceptsBooleans;
    case "function":
      if (isInjectedType(type)) {
        return false;
      }
      return propertyInfo === null || propertyInfo.type !== CALLBACK;
    case "symbol":
      return true;
    default:
      return false;
  }
}

export function shouldRemoveAttribute(type, name, value, propertyInfo) {
  if (typeof value === "undefined") {
    return true;
  }
  if (shouldRemoveAttributeWithWarning(type, name, value, propertyInfo)) {
    return true;
  }
  if (propertyInfo !== null) {
    switch (propertyInfo.type) {
      case CALLBACK:
        return typeof value !== "function";
      case NUMERIC:
        return isNaN(value);
      case POSITIVE_NUMERIC:
        return isNaN(value) || value < 0;
      case VECTOR:
        const vector = parsePoint(value);
        return vector.length === 0 || vector.findIndex(x => isNaN(x)) !== -1;
    }
  }
  return false;
}

export function getPropertyInfo(name) {
  return properties.hasOwnProperty(name) ? properties[name] : null;
}

function PropertyInfoRecord(name, type) {
  this.acceptsBooleans = type === BOOLEAN;
  this.propertyName = name;
  this.type = type;
}

// When adding attributes to this list, be sure to also add them to
// the `possibleStandardNames` module to ensure casing and incorrect
// name warnings.
const properties = {};

// These props are reserved by React. They shouldn't be written to the DOM.
["children", "parent"].forEach(name => {
  properties[name] = new PropertyInfoRecord(name, RESERVED);
});

// A few React string attributes have a different name.
// This is a mapping from React prop names to the attribute names.
// [["className", "class"]].forEach(([name, attributeName]) => {
//   properties[name] = new PropertyInfoRecord(name, STRING);
// });

// let otherProps = [
//   "align",
//   "blendMode",
//   "canvas",
//   "context",
//   "cursor",
//   "filterArea",
//   "filters",
//   "font",
//   "hitArea",
//   "lineWidth",
//   "mask",
//   "name",
//   "pluginName",
//   "shader",
//   "style",
//   "text",
//   "texture",
//   "tileTransform",
//   "transform",
//   "uvTransform",
// ];

// These are HTML boolean attributes.
[
  "autoResize",
  "buttonMode",
  "cacheAsBitmap",
  "interactive",
  "interactiveChildren",
  "isMask",
  "nativeLines",
  "renderable",
  "roundPixels",
  "uvRespectAnchor",
  "visible",
].forEach(name => {
  properties[name] = new PropertyInfoRecord(name, BOOLEAN);
});

// These are HTML attributes that must be positive numbers.
["alpha", "fillAlpha", "height", "lineColor", "maxWidth", "resolution", "tint", "width"].forEach(name => {
  properties[name] = new PropertyInfoRecord(name, POSITIVE_NUMERIC);
});

// These are HTML attributes that must be numbers.
["boundsPadding", "clampMargin", "rotation", "x", "y"].forEach(name => {
  properties[name] = new PropertyInfoRecord(name, NUMERIC);
});

["anchor", "pivot", "position", "scale", "skew", "tilePosition", "tileScale"].forEach(name => {
  properties[name] = new PropertyInfoRecord(name, VECTOR);
});

[
  "added",
  "click",
  "mousedown",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "mouseupoutside",
  "pointercancel",
  "pointerdown",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointertap",
  "pointerup",
  "pointerupoutside",
  "removed",
  "rightclick",
  "rightdown",
  "rightup",
  "rightupoutside",
  "tap",
  "touchcancel",
  "touchend",
  "touchendoutside",
  "touchmove",
  "touchstart",
].forEach(name => {
  properties[name] = new PropertyInfoRecord(name, CALLBACK);
});
