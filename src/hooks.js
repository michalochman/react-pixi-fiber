import * as PIXI from "pixi.js";
import React from "react";
import { useContext, useEffect, useRef, useState, useLayoutEffect } from "react";
import { AppContext } from "./AppProvider";
import { getCanvasProps } from "./stageProps";
import { unmount } from "./render";

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

export function usePixiApp(props) {
  const { options, width, height } = props;
  const canvasRef = useRef(null);
  const [app, setApp] = useState(null);
  const canvasProps = getCanvasProps(props);
  // Do not render anything if view is passed to options
  const canvas = options && options.view ? null : <canvas ref={canvasRef} {...canvasProps} />;

  // Initialize pixi application on mount
  useLayoutEffect(() => {
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
