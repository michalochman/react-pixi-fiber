import { getPixiAdapter } from "../configure";
import { getOwn, getStandardNames } from "../PixiProperty";
import { translate } from "../ReactPixiFiberComponent";
import { TAGS } from "../tags";
import { filterByKey, including } from "../utils";

// Stage's own props. `width` and `height` are deprecated, pass them in `options`.
export const STAGE_PROP_NAMES = ["app", "options", "children", "onInit", "width", "height"] as const;
const includingStageProps = including(STAGE_PROP_NAMES as readonly string[]);

// Lazy: the adapter table is read on each call, not at import. A typed name matches as its lowercase table key
// (`buttonmode`, `onclick`) or its canonical name (`buttonMode`), so React DOM handlers such as `onClick` go to the
// canvas. An untyped name matches as written in `untypedContainer`.
function includingContainerProps() {
  const pixi = getPixiAdapter();
  const standardNames = getStandardNames(pixi);
  const isPlainContainerProp = including(pixi.properties.untypedContainer);
  return (key: string) =>
    getOwn(standardNames, key) != null || getOwn(standardNames, key.toLowerCase()) === key || isPlainContainerProp(key);
}
// Both split the adapter-translated props, so a prop the adapter renames is sorted by its translated name.
export const getContainerProps = (props: Record<string, unknown>) =>
  filterByKey(translate(TAGS.Container, props), includingContainerProps());
export const getCanvasProps = (props: Record<string, unknown>) => {
  const isContainerProp = includingContainerProps();
  return filterByKey(translate(TAGS.Container, props), key => !isContainerProp(key) && !includingStageProps(key));
};
