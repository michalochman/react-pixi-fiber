import emptyFunction from "fbjs/lib/emptyFunction";
import invariant from "fbjs/lib/invariant";
import { injectType } from "./inject";
import possibleStandardNames from "./possibleStandardNames";
import type * as PIXI from "pixi.js";
import { customProperties, PropertyInfoRecord, type PropertyInfoRecordConstructor } from "./PixiProperty";
import type { CustomPIXIComponentBehavior, CustomPIXIComponentProps, PixiComponent } from "./types";

// Create a custom component.
function CustomPIXIComponent<T extends PIXI.DisplayObject, P>(
  behavior: CustomPIXIComponentBehavior<T, P>,
  type: string
): PixiComponent<CustomPIXIComponentProps<T, P>, T> {
  invariant(
    typeof type === "string",
    "Invalid argument `type` of type `%s` supplied to `CustomPIXIComponent`, expected `string`.",
    typeof type
  );

  return injectType(type, behavior) as unknown as PixiComponent<CustomPIXIComponentProps<T, P>, T>;
}

// Register a custom property on given component type(s) so it is not reported as unknown prop in development.
// `maybeComponentType` accepts a component type (e.g. `Sprite`), a list of them, or `null`/`undefined` for all types.
// No-op in production.
let CustomPIXIProperty: (
  maybeComponentType: string | PixiComponent<any, any> | Array<string | PixiComponent<any, any>> | null | undefined,
  propertyName: string,
  validator?: (value: unknown) => boolean
) => void = emptyFunction;

if (__DEV__) {
  /**
   * @param maybeComponentType string|string[]|null|undefined
   * @param propertyName string
   * @param validator function<T>(value: T): boolean
   */
  CustomPIXIProperty = function CustomPIXIProperty(maybeComponentType, propertyName, validator) {
    const lowerCasedPropertyName = propertyName.toLowerCase();

    // Define custom property for all component types if none was provided
    if (maybeComponentType == null) {
      maybeComponentType = Object.keys(possibleStandardNames);
    }

    // Allow providing just one component as value instead of an array with 1 element
    const componentTypeList: string[] = ([] as unknown[]).concat(maybeComponentType) as string[];

    componentTypeList.forEach(componentType => {
      invariant(
        Object.keys(possibleStandardNames).includes(componentType),
        "`%s` is not a valid component type",
        componentType
      );
      invariant(
        !(
          Object.keys(customProperties).includes(componentType) &&
          Object.keys(customProperties[componentType]).includes(propertyName)
        ) && !Object.keys(possibleStandardNames[componentType]).includes(lowerCasedPropertyName),
        "Property `%s` is already registered on `%s`",
        propertyName,
        componentType
      );
      invariant(
        typeof validator === "undefined" || typeof validator === "function",
        "Validator type for property `%s` is invalid. Expected `function`, got `%s`",
        propertyName,
        typeof validator
      );

      if (typeof validator === "undefined") {
        validator = () => true;
      }

      // inject standard name
      possibleStandardNames[componentType][lowerCasedPropertyName] = propertyName;
      // inject custom property info
      if (!Object.keys(customProperties).includes(componentType)) {
        customProperties[componentType] = {};
      }
      customProperties[componentType][propertyName] = new (
        PropertyInfoRecord as unknown as PropertyInfoRecordConstructor
      )(propertyName, validator);
    });
  };
}

export { CustomPIXIProperty };

export default CustomPIXIComponent;
