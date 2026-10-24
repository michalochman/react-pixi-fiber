// Type-checked by `check-types`, not run: `pixi8` takes no `components`, and `pixi8WithComponents` needs them.
import pixi8, { pixi8WithComponents } from "../../src/index";
import { Sprite } from "pixi.js";

export const withoutOptions = () => pixi8();
// @ts-expect-error
export const pixi8WithList = () => pixi8({ components: { Sprite } });
// @ts-expect-error
export const listWithoutOptions = () => pixi8WithComponents();
// @ts-expect-error
export const listWithoutComponents = () => pixi8WithComponents({});
export const list = () => pixi8WithComponents({ components: { Sprite } });
