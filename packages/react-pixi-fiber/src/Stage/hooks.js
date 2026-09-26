import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import emptyObject from "fbjs/lib/emptyObject";
import invariant from "fbjs/lib/invariant";
import shallowEqual from "fbjs/lib/shallowEqual";
import { createPixiApplication } from "../utils";
import {
  cleanupStage,
  renderStage,
  rerenderStage,
  resizeRenderer,
  STAGE_OPTIONS_RECREATE,
  STAGE_OPTIONS_UNMOUNT,
} from "./common";
import { defaultProps, getCanvasProps, propTypes } from "./propTypes";
import * as PIXI from "pixi.js";

export function usePreviousProps(value) {
  const props = useRef(emptyObject);

  useEffect(() => {
    props.current = value;
  });

  return props.current;
}

export function useStageRenderer(props, appRef, canvasRef) {
  // create app on mount
  useLayoutEffect(() => {
    const { app, options } = props;

    // Return PIXI.Application if it was provided in props
    if (app != null) {
      invariant(app instanceof PIXI.Application, "Provided `app` has to be an instance of PIXI.Application");
      appRef.current = app;

      renderStage(appRef.current, props);

      // Not destroying provided PIXI.Application when unmounting
      return;
    }

    const view = canvasRef.current;

    // Create new PIXI.Application
    // Canvas passed in options as `view` will be used if provided
    appRef.current = createPixiApplication({ view, ...options });

    renderStage(appRef.current, props);

    // Cleanup current PIXI.Application when unmounting
    return function cleanup() {
      // There is no PIXI.Application while waiting for a new canvas, see `useStageRerenderer`
      if (appRef.current != null) {
        cleanupStage(appRef.current, STAGE_OPTIONS_UNMOUNT);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// Returns `key` for the rendered canvas. It changes every time PIXI.Application has to be recreated,
// so the new PIXI.Application gets a fresh canvas and WebGL context. The old PIXI.Application is
// destroyed later (see `cleanupStage`) and destroying a renderer unbinds the current program
// (PixiJS v6) or loses the context (PixiJS v7) of its canvas, which would break the new
// PIXI.Application if it was sharing that canvas.
export function useStageRerenderer(props, appRef, canvasRef) {
  const prevProps = usePreviousProps(props);
  const [canvasKey, setCanvasKey] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    // This is first render, no need to do anything
    if (prevProps === emptyObject) return;

    const { app, options } = props;

    if (app instanceof PIXI.Application) {
      // Update stage tree
      rerenderStage(appRef.current, prevProps, props);

      return;
    }

    const view = canvasRef.current;

    // Previous update destroyed PIXI.Application and rendered a new canvas, create PIXI.Application on it
    if (appRef.current == null) {
      appRef.current = createPixiApplication({ view, ...options });

      // Set initial properties
      renderStage(appRef.current, props);

      return;
    }

    const {
      options: { height, width, ...otherOptions },
    } = props;
    const {
      options: { height: prevHeight, width: prevWidth, ...prevOtherOptions },
    } = prevProps;

    // We need to create new PIXI.Application when options other than dimensions
    // are changed because some renderer settings are immutable.
    if (!shallowEqual(otherOptions, prevOtherOptions)) {
      // Destroy PIXI.Application
      cleanupStage(appRef.current, STAGE_OPTIONS_RECREATE);

      if (options.view) {
        // Canvas passed in options as `view` is not ours to replace, reuse it
        appRef.current = createPixiApplication({ view, ...options });

        // Set initial properties
        renderStage(appRef.current, props);
      } else {
        // Render a new canvas, PIXI.Application is created on it in the next update
        appRef.current = null;
        setCanvasKey(canvasKey => canvasKey + 1);
      }
    } else {
      // Update stage tree
      rerenderStage(appRef.current, prevProps, props);
      // Update canvas and renderer dimestions
      resizeRenderer(appRef.current, prevProps, props);
    }
  });

  return canvasKey;
}

export default function createStageFunction() {
  const Stage = forwardRef(function Stage(props, ref) {
    const { app, options } = props;

    // Store PIXI.Application instance
    const appRef = useRef();
    // Store canvas if it was rendered
    const canvasRef = useRef();

    useImperativeHandle(ref, () => ({
      _app: appRef,
      _canvas: canvasRef,
      props: props,
    }));

    // The order is important here to avoid unnecessary renders or extra state:
    // - useStageRerenderer:
    //   - is no-op first time it is called, because PIXI.Application is not created yet
    //   - is responsible for applying changes to existing PIXI.Application
    // - useStageRenderer:
    //   - is only called once
    //   - is responsible for creating first PIXI.Application and destroying it when Stage is finally unmounted
    const canvasKey = useStageRerenderer(props, appRef, canvasRef);
    useStageRenderer(props, appRef, canvasRef);

    // Do not render anything if PIXI.Application was provided in props
    if (app instanceof PIXI.Application) {
      return null;
    }

    // Do not render anything if canvas is passed in options as `view`
    if (typeof options !== "undefined" && options.view) {
      return null;
    }

    const canvasProps = getCanvasProps(props);

    return <canvas key={canvasKey} ref={canvasRef} {...canvasProps} />;
  });

  Stage.propTypes = propTypes;
  Stage.defaultProps = defaultProps;

  return Stage;
}
