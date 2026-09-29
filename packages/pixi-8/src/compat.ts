import warning from "./warning";

type Rename = (value: unknown) => Record<string, unknown>;

const LEGACY_EVENTS = [
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
];

const pixi6: Record<string, Rename> = {
  buttonMode: value => ({ cursor: value ? "pointer" : null }),
  interactive: value => ({ eventMode: value ? "static" : "none" }),
  name: value => ({ label: value }),
};
for (const name of LEGACY_EVENTS) pixi6[name] = value => ({ [`on${name}`]: value });

// PixiJS 7 still accepts the PixiJS 6 prop names, so apps written for either use the same table.
export const tables = { pixi6, pixi7: pixi6 };

export type Compat = keyof typeof tables;

export function createTranslateProps(compat: Compat) {
  const table = tables[compat];
  const source = compat.replace("pixi", "PixiJS ");
  const warned: Record<string, boolean> = {};
  return function translateProps(type: string, props: Record<string, unknown>): Record<string, unknown> {
    let out: Record<string, unknown> | null = null;
    for (const name in props) {
      if (!Object.prototype.hasOwnProperty.call(props, name)) continue;
      const rename = Object.prototype.hasOwnProperty.call(table, name) ? table[name] : null;
      if (rename === null) {
        if (out !== null) out[name] = props[name];
        continue;
      }
      if (out === null) {
        // Copy the props before the first renamed one; the loop copies the rest.
        out = {};
        for (const key in props) {
          if (key === name) break;
          out[key] = props[key];
        }
      }
      const renamed = rename(props[name]);
      if (__DEV__ && !warned[name]) {
        warned[name] = true;
        warning(
          false,
          '`%s` on `<%s />` is a %s prop, translated by `compat: "%s"`. Rename it to %s to drop the translation.',
          name,
          type,
          source,
          compat,
          Object.keys(renamed)
            .map(key => `\`${key}\``)
            .join(" and ")
        );
      }
      for (const key in renamed) {
        // The PixiJS 8 prop, when also passed, wins over the translated one.
        if (Object.prototype.hasOwnProperty.call(props, key)) {
          if (__DEV__ && !warned[`${name} ${key}`]) {
            warned[`${name} ${key}`] = true;
            warning(
              false,
              "`%s` and `%s` are both set on `<%s />`. `%s` wins; remove `%s`.",
              name,
              key,
              type,
              key,
              name
            );
          }
        } else {
          out[key] = renamed[key];
        }
      }
    }
    return out === null ? props : out;
  };
}
