import invariant from "./invariant";
import type * as PIXI from "pixi.js";
import type { CustomPIXIComponentBehavior } from "./types";

export const INJECTED_TYPES: Record<string, CustomPIXIComponentBehavior<any, any>> = {};

export function injectType(type: string, behavior: CustomPIXIComponentBehavior<any, any>): string {
  INJECTED_TYPES[type] = behavior;
  return type;
}

export function createInjectedTypeInstance(
  type: string,
  props: any,
  rootContainer: unknown,
  hostContext: unknown,
  internalHandle: unknown,
  applyDisplayObjectProps: (type: string, instance: any, oldProps: any, newProps: any) => void
): PIXI.DisplayObject | undefined {
  let instance: any;

  if (type in INJECTED_TYPES) {
    // A factory function or a behavior object; the behavior keys are read off either.
    const injectedType: any = INJECTED_TYPES[type];
    let customDisplayObject: ((props: any) => any) | undefined;
    if (typeof injectedType === "function") {
      customDisplayObject = injectedType;
    } else if (typeof injectedType.customDisplayObject === "function") {
      customDisplayObject = injectedType.customDisplayObject;
    }

    invariant(customDisplayObject, "Invalid Component injected to ReactPixiFiber: `%s`.", type);

    instance = customDisplayObject(props);

    if (typeof injectedType.customApplyProps === "function") {
      instance._customApplyProps = injectedType.customApplyProps.bind({
        // See: https://github.com/Izzimach/react-pixi/blob/a25196251a13ed9bb116a8576d93e9fceac2a14c/src/ReactPIXI.js#L953
        applyDisplayObjectProps: applyDisplayObjectProps.bind(null, type, instance),
      });
    }
    if (typeof injectedType.customDidAttach === "function") {
      instance._customDidAttach = injectedType.customDidAttach;
    }
    if (typeof injectedType.customWillDetach === "function") {
      instance._customWillDetach = injectedType.customWillDetach;
    }
  }

  return instance;
}

export function isInjectedType(type: string): boolean {
  return typeof INJECTED_TYPES[type] !== "undefined";
}
