import React from "react";
import shallowEqual from "fbjs/lib/shallowEqual";
import {
  cleanupStage,
  renderStage,
  rerenderStage,
  resizeRenderer,
  STAGE_OPTIONS_RECREATE,
  STAGE_OPTIONS_UNMOUNT,
} from "./common";
import { defaultProps, getCanvasProps, propTypes } from "./propTypes";
import { createPixiApplication } from "../utils";

export default function createStageClass() {
  class Stage extends React.Component {
    constructor(props) {
      super(props);

      // Store PIXI.Application instance
      this._app = React.createRef();
      // Store canvas if it was rendered
      this._canvas = React.createRef();
    }

    componentDidMount() {
      const app = this.getPixiApplication(this.props);

      this.renderStage(app, this.props);

      // store app instance
      this._app.current = app;
    }

    // Re-render and resize stage on component update
    componentDidUpdate(prevProps) {
      const app = this.getPixiApplication(this.props, prevProps);

      this.renderStage(app, this.props);
      this.rerenderStage(app, this.props, prevProps);

      // update stored app instance
      this._app.current = app;
    }

    componentWillUnmount() {
      // Destroy PIXI.Application
      cleanupStage(this._app.current, STAGE_OPTIONS_UNMOUNT);
    }

    render() {
      const { options } = this.props;

      // Do not render anything if canvas is passed in options as `view`
      if (typeof options !== "undefined" && options.view) {
        return null;
      }

      const canvasProps = getCanvasProps(this.props);

      return <canvas ref={this._canvas} {...canvasProps} />;
    }

    getPixiApplication(props, prevProps) {
      const { options } = props;
      const view = this._canvas.current;

      // Render stage for the first time
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

        // Create new PIXI.Application
        // Canvas passed in options as `view` will be used if provided
        return createPixiApplication({ view, ...options });
      }

      // Return already existing Application otherwise
      return this._app.current;
    }

    renderStage(app, props) {
      // Only act if the app was created
      if (app === this._app.current) return;

      renderStage(app, props, this);
    }

    rerenderStage(app, props, prevProps) {
      // Only act if new app was not created
      if (app !== this._app.current) return;

      // Update stage tree
      rerenderStage(app, prevProps, props, this);
      // Update canvas and renderer dimestions
      resizeRenderer(app, prevProps, props);
    }
  }

  Stage.propTypes = propTypes;
  Stage.defaultProps = defaultProps;

  return Stage;
}
