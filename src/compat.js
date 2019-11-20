import React from "react";

export function areReactHooksAvailable() {
  return typeof React.useEffect === "function";
}

export function isNewContextAvailable() {
  return typeof React.createContext === "function";
}
