// Based on: https://github.com/facebook/react/blob/27535e7bfcb63e8a4d65f273311e380b4ca12eff/packages/react-dom/src/shared/ReactDOMUnknownPropertyHook.js
import emptyFunction from "fbjs/lib/emptyFunction";
import warning from "fbjs/lib/warning";
import { RESERVED, shouldRemoveAttributeWithWarning, getPropertyInfo } from "./PixiProperty";
import { getStackAddendum } from "./ReactGlobalSharedState";
import { isInjectedType } from "./inject";
import possibleStandardNames from "./possibleStandardNames";

let validateProperty = emptyFunction;

if (__DEV__) {
  const warnedProperties = {};
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const EVENT_NAME_REGEX = /^on./;

  validateProperty = function(type, name, value) {
    if (hasOwnProperty.call(warnedProperties, name) && warnedProperties[name]) {
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

    const propertyInfo = getPropertyInfo(name);
    const isReserved = propertyInfo !== null && propertyInfo.type === RESERVED;

    // Known attributes should match the casing specified in the property config.
    if (
      typeof possibleStandardNames[type] !== "undefined" &&
      possibleStandardNames[type].hasOwnProperty(lowerCasedName)
    ) {
      const standardName = possibleStandardNames[type][lowerCasedName];
      if (standardName !== name) {
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
    } else if (!isReserved) {
      warning(
        false,
        "React does not recognize prop `%s` on `<%s />`. If you accidentally passed it from a parent component, remove it from `<%s />`.%s",
        name,
        type,
        type,
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

    return true;
  };
}

export { validateProperty };

export const warnUnknownProperties = function(type, props) {
  const unknownProps = [];
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

export function validateProperties(type, props) {
  if (isInjectedType(type)) {
    return;
  }
  warnUnknownProperties(type, props);
}
