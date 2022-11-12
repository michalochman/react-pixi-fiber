// Based on: https://github.com/facebook/react/blob/27535e7bfcb63e8a4d65f273311e380b4ca12eff/packages/react-dom/src/client/DOMPropertyOperations.js
import warning from "fbjs/lib/warning";
import { getPropertyInfo, shouldIgnoreAttribute, shouldRemoveAttribute } from "./PixiProperty";
import { defaultProps } from "./props";
import { getStackAddendum } from "./ReactGlobalSharedState";
import { findStrictRoot, replacePixiCallback, setPixiValue } from "./utils";

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
 * @param {*} internalHandle
 */
export function setValueForProperty(type, instance, propName, value, prevValue, internalHandle) {
  const propertyInfo = getPropertyInfo(propName);
  let strictRoot = null;
  if (__DEV__) {
    strictRoot = findStrictRoot(internalHandle);
  }

  if (shouldIgnoreAttribute(type, propName, propertyInfo)) {
    return;
  }
  if (propName.startsWith("on")) {
    // Can't apply the same shouldIgnoreValue logic to event listeners,
    // otherwise we might loose the reference to prevValue without unsubscribing
    // it beforehand
    const eventName = propName.substring(2);
    replacePixiCallback(instance, eventName, value, prevValue);
    return;
  }
  let shouldIgnoreValue = false;
  if (shouldRemoveAttribute(type, propName, value, propertyInfo)) {
    // Try to reset to property to default value (if it is defined) otherwise ignore provided value.
    // This is the original behaviour of react-pixi@0.9.19 (on which this is based) and react-pixi-fiber@0.14.3,
    // left here for backwards compatibility.
    // TODO This is not the best solution as it makes it impossible to remove props that were once set.
    //      Setting value to null or undefined makes behaviour of props used by PIXI unstable/undefined.
    //      Deleting properties i another idea, however with many getters/setters defined by PIXI it is not trivial.
    const defaultValue = getDefaultValue(type, propName);
    if (typeof defaultValue !== "undefined") {
      value = defaultValue;
      if (strictRoot != null) {
        warning(
          false,
          "Received undefined for prop `%s` on `<%s />`. Setting default value to `%s`.%s",
          propName,
          type,
          value,
          getStackAddendum()
        );
      }
    } else {
      shouldIgnoreValue = true;
      if (strictRoot != null) {
        warning(
          false,
          "Received undefined for prop `%s` on `<%s />`. Cannot determine default value. Ignoring.%s",
          propName,
          type,
          getStackAddendum()
        );
      }
    }
  }

  if (!shouldIgnoreValue) {
    setPixiValue(instance, propName, value);
  }
}
