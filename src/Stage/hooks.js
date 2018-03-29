import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cleanup, renderStage, rerenderStage, resizeRenderer } from "./common";
import { defaultProps, getCanvasProps, propTypes } from "./propTypes";
import { createPixiApplication } from "../utils";

export function usePixiAppCreator(props) {
  const { options } = props;
  const { height, width, ...otherOptions } = options;

  const canvasRef = useRef();
  const [app, setApp] = useState(null);

  const canvasProps = getCanvasProps(props);
  // Do not render anything if view is passed to options
  // TODO should it return options.view instead of null?
  const canvas = options && options.view ? null : <canvas ref={canvasRef} {...canvasProps} />;

  // Initialize pixi application on mount
  useLayoutEffect(
    () => {
      const view = canvasRef.current;
      const appInstance = createPixiApplication({ view, ...options });

      setApp(appInstance);

      // Destroy pixi application on unmount
      return () => {
        const removeView = options.view;

        // Destroy PIXI.Application and remove canvas if necessary
        cleanup(appInstance, removeView);
      };
    },
    // We need to create new Application when options other than dimensions
    // are changed because some of the renderer settings are immutable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...Object.values(otherOptions)]
  );

  return { app, canvas };
}

export function usePreviousProps(value) {
  const ref = useRef({});

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

// Render stage for the first time
export function useStageRenderer(app, props) {
  useLayoutEffect(
    () => {
      if (!app || !app.stage) return;

      renderStage(app, props);
    },
    // Only act if the app was created
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [app]
  );
}

// Re-render stage when component updates
export function useStageRerenderer(app, props) {
  const prevProps = usePreviousProps(props);

  useLayoutEffect(
    () => {
      if (!app || !app.stage) return;

      rerenderStage(app, prevProps, props);
    },
    // Only act if new app was created or props have changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [app, props]
  );
}

// Root container might have been resized - resize renderer
export function useRendererResizer(app, props) {
  const prevProps = usePreviousProps(props);

  useLayoutEffect(
    () => {
      if (!app || !app.renderer) return;

      resizeRenderer(app, props, prevProps);
    },
    // Only act if new app was created or props have changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [app, props]
  );
}

export default function createStageFunction() {
  function Stage(props) {
    const { app, canvas } = usePixiAppCreator(props);

    useStageRenderer(app, props);
    useStageRerenderer(app, props);
    useRendererResizer(app, props);

    return canvas;
  }

  Stage.propTypes = propTypes;
  Stage.defaultProps = defaultProps;

  return Stage;
}
