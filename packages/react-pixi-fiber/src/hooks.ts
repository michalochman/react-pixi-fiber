import type { PixiApplication } from "./types";
import React from "react";
import { useContext, useEffect } from "react";
import { AppContext } from "./AppProvider";

export function usePixiApp(): PixiApplication {
  const app = useContext(AppContext);

  if (app === null) {
    throw new Error("No PIXI.Application is available here. You can only access it in children of <Stage />");
  }

  return app;
}

// The callback `app.ticker.add` takes on the configured PixiJS version, a delta-time callback without an adapter.
export type PixiTickerCallback = PixiApplication extends { ticker: { add(fn: infer F, ...rest: any[]): unknown } }
  ? F
  : (deltaTime: number) => void;

export function usePixiTicker(fn: PixiTickerCallback): void {
  const { ticker } = usePixiApp();

  useEffect(() => {
    ticker.add(fn);

    return () => {
      ticker.remove(fn);
    };
  }, [fn, ticker]);
}
