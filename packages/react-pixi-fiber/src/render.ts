// Temporary bridge: the core suite keeps running on the React 18 adapter until Task 11 makes render lazy.
import react18 from "@react-pixi-fiber/react-18"; // resolved by the Vitest alias; Task 11 removes this import
import { hostOps } from "./hostOps";

const adapter = react18();
export const renderers = {
  primary: adapter.createRenderer(hostOps, { isPrimaryRenderer: true }),
  secondary: adapter.createRenderer(hostOps, { isPrimaryRenderer: false }),
};
export const render = renderers.primary.render;
export const unmount = renderers.primary.unmount;
