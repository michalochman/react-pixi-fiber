import React from "react";
import invariant from "fbjs/lib/invariant";
import { useContext, useEffect, useRef, useState, useLayoutEffect } from "react";
import { AppContext } from "./AppProvider";
import { getCanvasProps } from "./stageProps";
import { createUnmount } from "./render";
import { createPixiApplication } from "./utils";
import { ReactPixiFiberAsSecondaryRenderer } from "./ReactPixiFiber";
import * as PIXI from "pixi.js";

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

export function usePreviousProps(value) {
  const ref = useRef({});

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

export function getCanvas(props, canvasRef) {
  const { app, options } = props;

  // Do not render anything if view is passed to options
  if (typeof options !== "undefined" && options.view) {
    return null;
  }

  // Do not render anything if app provided
  if (app instanceof PIXI.Application) {
    return null;
  }

  const canvasProps = getCanvasProps(props);

  return <canvas ref={canvasRef} {...canvasProps} />;
}

export function usePixiAppCreator(props) {
  const { app } = props;

  invariant(app == null || app instanceof PIXI.Application, "Provided `app` has to be an instance of PIXI.Application");

  const { options, width, height } = props;
  const [appInstance, setAppInstance] = useState(null);
  const canvasRef = useRef();
  const canvas = getCanvas(props, canvasRef);

  // Initialize pixi application on mount
  useLayoutEffect(() => {
    const unmount = createUnmount(ReactPixiFiberAsSecondaryRenderer);
    const view = canvasRef.current;
    const appInstance = app || createPixiApplication({ height, width, view, ...options });

    setAppInstance(appInstance);

    // Destroy pixi application on unmount
    return () => {
      unmount(appInstance.stage);

      if (!(app instanceof PIXI.Application)) {
        appInstance.destroy();
      }
    };
  }, [app, options, width, height]);

  return { app: appInstance, canvas };
}
