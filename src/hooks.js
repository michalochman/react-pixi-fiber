import * as PIXI from "pixi.js";
import React from "react";
import { useContext, useEffect, useRef, useState, useLayoutEffect } from "react";
import { AppContext } from "./AppProvider";
import { getCanvasProps } from "./Stage";
import { createUnmount } from "./render";
import { ReactPixiFiberAsSecondaryRenderer } from "./ReactPixiFiber";

export function usePixiApp() {
  return useContext(AppContext);
}

export function usePixiTicker(fn) {
  const app = usePixiApp();

  useEffect(() => {
    app.ticker.add(fn);

    return () => {
      app.ticker.remove(fn);
    };
  }, [fn]);
}

export function usePreviousProps(value) {
  const ref = useRef({});

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

export function usePixiAppCreator(props) {
  const { options, width, height } = props;
  const canvasRef = useRef(null);
  const [app, setApp] = useState(null);
  const canvasProps = getCanvasProps(props);
  // Do not render anything if view is passed to options
  const canvas = options && options.view ? null : <canvas ref={canvasRef} {...canvasProps} />;

  // Initialize pixi application on mount
  useLayoutEffect(() => {
    const unmount = createUnmount(ReactPixiFiberAsSecondaryRenderer);
    const appInstance = new PIXI.Application({
      height,
      width,
      view: canvasRef.current,
      ...options,
    });

    setApp(appInstance);

    // Destroy pixi application on unmount
    return () => {
      unmount(appInstance.stage);
      appInstance.destroy();
    };
  }, []);

  return { app, canvas };
}
