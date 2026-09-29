// Based on: https://github.com/facebook/react/blob/27535e7bfcb63e8a4d65f273311e380b4ca12eff/packages/react-dom/src/shared/ReactDOMUnknownPropertyHook.js
import warning from "./warning";
import { getPixiAdapter, getStackAddendum } from "./configure";
import {
  RESERVED,
  customStandardNames,
  getOwn,
  getPropertyInfo,
  getCustomPropertyInfo,
  getStandardNames,
  shouldRemoveAttributeWithWarning,
} from "./PixiProperty";
import { resolveTag } from "./registry";

const emptyFunction = () => {};

// `emptyFunction` in production, where nothing reads the result.
let validateProperty: (type: string, name: string, value: unknown) => boolean | void = emptyFunction;

if (__DEV__) {
  const warnedProperties: Record<string, boolean> = {};
  // React-style camelCase handlers only: `onclick` is a real PixiJS 7+ prop.
  const EVENT_NAME_REGEX = /^on[A-Z]/;

  validateProperty = function (type, name, value) {
    // Inlined: babel-plugin-rewire rewrites a block-scoped `hasOwnProperty` binding to `_get__("hasOwnProperty")`
    // without registering it, which made this `undefined` under test.
    if (Object.prototype.hasOwnProperty.call(warnedProperties, name) && warnedProperties[name]) {
      return true;
    }

    const lowerCasedName = name.toLowerCase();

    if (EVENT_NAME_REGEX.test(name)) {
      warning(
        false,
        "Invalid event handler prop `%s` on `<%s />`. PIXI events use other naming convention, for example `click`.%s",
        name,
        type,
        getStackAddendum()
      );
      warnedProperties[name] = true;
      return true;
    }

    if (typeof value === "number" && isNaN(value)) {
      warning(
        false,
        "Received NaN for prop `%s` on `<%s />`. If this is expected, cast the value to a string.%s",
        name,
        type,
        getStackAddendum()
      );
      warnedProperties[name] = true;
      return true;
    }

    const pixi = getPixiAdapter();
    const propertyInfo = getPropertyInfo(name, pixi);
    const tag = resolveTag(type);
    const customPropertyInfo = getCustomPropertyInfo(name, tag);
    const isReserved = propertyInfo !== null && propertyInfo.type === RESERVED;

    // Known attributes should match the casing specified in the property config.
    // A name is typed by the adapter table, or was registered by `PIXIProperty` on the tag or on all tags.
    // Any other name is set on the instance as-is and not reported (decision 1).
    const standardName =
      getOwn(getStandardNames(pixi), lowerCasedName) ??
      getOwn(customStandardNames[tag], lowerCasedName) ??
      getOwn(customStandardNames["*"], lowerCasedName);
    if (standardName !== undefined && standardName !== name) {
      warning(
        false,
        "Invalid prop `%s` on `<%s />`. Did you mean `%s`?%s",
        name,
        type,
        standardName,
        getStackAddendum()
      );
      warnedProperties[name] = true;
      return true;
    }

    // Now that we've validated casing, do not validate
    // data types for reserved props
    if (isReserved) {
      return true;
    }

    // Warn when a known attribute is a bad type
    if (shouldRemoveAttributeWithWarning(type, name, value, propertyInfo)) {
      warnedProperties[name] = true;
      return false;
    }

    // Warn when custom property does not pass custom validation
    if (customPropertyInfo != null && !customPropertyInfo.type(value)) {
      warnedProperties[name] = true;
      return false;
    }

    return true;
  };
}

export { validateProperty };

export const warnUnknownProperties = function (type: string, props: Record<string, unknown>): void {
  const unknownProps: string[] = [];
  for (const key in props) {
    const isValid = validateProperty(type, key, props[key]);
    if (!isValid) {
      unknownProps.push(key);
    }
  }

  const unknownPropString = unknownProps.map(prop => "`" + prop + "`").join(", ");
  if (unknownProps.length === 1) {
    warning(false, "Invalid value for prop %s on `<%s />`.%s", unknownPropString, type, getStackAddendum());
  } else if (unknownProps.length > 1) {
    warning(false, "Invalid values for props %s on `<%s />`.%s", unknownPropString, type, getStackAddendum());
  }
};

export function validateProperties(type: string, props: Record<string, unknown>): void {
  warnUnknownProperties(type, props);
}
