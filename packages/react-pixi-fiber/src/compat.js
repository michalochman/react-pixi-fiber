import React from "react";

export function areReactHooksAvailable() {
  return typeof React.useEffect === "function";
}

export function createRef() {
  return typeof React.createRef === "function"
    ? React.createRef()
    : {
        current: null,
      };
}

export function isNewContextAvailable() {
  return typeof React.createContext === "function";
}
