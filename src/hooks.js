import { AppContext } from "./AppProvider";
import { useContext, useEffect, useRef } from "react";

export function usePixi() {
  return useContext(AppContext);
}

export function usePixiTicker(fn) {
  const app = usePixi();

  useEffect(() => {
    app.ticker.add(fn);

    return () => {
      app.ticker.remove(fn);
    };
  }, []);
}

export function usePreviousProps(value) {
  const ref = useRef({});

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
