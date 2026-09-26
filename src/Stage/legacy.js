import React from "react";
import invariant from "fbjs/lib/invariant";
import shallowEqual from "fbjs/lib/shallowEqual";
import { createRef } from "../compat";
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

export default function createStageClass() {
  class Stage extends React.Component {
    constructor(props) {
      super(props);

      // Store PIXI.Application instance
      this._app = createRef();
      // Store canvas if it was rendered
      this._canvas = createRef();
      // Changes every time PIXI.Application has to be recreated, so it gets a fresh canvas.
      // See `getPixiApplication`.
      this.state = { canvasKey: 0 };
    }

    componentDidMount() {
      const app = this.getPixiApplication(this.props);

      this.renderStage(app, this.props);

      // Store app instance
      this._app.current = app;
    }

    // Re-render and resize stage on component update
    componentDidUpdate(prevProps) {
      const app = this.getPixiApplication(this.props, prevProps);

      // Waiting for a new canvas to be rendered, PIXI.Application is created in the next update
      if (app === null) return;

      this.renderStage(app, this.props);
      this.rerenderStage(app, this.props, prevProps);

      // Update stored app instance
      this._app.current = app;
    }

    componentWillUnmount() {
      const { app } = this.props;

      // Destroy PIXI.Application if it was not provided in props
      // There is no PIXI.Application while waiting for a new canvas, see `getPixiApplication`
      if (!(app instanceof PIXI.Application) && this._app.current != null) {
        cleanupStage(this._app.current, STAGE_OPTIONS_UNMOUNT);
      }
    }

    render() {
      const { app, options } = this.props;

      // Do not render anything if PIXI.Application was provided in props
      if (app instanceof PIXI.Application) {
        return null;
      }

      // Do not render anything if canvas is passed in options as `view`
      if (typeof options !== "undefined" && options.view) {
        return null;
      }

      const canvasProps = getCanvasProps(this.props);

      return <canvas key={this.state.canvasKey} ref={this._canvas} {...canvasProps} />;
    }

    getPixiApplication(props, prevProps) {
      const { app, options } = props;

      // Return PIXI.Application if it was provided in props
      if (app != null) {
        invariant(app instanceof PIXI.Application, "Provided `app` has to be an instance of PIXI.Application");
        return app;
      }

      const view = this._canvas.current;

      // Render stage for the first time, or on a new canvas after PIXI.Application was destroyed
      if (this._app.current == null) {
        // Create new PIXI.Application
        // Canvas passed in options as `view` will be used if provided
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
        // Destroy PIXI.Application
        cleanupStage(this._app.current, STAGE_OPTIONS_RECREATE);

        // Canvas passed in options as `view` is not ours to replace, reuse it
        if (options.view) {
          return createPixiApplication({ view, ...options });
        }

        // Destroying the old PIXI.Application later unbinds or loses the WebGL context of its canvas,
        // so render a new canvas and create PIXI.Application on it in the next update
        this._app.current = null;
        this.setState(({ canvasKey }) => ({ canvasKey: canvasKey + 1 }));

        return null;
      }

      // Return already existing Application otherwise
      return this._app.current;
    }

    renderStage(app, props) {
      // Only act if the app was created
      if (app === this._app.current) return;

      // Set initial properties
      renderStage(app, props, this);
    }

    rerenderStage(app, props, prevProps) {
      // Only act if new app was not created
      if (app !== this._app.current) return;

      // Update stage tree
      rerenderStage(app, prevProps, props, this);

      // Update canvas and renderer dimestions
      if (!(props.app instanceof PIXI.Application)) {
        resizeRenderer(app, prevProps, props);
      }
    }
  }

  Stage.propTypes = propTypes;
  Stage.defaultProps = defaultProps;

  return Stage;
}
