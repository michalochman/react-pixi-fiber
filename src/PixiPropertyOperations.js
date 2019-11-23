// Based on: https://github.com/facebook/react/blob/27535e7bfcb63e8a4d65f273311e380b4ca12eff/packages/react-dom/src/client/DOMPropertyOperations.js
import { getPropertyInfo, shouldIgnoreAttribute, shouldRemoveAttribute } from "./PixiProperty";
import { defaultProps } from "./props";
import { setPixiValue } from "./utils";

export function getDefaultValue(type, propName) {
  const defaultValues = defaultProps[type];
  if (typeof defaultValues !== "undefined") {
    return defaultValues[propName];
  }
}

/**
 * Sets the value for a property on a PIXI.DisplayObject instance.
 *
 * @param {string} type
 * @param {PIXI.DisplayObject} instance
 * @param {string} propName
 * @param {*} value
 */
export function setValueForProperty(type, instance, propName, value) {
  const propertyInfo = getPropertyInfo(propName);

  if (shouldIgnoreAttribute(type, propName, propertyInfo)) {
    return;
  }
  if (shouldRemoveAttribute(type, propName, value, propertyInfo)) {
    // Try to reset to property to default value (if it is defined)
    const defaultValue = getDefaultValue(type, propName);
    if (typeof defaultValue !== "undefined") {
      value = defaultValue;
    } else {
      value = null;
    }
  }

  setPixiValue(instance, propName, value);
}
