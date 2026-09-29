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

export function usePixiTicker(fn: (deltaTime: number) => void): void {
  const { ticker } = usePixiApp();

  useEffect(() => {
    ticker.add(fn);

    return () => {
      ticker.remove(fn);
    };
  }, [fn, ticker]);
}
