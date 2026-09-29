// Types for the props that `pixi8({ compat: "pixi6" })` and `pixi8({ compat: "pixi7" })` translate; both use the
// same table. Import this module once to accept the props on every tag.
import type { FederatedPointerEvent } from "pixi.js";
import "react-pixi-fiber";

declare module "react-pixi-fiber" {
  interface PixiExtraProps {
    /** @deprecated PixiJS 6 and 7 prop, translated to `cursor` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    buttonMode?: boolean;
    /** @deprecated PixiJS 6 and 7 prop, translated to `onclick` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    click?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `eventMode` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    interactive?: boolean;
    /** @deprecated PixiJS 6 and 7 prop, translated to `onmousedown` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    mousedown?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `onmousemove` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    mousemove?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `onmouseout` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    mouseout?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `onmouseover` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    mouseover?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `onmouseup` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    mouseup?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `onmouseupoutside` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    mouseupoutside?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `label` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    name?: string;
    /** @deprecated PixiJS 6 and 7 prop, translated to `onpointercancel` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    pointercancel?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `onpointerdown` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    pointerdown?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `onpointermove` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    pointermove?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `onpointerout` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    pointerout?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `onpointerover` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    pointerover?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `onpointertap` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    pointertap?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `onpointerup` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    pointerup?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `onpointerupoutside` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    pointerupoutside?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `onrightclick` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    rightclick?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `onrightdown` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    rightdown?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `onrightup` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    rightup?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `onrightupoutside` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    rightupoutside?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `ontap` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    tap?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `ontouchcancel` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    touchcancel?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `ontouchend` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    touchend?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `ontouchendoutside` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    touchendoutside?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `ontouchmove` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    touchmove?: (event: FederatedPointerEvent) => void;
    /** @deprecated PixiJS 6 and 7 prop, translated to `ontouchstart` by `pixi8({ compat: "pixi6" })` or `pixi8({ compat: "pixi7" })`. */
    touchstart?: (event: FederatedPointerEvent) => void;
  }
}
