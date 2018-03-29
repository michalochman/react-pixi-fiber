import React from "react";
import shallowEqual from "fbjs/lib/shallowEqual";
import { cleanup, renderStage, rerenderStage, resizeRenderer } from "./common";
import { defaultProps, getCanvasProps, propTypes } from "./propTypes";
import { createPixiApplication } from "../utils";

export default function createStageClass() {
  class Stage extends React.Component {
    // TODO test render returning null
    componentDidMount() {
      const app = this.usePixiAppCreator(this.props);

      this.useStageRenderer(app, this.props);

      // store app instance
      this._app = app;
    }

    // Re-render and resize stage on component update
    // TODO test render returning null
    componentDidUpdate(prevProps) {
      const app = this.usePixiAppCreator(this.props, prevProps);

      this.useStageRenderer(app, this.props);
      this.useStageRerenderer(app, this.props, prevProps);
      this.useRendererResizer(app, this.props, prevProps);

      // update stored app instance
      this._app = app;
    }

    componentWillUnmount() {
      const { options } = this.props;
      const removeView = options.view;

      // Destroy PIXI.Application and remove canvas if necessary
      cleanup(this._app, removeView);
    }

    render() {
      const { options } = this.props;
      const canvasProps = getCanvasProps(this.props);

      // Do not render anything if view is passed to options
      if (typeof options !== "undefined" && options.view) {
        return null;
      } else {
        return <canvas ref={ref => (this._canvas = ref)} {...canvasProps} />;
      }
    }

    usePixiAppCreator(props, prevProps) {
      const { options } = props;
      const view = this._canvas;

      // First render
      if (prevProps == null) {
        return createPixiApplication({ view, ...options });
      }

      const {
        options: { height, width, ...otherOptions },
      } = props;
      const {
        options: { height: prevHeight, width: prevWidth, ...prevOtherOptions },
      } = prevProps;

      // We need to create new Application when options other than dimensions
      // are changed because some of the renderer settings are immutable
      if (!shallowEqual(otherOptions, prevOtherOptions)) {
        const removeView = options.view;

        // Destroy PIXI.Application and remove canvas if necessary
        cleanup(this._app, removeView);

        // Create new application
        return createPixiApplication({ view, ...options });
      }

      return this._app;
    }

    // Render stage for the first time
    useStageRenderer(app, props) {
      // Only act if the app was created
      if (app === this._app) {
        return;
      }

      renderStage(app, props, this);
    }

    // Re-render stage when component updates
    useStageRerenderer(app, props, prevProps) {
      // Only act if new app was created or props have changed
      if (app === this._app && shallowEqual(props, prevProps)) {
        return;
      }

      rerenderStage(app, prevProps, this.props, this);
    }

    // Root container might have been resized - resize renderer
    useRendererResizer(app, props, prevProps) {
      // Only act if new app was created or props have changed
      if (app === this._app && shallowEqual(props, prevProps)) {
        return;
      }

      resizeRenderer(app, props, prevProps);
    }
  }

  Stage.propTypes = propTypes;
  Stage.defaultProps = defaultProps;

  return Stage;
}
