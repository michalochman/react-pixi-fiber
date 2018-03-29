import { useState } from "react";
import createStageFunction from "./hooks";
import createStageClass from "./legacy";

const Stage = typeof useState === "function" ? createStageFunction() : createStageClass();

export default Stage;

export { createStageFunction, createStageClass };
