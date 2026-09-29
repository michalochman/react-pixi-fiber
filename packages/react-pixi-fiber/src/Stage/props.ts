import { getPixiAdapter } from "../configure";
import { getOwn, getStandardNames } from "../PixiProperty";
import { filterByKey, including } from "../utils";

// Stage's own props. `width` and `height` are deprecated, pass them in `options`.
export const STAGE_PROP_NAMES = ["app", "options", "children", "onInit", "width", "height"] as const;
// Plain (untyped) Container props that belong on app.stage, not on the <canvas>. Typed names come from the adapter table.
export const CONTAINER_PROP_NAMES = [
  "angle",
  "cursor",
  "eventMode",
  "filterArea",
  "filters",
  "hitArea",
  "interactiveChildren",
  "label",
  "mask",
  "name",
  "sortableChildren",
  "sortDirty",
  "transform",
  "zIndex",
] as const;
const includingStageProps = including(STAGE_PROP_NAMES as readonly string[]);

// Lazy: the adapter table is read on each call, not at import. A typed name matches as its lowercase table key
// (`buttonmode`, `onclick`) or its canonical name (`buttonMode`),
// so React DOM handlers such as `onClick` go to the canvas.
function includingContainerProps() {
  const standardNames = getStandardNames(getPixiAdapter());
  const isPlainContainerProp = including(CONTAINER_PROP_NAMES);
  return (key: string) =>
    getOwn(standardNames, key) != null || getOwn(standardNames, key.toLowerCase()) === key || isPlainContainerProp(key);
}
export const getContainerProps = (props: Record<string, unknown>) => filterByKey(props, includingContainerProps());
export const getCanvasProps = (props: Record<string, unknown>) => {
  const isContainerProp = includingContainerProps();
  return filterByKey(props, key => !isContainerProp(key) && !includingStageProps(key));
};
