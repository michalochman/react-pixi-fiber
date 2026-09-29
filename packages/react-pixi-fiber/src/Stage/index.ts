import warning from "../warning";
import createStageFunction from "./hooks";

const Stage = createStageFunction();

let warnedCreateStageClass = false;
export function createStageClass() {
  if (__DEV__ && !warnedCreateStageClass) {
    warnedCreateStageClass = true;
    warning(
      false,
      "`createStageClass` is deprecated and returns the function `Stage`. Import `Stage` instead. It will be removed in 4.0.0."
    );
  }
  return Stage;
}

export default Stage;
export { createStageFunction };
