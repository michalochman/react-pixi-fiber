import React from "react";
import PropTypes from "prop-types";
import ReactFiberReconciler from "react-reconciler";
import emptyObject from "fbjs/lib/emptyObject";
import invariant from "fbjs/lib/invariant";
import now from "performance-now";
import * as PIXI from "pixi.js";

// List of props that should be handled in a specific way
const RESERVED_PROPS = {
  children: true, // special handling in React
};

// List of default values for DisplayObject members
const DEFAULT_PROPS = {
  alpha: 1,
  buttonMode: false,
  cacheAsBitmap: false,
  cursor: "auto",
  filterArea: null,
  filters: null,
  hitArea: null,
  interactive: false,
  // localTransform  // readonly
  mask: null,
  // parent  // readonly
  pivot: 0,
  position: 0,
  renderable: true,
  rotation: 0,
  scale: 1,
  skew: 0,
  transform: null,
  visible: true,
  // worldAlpha  // readonly
  // worldTransform  // readonly
  // worldVisible  // readonly
  x: 0,
  y: 0,
};

// List of types supported by ReactPixiFiber
const TYPES = {
  BITMAP_TEXT: "BitmapText",
  CONTAINER: "Container",
  GRAPHICS: "Graphics",
  PARTICLE_CONTAINER: "ParticleContainer",
  SPRITE: "Sprite",
  TEXT: "Text",
  TILING_SPRITE: "TilingSprite",
};

const UPDATE_SIGNAL = {};

/* Helper Methods */

const not = fn => (...args) => !fn(...args);

const including = props => key => props.indexOf(key) !== -1;

function filterByKey(inputObject, filter) {
  const exportObject = {};

  Object.keys(inputObject)
    .filter(filter)
    .forEach(key => {
      exportObject[key] = inputObject[key];
    });

  return exportObject;
}

const includingReservedProps = including(Object.keys(RESERVED_PROPS));

/* Inject Methods */

const INJECTED_TYPES = {};
const injectType = (type, behavior) => {
  INJECTED_TYPES[type] = behavior;
  return type;
};

/* Render Methods */

// TODO consider whitelisting props based on component type
function defaultApplyProps(instance, oldProps, newProps) {
  Object.keys(newProps)
    .filter(not(includingReservedProps))
    .forEach(propName => {
      const value = newProps[propName];

      // Set value if defined
      if (typeof value !== "undefined") {
        setPixiValue(instance, propName, value);
      } else if (typeof instance[propName] !== "undefined" && typeof DEFAULT_PROPS[propName] !== "undefined") {
        // Reset to default value (if it is defined) when display object had prop set and no longer has
        console.warn(`setting DEFAULT PROP: ${propName} was ${instance[propName]} is ${value} for`, instance);
        setPixiValue(instance, propName, DEFAULT_PROPS[propName]);
      }
    });
}

const applyProps = (instance, oldProps, newProps) => {
  if (typeof instance._customApplyProps === "function") {
    instance._customApplyProps(instance, oldProps, newProps);
  } else {
    defaultApplyProps(instance, oldProps, newProps);
  }
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
    version: "0.4.0",
    rendererPackageName: "react-pixi-fiber",
  });
}

/* Point related Methods */

// Converts value to an array of coordinates
function parsePoint(value) {
  let arr = [];
  if (typeof value === "string") {
    arr = value.split(",");
  } else if (typeof value === "number") {
    arr = [value];
  } else if (Array.isArray(value)) {
    // shallow copy the array
    arr = value.slice();
  } else if (typeof value.x !== "undefined" && typeof value.y !== "undefined") {
    arr = [value.x, value.y];
  }

  return arr.map(Number);
}

function isPointType(value) {
  return value instanceof PIXI.Point || value instanceof PIXI.ObservablePoint;
}

// Set props on a DisplayObject by checking the type. If a PIXI.Point or
// a PIXI.ObservablePoint is having its value set, then either a comma-separated
// string with in the form of "x,y" or a size 2 array with index 0 being the x
// coordinate and index 1 being the y coordinate.
// See: https://github.com/Izzimach/react-pixi/blob/a25196251a13ed9bb116a8576d93e9fceac2a14c/src/ReactPIXI.js#L114
function setPixiValue(instance, propName, value) {
  if (isPointType(instance[propName]) && isPointType(value)) {
    // Just copy the data if a Point type is being assigned to a Point type
    instance[propName].copy(value);
  } else if (isPointType(instance[propName])) {
    // Parse value if a non-Point type is being assigned to a Point type
    const coordinateData = parsePoint(value);

    invariant(
      typeof coordinateData !== "undefined" && coordinateData.length > 0 && coordinateData.length < 3,
      "The property `%s` is a PIXI.Point or PIXI.ObservablePoint and must be set to a comma-separated string of " +
        "either 1 or 2 coordinates, a 1 or 2 element array containing coordinates, or a PIXI Point/ObservablePoint. " +
        "If only one coordinate is given then X and Y will be set to the provided value. Received: `%s` of type `%s`.",
      propName,
      JSON.stringify(value),
      typeof value
    );

    instance[propName].set(coordinateData.shift(), coordinateData.shift());
  } else {
    // Just assign the value directly if a non-Point type is being assigned to a non-Point type
    instance[propName] = value;
  }
}

/* PIXI.js Renderer */

function appendChild(parentInstance, child) {
  // TODO do we need to remove the child first if it's already added?
  parentInstance.removeChild(child);

  parentInstance.addChild(child);
  if (typeof child._customDidAttach === "function") {
    child._customDidAttach(child);
  }
}

function removeChild(parentInstance, child) {
  if (typeof child._customWillDetach === "function") {
    child._customWillDetach(child);
  }

  parentInstance.removeChild(child);

  child.destroy();
}

function insertBefore(parentInstance, child, beforeChild) {
  invariant(child !== beforeChild, "ReactPixiFiber cannot insert node before itself");

  const childExists = parentInstance.children.indexOf(child) !== -1;
  const index = parentInstance.getChildIndex(beforeChild);

  if (childExists) {
    parentInstance.setChildIndex(child, index);
  } else {
    parentInstance.addChildAt(child, index);
  }
}

function commitUpdate(instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
  applyProps(instance, oldProps, newProps);
}

const ReactPixiFiber = ReactFiberReconciler({
  appendInitialChild: appendChild,

  createInstance: function(type, props, internalInstanceHandle) {
    let instance;

    switch (type) {
      case TYPES.BITMAP_TEXT:
        instance = new PIXI.extras.BitmapText(props.text, props.style);
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
        instance = new PIXI.extras.TilingSprite(props.texture, props.width, props.height);
        break;
      default:
        if (type in INJECTED_TYPES) {
          const injectedType = INJECTED_TYPES[type];
          let customDisplayObject;
          if (typeof injectedType === "function") {
            customDisplayObject = injectedType;
          } else if (typeof injectedType.customDisplayObject === "function") {
            customDisplayObject = injectedType.customDisplayObject;
          }

          invariant(customDisplayObject, "Invalid Component injected to ReactPixiFiber: `%s`.", type);

          instance = customDisplayObject(props);

          if (typeof injectedType.customApplyProps === "function") {
            instance._customApplyProps = injectedType.customApplyProps.bind({
              // See: https://github.com/Izzimach/react-pixi/blob/a25196251a13ed9bb116a8576d93e9fceac2a14c/src/ReactPIXI.js#L953
              applyDisplayObjectProps: defaultApplyProps.bind(null, instance),
            });
          }
          if (typeof injectedType.customDidAttach === "function") {
            instance._customDidAttach = injectedType.customDidAttach;
          }
          if (typeof injectedType.customWillDetach === "function") {
            instance._customWillDetach = injectedType.customWillDetach;
          }
        }
        break;
    }

    invariant(instance, "ReactPixiFiber does not support the type: `%s`.", type);

    applyProps(instance, {}, props);

    return instance;
  },

  createTextInstance: function(text, rootContainerInstance, internalInstanceHandle) {
    invariant(false, "ReactPixiFiber does not support text instances. Use Text component instead.");
  },

  finalizeInitialChildren: function(pixiElement, type, props, rootContainerInstance) {
    return false;
  },

  getChildHostContext: function(parentHostContext, type) {
    return emptyObject;
  },

  getRootHostContext: function(rootContainerInstance) {
    return emptyObject;
  },

  getPublicInstance: function(inst) {
    return inst;
  },

  now: now,

  prepareForCommit: function() {
    // Noop
  },

  prepareUpdate: function(pixiElement, type, oldProps, newProps, rootContainerInstance, hostContext) {
    return UPDATE_SIGNAL;
  },

  resetAfterCommit: function() {
    // Noop
  },

  resetTextContent: function(pixiElement) {
    // Noop
  },

  shouldDeprioritizeSubtree: function(type, props) {
    const isAlphaVisible = typeof props.alpha === "undefined" || props.alpha > 0;
    const isRenderable = typeof props.renderable === "undefined" || props.renderable === true;
    const isVisible = typeof props.visible === "undefined" || props.visible === true;

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

    commitTextUpdate: function(textInstance, oldText, newText) {
      // Noop
    },

    commitMount: function(instance, type, newProps) {
      // Noop
    },

    commitUpdate: commitUpdate,
  },
});

/* React Components */

function validateCanvas(props, propName, componentName) {
  const isCanvas = props[propName] instanceof Element && typeof props[propName].getContext === "function";
  if (!isCanvas && typeof props[propName] !== "undefined") {
    const propType = typeof props[propName];
    return new Error(
      `Invalid prop '${propName}' of type '${propType}' supplied to '${componentName}', expected '<canvas> Element'.`
    );
  }
}

const StagePropTypes = {
  options: PropTypes.shape({
    antialias: PropTypes.bool,
    autoStart: PropTypes.bool,
    backgroundColor: PropTypes.number,
    clearBeforeRender: PropTypes.bool,
    forceCanvas: PropTypes.bool,
    forceFXAA: PropTypes.bool,
    height: PropTypes.number,
    legacy: PropTypes.bool,
    powerPreference: PropTypes.string,
    preserveDrawingBuffer: PropTypes.bool,
    resolution: PropTypes.number,
    roundPixels: PropTypes.bool,
    sharedLoader: PropTypes.bool,
    sharedTicker: PropTypes.bool,
    transparent: PropTypes.bool,
    view: validateCanvas,
    width: PropTypes.number,
  }),
  children: PropTypes.node,
  height: PropTypes.number,
  width: PropTypes.number,
};
const StageChildContextTypes = {
  app: PropTypes.object,
};

const includingDisplayObjectProps = including(Object.keys(DEFAULT_PROPS));
const includingStageProps = including(Object.keys(StagePropTypes));
const includingCanvasProps = key => !includingDisplayObjectProps(key) && !includingStageProps(key);

const getCanvasProps = props => filterByKey(props, includingCanvasProps);
const getDisplayObjectProps = props => filterByKey(props, includingDisplayObjectProps);

class Stage extends React.Component {
  getChildContext() {
    return {
      app: this._app,
    };
  }

  componentDidMount() {
    const { children, height, options, width } = this.props;

    this._app = new PIXI.Application(width, height, {
      view: this._canvas,
      ...options,
    });

    // Apply root Container props
    const stageProps = getDisplayObjectProps(this.props);
    applyProps(this._app.stage, {}, stageProps);

    this._mountNode = ReactPixiFiber.createContainer(this._app.stage);
    ReactPixiFiber.updateContainer(children, this._mountNode, this);

    ReactPixiFiber.injectIntoDevTools({
      findFiberByHostInstance: ReactPixiFiber.findFiberByHostInstance,
      bundleType: 1,
      version: "0.2.0",
      rendererPackageName: "react-pixi-fiber",
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { children, height, width } = this.props;

    // Apply root Container props
    const stageProps = getDisplayObjectProps(this.props);
    applyProps(this._app.stage, {}, stageProps);

    // Root container has been resized - resize renderer
    if (height !== prevProps.height || width !== prevProps.width) {
      this._app.renderer.resize(width, height);
    }

    ReactPixiFiber.updateContainer(children, this._mountNode, this);
  }

  componentWillUnmount() {
    ReactPixiFiber.updateContainer(null, this._mountNode, this);
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
}

Stage.propTypes = StagePropTypes;
Stage.childContextTypes = StageChildContextTypes;

function CustomPIXIComponent(behavior, type) {
  invariant(
    typeof type === "string",
    "Invalid argument `type` of type `%s` supplied to `CustomPIXIComponent`, expected `string`.",
    typeof type
  );

  return injectType(type, behavior);
}

/* API */

export { CustomPIXIComponent, Stage, render };

export const BitmapText = TYPES.BITMAP_TEXT;
export const Container = TYPES.CONTAINER;
export const Graphics = TYPES.GRAPHICS;
export const ParticleContainer = TYPES.PARTICLE_CONTAINER;
export const Sprite = TYPES.SPRITE;
export const Text = TYPES.TEXT;
export const TilingSprite = TYPES.TILING_SPRITE;
