import invariant from "./invariant";
import warning from "./warning";

export interface ApplyPropsContext<P> {
  applyDisplayObjectProps(oldProps: P | undefined, newProps: P): void;
}
export interface Behavior<I = any, P = any> {
  create(props: P): I;
  applyProps?(this: ApplyPropsContext<P>, instance: I, oldProps: P | undefined, newProps: P): void;
  afterAdd?(instance: I): void;
  beforeRemove?(instance: I): void;
}
export interface LegacyBehavior<I = any, P = any> {
  customDisplayObject: (props: P) => I;
  customApplyProps?: Behavior<I, P>["applyProps"];
  customDidAttach?: (instance: I) => void;
  customWillDetach?: (instance: I) => void;
}
export type BehaviorInput<I = any, P = any> = Behavior<I, P> | ((props: P) => I) | LegacyBehavior<I, P>;
export interface BoundBehavior {
  tag: string;
  applyProps?: (instance: any, oldProps: any, newProps: any) => void;
  afterAdd?: (instance: any) => void;
  beforeRemove?: (instance: any) => void;
}

const LEGACY_KEYS = {
  customDisplayObject: "create",
  customApplyProps: "applyProps",
  customDidAttach: "afterAdd",
  customWillDetach: "beforeRemove",
} as const;

const warnedLegacyKeys: Record<string, boolean> = {};

export function normalizeBehavior(type: string, behavior: BehaviorInput): Behavior {
  if (typeof behavior === "function") {
    return { create: behavior };
  }
  const normalized: Record<string, unknown> = { ...behavior };
  for (const legacyKey of Object.keys(LEGACY_KEYS) as Array<keyof typeof LEGACY_KEYS>) {
    if (typeof normalized[legacyKey] === "function") {
      const newKey = LEGACY_KEYS[legacyKey];
      if (__DEV__ && !warnedLegacyKeys[legacyKey]) {
        warnedLegacyKeys[legacyKey] = true;
        warning(
          false,
          "Behavior key `%s` on `%s` is deprecated, use `%s`. It will be removed in 4.0.0.",
          legacyKey,
          type,
          newKey
        );
      }
      if (typeof normalized[newKey] !== "function") {
        normalized[newKey] = normalized[legacyKey];
      }
      delete normalized[legacyKey];
    }
  }
  invariant(
    typeof normalized.create === "function",
    "Invalid behavior for `%s`: `create` must be a function that returns a display object.",
    type
  );
  return normalized as unknown as Behavior;
}

const userComponents: Record<string, Behavior> = {};
let adapterComponents: Record<string, Behavior> = {};

export function registerComponent(type: string, behavior: BehaviorInput): string {
  userComponents[type] = normalizeBehavior(type, behavior);
  return type;
}

// Called by configure (and by the Phase 1 shim) with the adapter's components. Replaces the previous adapter set.
export function registerAdapterComponents(components: Record<string, BehaviorInput>): void {
  const next: Record<string, Behavior> = {};
  for (const type of Object.keys(components)) next[type] = normalizeBehavior(type, components[type]);
  adapterComponents = next;
}

export function getUserComponent(type: string): Behavior | undefined {
  return Object.prototype.hasOwnProperty.call(userComponents, type) ? userComponents[type] : undefined;
}

export function getAdapterComponent(type: string): Behavior | undefined {
  return Object.prototype.hasOwnProperty.call(adapterComponents, type) ? adapterComponents[type] : undefined;
}

// User registration wins over the adapter's; see decisions 3 and 11.
export function resolveComponent(type: string): { behavior: Behavior; source: "user" | "adapter" } | undefined {
  const user = getUserComponent(type);
  if (user) return { behavior: user, source: "user" };
  const adapter = getAdapterComponent(type);
  return adapter ? { behavior: adapter, source: "adapter" } : undefined;
}

const boundBehaviors = new WeakMap<object, BoundBehavior>();

export function getInstanceTag(instance: object): string | undefined {
  const bound = boundBehaviors.get(instance);
  return bound === undefined ? undefined : bound.tag;
}

export function createRegisteredInstance(
  type: string,
  behavior: Behavior,
  props: Record<string, unknown>,
  applyDisplayObjectProps: (type: string, instance: any, oldProps: any, newProps: any) => void
): object {
  const instance = behavior.create(props);
  invariant(
    instance !== null && (typeof instance === "object" || typeof instance === "function"),
    "`create` of `%s` returned `%s`, expected a display object.",
    type,
    String(instance)
  );
  const bound: BoundBehavior = { tag: type };
  if (typeof behavior.applyProps === "function") {
    bound.applyProps = behavior.applyProps.bind({
      // See: https://github.com/Izzimach/react-pixi/blob/a25196251a13ed9bb116a8576d93e9fceac2a14c/src/ReactPIXI.js#L953
      applyDisplayObjectProps: applyDisplayObjectProps.bind(null, type, instance),
    });
  }
  if (typeof behavior.afterAdd === "function") bound.afterAdd = behavior.afterAdd;
  if (typeof behavior.beforeRemove === "function") bound.beforeRemove = behavior.beforeRemove;
  boundBehaviors.set(instance, bound);
  return instance;
}

export function getBoundBehavior(instance: object): BoundBehavior | undefined {
  return boundBehaviors.get(instance);
}
