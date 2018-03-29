// Based on: https://github.com/facebook/react/blob/6c1fba539adbc3088c425a4d832bb8c4132e7b31/packages/shared/ReactGlobalSharedState.js
import React from "react";

const ReactInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

export const ReactDebugCurrentFrame = __DEV__ ? ReactInternals.ReactDebugCurrentFrame : null;

export function getStackAddendum() {
  if (ReactDebugCurrentFrame == null) {
    return "";
  }

  const stack = ReactDebugCurrentFrame.getStackAddendum();
  return stack != null ? stack : "";
}
