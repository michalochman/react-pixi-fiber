import possibleStandardNames from "../possibleStandardNames";
import { TYPES } from "../tags";
import { filterByKey, including } from "../utils";

// Stage's own props. `width` and `height` are deprecated, pass them in `options`.
export const STAGE_PROP_NAMES = ["app", "options", "children", "onInit", "width", "height"] as const;

export const includingContainerProps = including(Object.keys(possibleStandardNames[TYPES.CONTAINER]));
export const includingStageProps = including(STAGE_PROP_NAMES as readonly string[]);
export const includingCanvasProps = (key: string) => !includingContainerProps(key) && !includingStageProps(key);

export const getCanvasProps = (props: Record<string, unknown>) => filterByKey(props, includingCanvasProps);
export const getContainerProps = (props: Record<string, unknown>) => filterByKey(props, includingContainerProps);
