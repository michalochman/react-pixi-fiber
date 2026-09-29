// Based on: https://github.com/facebook/react/blob/27535e7bfcb63e8a4d65f273311e380b4ca12eff/packages/react-dom/src/client/DOMPropertyOperations.js
import warning from "./warning";
import type * as PIXI from "pixi.js";
import { getPixiAdapter, getStrictModeBit } from "./config";
import { getRecordedDefault, recordDefault } from "./defaults";
import { getOwn, getPropertyInfo, shouldIgnoreAttribute, shouldRemoveAttribute } from "./PixiProperty";
import { getStackAddendum } from "./ReactGlobalSharedState";
import { getInstanceTag } from "./registry";
import { findStrictRoot, setPixiValue } from "./utils";

/**
 * Sets the value for a property on a PIXI.DisplayObject instance.
 *
 * @param {string} type
 * @param {PIXI.DisplayObject} instance
 * @param {string} propName
 * @param {*} value
 * @param {*} internalHandle
 */
export function setValueForProperty(
  type: string,
  instance: PIXI.DisplayObject,
  propName: string,
  value: unknown,
  internalHandle?: unknown
): void {
  const pixi = getPixiAdapter();
  const propertyInfo = getPropertyInfo(propName, pixi);
  let strictRoot = null;
  if (__DEV__) {
    strictRoot = findStrictRoot(internalHandle, getStrictModeBit());
  }

  if (shouldIgnoreAttribute(type, propName, propertyInfo)) {
    return;
  }

  // Remember what PixiJS had before we ever touch this prop, so a removal can restore it.
  recordDefault(instance, propName, pixi.isPoint);

  let shouldIgnoreValue = false;
  if (shouldRemoveAttribute(type, propName, value, propertyInfo)) {
    // `undefined` is also how a removed prop arrives, so only an invalid value warns.
    const received = value;
    // The tag the instance was created as: a deprecated tag records the tag it maps to, a user tag records itself.
    const tag = getInstanceTag(instance) ?? type;
    const override = getOwn(getOwn(pixi.defaults, tag), propName);
    const defaultValue = typeof override !== "undefined" ? override : getRecordedDefault(instance, propName);
    // A default can itself be `undefined` (`mask`, `filters`, custom props); a name the instance does not have is ignored.
    if (typeof defaultValue !== "undefined" || propName in instance) {
      value = defaultValue;
      if (strictRoot != null && typeof received !== "undefined") {
        warning(
          false,
          "Received `%s` for prop `%s` on `<%s />`. Resetting it to its default `%s`.%s",
          String(received),
          propName,
          type,
          String(value),
          getStackAddendum()
        );
      }
    } else {
      shouldIgnoreValue = true;
      if (strictRoot != null && typeof received !== "undefined") {
        warning(
          false,
          "Received `%s` for prop `%s` on `<%s />`. Cannot determine default value. Ignoring.%s",
          String(received),
          propName,
          type,
          getStackAddendum()
        );
      }
    }
  }

  if (!shouldIgnoreValue) {
    setPixiValue(instance, propName, value, pixi);
  }
}
