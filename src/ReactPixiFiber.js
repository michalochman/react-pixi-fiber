import React from "react";
import PropTypes from "prop-types";
import ReactFiberReconciler from "react-reconciler";
import emptyObject from "fbjs/lib/emptyObject";
import invariant from "fbjs/lib/invariant";
import now from "performance-now";
import * as PIXI from "pixi.js";

const RESERVED_PROPS = {
  children: true
};

const TYPES = {
  BITMAP_TEXT: "BitmapText",
  CONTAINER: "Container",
  GRAPHICS: "Graphics",
  SPRITE: "Sprite",
  TEXT: "Text",
  TILING_SPRITE: "TilingSprite"
};

const UPDATE_SIGNAL = {};

/* Render Methods */

// TODO consider whitelisting props based on component type
const applyProps = (instance, props, prevProps) => {
  Object.assign(instance, filterByKey(props, filterProps));
};

function render(pixiElement, stage, callback) {
  let container = stage._reactRootContainer;
  if (!container) {
    container = ReactPixiFiber.createContainer(stage);
    stage._reactRootContainer = container;
  }

  ReactPixiFiber.updateContainer(pixiElement, container, undefined, callback);

  ReactPixiFiber.injectIntoDevTools({
    findFiberByHostInstance: ReactPixiFiber.findFiberByHostInstance,
    bundleType: 1,
    version: "0.1.0",
    rendererPackageName: "react-pixi-fiber"
  });
}

/* Helper Methods */

export const filterByKey = (inputObject, filter) => {
  const exportObject = {};

  Object.keys(inputObject)
    .filter(filter)
    .forEach(key => {
      exportObject[key] = inputObject[key];
    });

  return exportObject;
};

function appendChild(parentInstance, child) {
  // TODO do we need to remove the child first if it's already added?
  parentInstance.removeChild(child);

  parentInstance.addChild(child);
}

const removeChild = (parentInstance, child) => {
  parentInstance.removeChild(child);

  child.destroy();
};

const insertBefore = (parentInstance, child, beforeChild) => {
  invariant(
    child !== beforeChild,
    "ReactPixiFiber cannot insert node before itself"
  );

  const childExists = parentInstance.children.indexOf(child) !== -1;
  const index = parentInstance.getChildIndex(beforeChild);

  if (childExists) {
    parentInstance.setChildIndex(child, index);
  } else {
    parentInstance.addChildAt(child, index);
  }
};

const filterProps = key => Object.keys(RESERVED_PROPS).indexOf(key) === -1;

const commitUpdate = (
  instance,
  updatePayload,
  type,
  oldProps,
  newProps,
  internalInstanceHandle
) => {
  applyProps(instance, newProps, oldProps);
};

/* PIXI.js Renderer */

const ReactPixiFiber = ReactFiberReconciler({
  appendInitialChild: appendChild,

  createInstance: function(type, props, internalInstanceHandle) {
    const { canvas, height, style, text, texture, width } = props;

    let instance;

    switch (type) {
      case TYPES.BITMAP_TEXT:
        instance = new PIXI.BitmapText(text, style);
        break;
      case TYPES.CONTAINER:
        instance = new PIXI.Container();
        break;
      case TYPES.GRAPHICS:
        instance = new PIXI.Graphics();
        break;
      case TYPES.SPRITE:
        instance = new PIXI.Sprite(texture);
        break;
      case TYPES.TEXT:
        instance = new PIXI.Text(text, style, canvas);
        break;
      case TYPES.TILING_SPRITE:
        instance = new PIXI.extras.TilingSprite(texture, width, height);
        break;
      default:
        break;
    }

    invariant(instance, 'ReactPixiFiber does not support the type: "%s"', type);

    applyProps(instance, props);

    return instance;
  },

  createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
    invariant(
      false,
      "ReactPixiFiber does not support text instances. Use Text component instead."
    );
  },

  finalizeInitialChildren: function(
    pixiElement,
    type,
    props,
    rootContainerInstance
  ) {
    return false;
  },

  getChildHostContext(parentHostContext, type) {
    return emptyObject;
  },

  getRootHostContext(rootContainerInstance) {
    return emptyObject;
  },

  getPublicInstance(inst) {
    return inst;
  },

  now: now,

  prepareForCommit() {
    // Noop
  },

  prepareUpdate: function(
    pixiElement,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
    hostContext
  ) {
    return UPDATE_SIGNAL;
  },

  resetAfterCommit() {
    // Noop
  },

  resetTextContent(pixiElement) {
    // Noop
  },

  shouldDeprioritizeSubtree: function(type, props) {
    const isAlphaVisible =
      typeof props.alpha === "undefined" || props.alpha > 0;
    const isRenderable =
      typeof props.renderable === "undefined" || props.renderable === true;
    const isVisible =
      typeof props.visible === "undefined" || props.visible === true;

    return !(isAlphaVisible && isRenderable && isVisible);
  },

  shouldSetTextContent: function(type, props) {
    return false;
  },

  useSyncScheduling: true,

  mutation: {
    appendChild: appendChild,
    appendChildToContainer: appendChild,

    insertBefore: insertBefore,
    insertInContainerBefore: insertBefore,

    removeChild: removeChild,
    removeChildFromContainer: removeChild,

    commitTextUpdate: (textInstance, oldText, newText) => {
      // Noop
    },

    commitMount: (instance, type, newProps) => {
      // Noop
    },

    commitUpdate: commitUpdate
  }
});

/* React Components */

class Stage extends React.Component {
  getChildContext() {
    return {
      app: this._app
    };
  }

  componentDidMount() {
    const { backgroundColor, children, height, width } = this.props;

    this._app = new PIXI.Application(width, height, {
      backgroundColor: backgroundColor,
      view: this._canvas
    });

    this._mountNode = ReactPixiFiber.createContainer(this._app.stage);
    ReactPixiFiber.updateContainer(children, this._mountNode, this);

    ReactPixiFiber.injectIntoDevTools({
      findFiberByHostInstance: ReactPixiFiber.findFiberByHostInstance,
      bundleType: 1,
      version: "0.1.0",
      rendererPackageName: "react-pixi-fiber"
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { children, height, width } = this.props;

    // TODO resize stage
    if (height !== prevProps.height || width !== prevProps.width) {
    }

    ReactPixiFiber.updateContainer(children, this._mountNode, this);
  }

  componentWillUnmount() {
    ReactPixiFiber.updateContainer(null, this._mountNode, this);
  }

  render() {
    return <canvas ref={ref => (this._canvas = ref)} />;
  }
}

Stage.propTypes = {
  backgroundColor: PropTypes.number,
  children: PropTypes.node,
  height: PropTypes.number,
  width: PropTypes.number
};

Stage.childContextTypes = {
  app: PropTypes.object
};

/* API */

export { Stage, render };

export const BitmapText = TYPES.BITMAP_TEXT;
export const Container = TYPES.CONTAINER;
export const Graphics = TYPES.GRAPHICS;
export const Sprite = TYPES.SPRITE;
export const Text = TYPES.TEXT;
export const TilingSprite = TYPES.TILING_SPRITE;
