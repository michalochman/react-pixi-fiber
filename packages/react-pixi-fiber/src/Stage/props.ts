import { getPixiAdapter } from "../config";
import { getStandardNames } from "../PixiProperty";
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

// Lazy: the adapter table is read on each call, not at import.
function includingContainerProps() {
  const typed = Object.values(getStandardNames(getPixiAdapter()));
  return including([...typed, ...CONTAINER_PROP_NAMES]);
}
export const getContainerProps = (props: Record<string, unknown>) => filterByKey(props, includingContainerProps());
export const getCanvasProps = (props: Record<string, unknown>) => {
  const isContainerProp = includingContainerProps();
  return filterByKey(props, key => !isContainerProp(key) && !includingStageProps(key));
};
