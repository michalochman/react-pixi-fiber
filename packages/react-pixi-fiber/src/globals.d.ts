// Injected by tsdown (build) and Vitest (test) through `define`.
declare const __DEV__: boolean;
declare const __PACKAGE_NAME__: string;

// Dependencies without bundled type declarations.
declare module "fbjs/lib/emptyFunction" {
  const emptyFunction: (...args: unknown[]) => void;
  export default emptyFunction;
}
declare module "fbjs/lib/emptyObject" {
  const emptyObject: {};
  export default emptyObject;
}
declare module "fbjs/lib/invariant" {
  export default function invariant(condition: unknown, format: string, ...args: unknown[]): asserts condition;
}
declare module "fbjs/lib/shallowEqual" {
  export default function shallowEqual(objA: unknown, objB: unknown): boolean;
}
declare module "fbjs/lib/warning" {
  export default function warning(condition: unknown, format: string, ...args: unknown[]): void;
}
declare module "prop-types";
declare module "react-dom";
declare module "react-reconciler";
declare module "react-reconciler/constants";
