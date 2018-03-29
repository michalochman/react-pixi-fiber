import React from "react";
import { useContext, useEffect } from "react";
import { AppContext } from "./AppProvider";

export function usePixiApp() {
  return useContext(AppContext);
}

export function usePixiTicker(fn) {
  const { ticker } = usePixiApp();

  useEffect(() => {
    ticker.add(fn);

    return () => {
      ticker.remove(fn);
    };
  }, [fn, ticker]);
}
