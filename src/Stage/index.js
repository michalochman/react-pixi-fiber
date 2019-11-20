import { areReactHooksAvailable } from "../compat";
import createStageFunction from "./hooks";
import createStageClass from "./legacy";

export default (areReactHooksAvailable() ? createStageFunction() : createStageClass());

export { createStageFunction, createStageClass };
