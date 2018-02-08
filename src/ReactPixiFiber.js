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
  PARTICLE_CONTAINER: "ParticleContainer",
  SPRITE: "Sprite",
  TEXT: "Text",
  TILING_SPRITE: "TilingSprite",
  CUSTOM_COMPONENT: "CustomComponent"
};

//
// A DisplayObject Point-like props
//
const gPointLikeProps = [
  "anchor",
  "pivot",
  "position",
  "scale",
  "skew",
  "tilePosition",
  "tileScale"
];

let __componentIndex = 0;
const CUSTOM_COMPONENTS = {};

const UPDATE_SIGNAL = {};

const filterProps = key => Object.keys(RESERVED_PROPS).indexOf(key) === -1;

const filterOutPoints = key => gPointLikeProps.indexOf(key) === -1;

const filterPoints = key => gPointLikeProps.indexOf(key) > -1;

/* Render Methods */

// TODO consider whitelisting props based on component type
const applyProps = (instance, props, prevProps) => {
  let filtered = filterByKey(props, filterProps);
  filtered = filterByKey(filtered, filterOutPoints);
  Object.assign(instance, filtered);

  const pointProps = filterByKey(props, filterPoints);

  Object.keys(pointProps).forEach(key => {
    setPixiValue(instance, key, props[key]);
  });
};

function isPointType(v) {
  return v instanceof PIXI.Point || v instanceof PIXI.ObservablePoint;
}

//
// Parse a value as a PIXI.Point.
//
function parsePoint(val) {
  var arr;
  if (typeof val === "string") {
    arr = val.split(",").map(val => parseFloat(val));
  } else if (typeof val === "number") {
    arr = [val];
  } else if (Array.isArray(val)) {
    // shallow copy the array
    arr = val.slice();
  } else if ("x" in val) {
    arr = [val.x, val.y];
  }
  return arr;
}

//
// Set props on a DisplayObject by checking the type. If a PIXI.Point or
// a PIXI.ObservablePoint is having its value set, then either a comma-separated
// string with in the form of "x,y" or a size 2 array with index 0 being the x
// coordinate and index 1 being the y coordinate.
//
function setPixiValue(container, key, value) {
  // Just copy the data if a Point type is being assigned to a Point type
  if (isPointType(container[key]) && isPointType(value)) {
    container[key].copy(value);
  } else if (isPointType(container[key])) {
    var coordinateData = parsePoint(value);

    if (
      typeof coordinateData === "undefined" ||
      coordinateData.length < 1 ||
      coordinateData.length > 2
    ) {
      throw new Error(
        `The property '${key}' is a PIXI.Point or PIXI.ObservablePoint and ` +
          "must be set to a comma-separated string of either 1 or 2 " +
          "coordinates, a 1 or 2 element array containing coordinates, or a " +
          "PIXI Point/ObservablePoint. If only one coordinate is " +
          "given then X and Y will be set to the provided value."
      );
    }

    container[key].set(coordinateData.shift(), coordinateData.shift());
  } else {
    container[key] = value;
  }
}

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
    version: "0.2.0",
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

const commitUpdate = (
  instance,
  updatePayload,
  type,
  oldProps,
  newProps,
  internalInstanceHandle
) => {
  if (instance.___customComponentID) {
    const component = CUSTOM_COMPONENTS[instance.___customComponentID];
    if (component.customApplyProps) {
      component.customApplyProps(instance, oldProps, newProps);
    }
  } else {
    applyProps(instance, newProps, oldProps);
  }
};

/* PIXI.js Renderer */

const ReactPixiFiber = ReactFiberReconciler({
  appendInitialChild: appendChild,

  createInstance: function(type, props, internalInstanceHandle) {
    let instance;

    switch (type) {
      case TYPES.BITMAP_TEXT:
        instance = new PIXI.BitmapText(props.text, props.style);
        break;
      case TYPES.CONTAINER:
        instance = new PIXI.Container();
        break;
      case TYPES.GRAPHICS:
        instance = new PIXI.Graphics();
        break;
      case TYPES.PARTICLE_CONTAINER:
        instance = new PIXI.particles.ParticleContainer(
          props.maxSize,
          props.properties,
          props.batchSize,
          props.autoResize
        );
        break;
      case TYPES.SPRITE:
        instance = new PIXI.Sprite(props.texture);
        break;
      case TYPES.TEXT:
        instance = new PIXI.Text(props.text, props.style, props.canvas);
        break;
      case TYPES.TILING_SPRITE:
        instance = new PIXI.extras.TilingSprite(
          props.texture,
          props.width,
          props.height
        );
        break;
      default:
        break;
    }

    if (CUSTOM_COMPONENTS[type]) {
      const component = CUSTOM_COMPONENTS[type];
      instance = component.customDisplayObject(props);
      instance.___customComponentID = type;
      if (component.customApplyProps) {
        component.customApplyProps(instance, {}, props);
      }
    } else {
      invariant(instance, 'ReactPixiFiber does not support the type: "%s"', type);

      applyProps(instance, props);
    }

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
    const {
      backgroundColor,
      children,
      height,
      width,
      resolution = 1
    } = this.props;

    this._app = new PIXI.Application(width, height, {
      backgroundColor: backgroundColor,
      view: this._canvas,
      resolution
    });

    this._mountNode = ReactPixiFiber.createContainer(this._app.stage);
    ReactPixiFiber.updateContainer(children, this._mountNode, this);

    ReactPixiFiber.injectIntoDevTools({
      findFiberByHostInstance: ReactPixiFiber.findFiberByHostInstance,
      bundleType: 1,
      version: "0.2.0",
      rendererPackageName: "react-pixi-fiber"
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { children, height, width, prepare } = this.props;

    // TODO resize stage
    if (height !== prevProps.height || width !== prevProps.width) {
      this._canvas.height = height;
      this._canvas.width = width;

      this._app.renderer.resize(width, height);
    }

    if (prepare && prepare !== prevProps.prepare) {
      var { plugins } = this._app.renderer;

      if (!Array.isArray(prepare)) {
        plugins.prepare.upload(prepare);
      } else {
        prepare.forEach(item => {
          plugins.prepare.add(item);
        });
        plugins.prepare.upload();
      }
    }

    ReactPixiFiber.updateContainer(children, this._mountNode, this);
  }

  componentWillUnmount() {
    ReactPixiFiber.updateContainer(null, this._mountNode, this);
  }

  render() {
    const { style } = this.props;

    return <canvas ref={ref => (this._canvas = ref)} style={style} />;
  }
}

Stage.propTypes = {
  backgroundColor: PropTypes.number,
  children: PropTypes.node,
  height: PropTypes.number,
  width: PropTypes.number,
  resolution: PropTypes.number,
  style: PropTypes.object,
  prepare: PropTypes.array
};

Stage.childContextTypes = {
  app: PropTypes.object
};

/* API */

export { Stage, render };

export const BitmapText = TYPES.BITMAP_TEXT;
export const Container = TYPES.CONTAINER;
export const Graphics = TYPES.GRAPHICS;
export const ParticleContainer = TYPES.PARTICLE_CONTAINER;
export const Sprite = TYPES.SPRITE;
export const Text = TYPES.TEXT;
export const TilingSprite = TYPES.TILING_SPRITE;

export function CustomPIXIComponent(params) {
  const CustomComponentID = TYPES.CUSTOM_COMPONENT + __componentIndex++;

  CUSTOM_COMPONENTS[CustomComponentID] = params;

  return CustomComponentID;
}
