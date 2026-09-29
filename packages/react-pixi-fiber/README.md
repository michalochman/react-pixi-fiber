<div align="center">
  <img alt="ReactPixiFiber" src="./react-pixi.svg" width="500" />
</div>

<div align="center">
  <h1>ReactPixiFiber – React Fiber renderer for PixiJS</h1>

  <p>
    ReactPixiFiber is a JavaScript library for writing <a href="https://pixijs.com/">PixiJS</a> applications using <a href="https://reactjs.org/">React</a> declarative style. An adapter for your React version and one for your PixiJS version plug it in, see <a href="#setup">Setup</a>.
    <br />
    For React <16.0.0 see <a href="https://github.com/Izzimach/react-pixi">react-pixi</a>.
  </p>

  <a href="https://npmjs.com/package/react-pixi-fiber">
    <img alt="npm" src="https://img.shields.io/npm/v/react-pixi-fiber.svg" />
  </a>
  <a href="./LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/michalochman/react-pixi-fiber.svg" />
  </a>
  <a href="https://circleci.com/gh/michalochman/react-pixi-fiber/tree/master">
    <img alt="CircleCI" src="https://img.shields.io/circleci/project/github/michalochman/react-pixi-fiber/master.svg" />
  </a>
  <a href="https://biomejs.dev">
    <img alt="formatted with Biome" src="https://img.shields.io/badge/formatted_with-Biome-60a5fa.svg" />
  </a>
</div>

## Demo

The [examples](../../apps/examples) cover the API. They are hosted at https://react-pixi-fiber.pages.dev; to run them locally, use `pnpm install`, `pnpm build` and `pnpm start` in the repository.


## Installing

Install the core, one React adapter and one PixiJS adapter next to [React] and [PixiJS]. For React 18 and PixiJS 6:

    npm install react-pixi-fiber @react-pixi-fiber/react-18 @react-pixi-fiber/pixi-6 react pixi.js@6

or

    yarn add react-pixi-fiber @react-pixi-fiber/react-18 @react-pixi-fiber/pixi-6 react pixi.js@6

This package works with [Vite](https://vite.dev) and webpack based setups such as [Create React App](https://github.com/facebookincubator/create-react-app) – the examples below use Vite.

## Setup

Call `configure` once in the app entry, before the first render:

```js
import { configure } from "react-pixi-fiber";
import react18 from "@react-pixi-fiber/react-18";
import pixi6 from "@react-pixi-fiber/pixi-6";

configure({ react: react18(), pixi: pixi6() });
```

Components import only from `react-pixi-fiber`, so a shared component library does not depend on the React or PixiJS version. Pick the adapters that match the versions the app installs:

| Adapter | Supports |
| --- | --- |
| [`@react-pixi-fiber/react-18`](https://www.npmjs.com/package/@react-pixi-fiber/react-18) | `react` ^18.0.0 |
| [`@react-pixi-fiber/pixi-6`](https://www.npmjs.com/package/@react-pixi-fiber/pixi-6) | `pixi.js` ^6.0.0 |

Without `configure`, the first render throws an error that prints the install line and these setup lines.

## Usage

<details open>
  <summary>
    <strong>With ReactDOM (React 18 and above)</strong>
  </summary>

```jsx harmony
import { createRoot } from "react-dom/client";
import { Sprite, Stage } from "react-pixi-fiber";
import bunny from "./bunny.png";

function Bunny (props) {
  return <Sprite texture={PIXI.Texture.from(bunny)} {...props} />;
}

const container = document.getElementById("container");
const root = createRoot(container);

root.render(
  <Stage options={{ backgroundColor: 0x10bb99, height: 600, width: 800 }}>
    <Bunny x={200} y={200} />
  </Stage>,
);
```

This example will render [`PIXI.Sprite`] object into a [Root Container] of [`PIXI.Application`] on the page.

The HTML-like syntax; [called JSX](https://reactjs.org/docs/introducing-jsx.html) is not required to use with this renderer, but it makes code more readable. You can use [Babel](https://babeljs.io/) with a [React preset](https://babeljs.io/docs/plugins/preset-react/) to convert JSX into native JavaScript.
</details>

---

<details>
  <summary>
    <strong>With ReactDOM (React 16 and 17)</strong>
  </summary>

React 16 and 17 are supported by `react-pixi-fiber@1.x` only. `react-pixi-fiber@2.x` requires React 18.2 or newer.

```jsx harmony
import { render } from "react-dom";
import { Sprite, Stage } from "react-pixi-fiber";
import bunny from "./bunny.png";

function Bunny(props) {
  return <Sprite texture={PIXI.Texture.from(bunny)} {...props} />;
}

const container = document.getElementById("container");
render(
  <Stage options={{ backgroundColor: 0x10bb99, height: 600, width: 800 }}>
    <Bunny x={200} y={200} />
  </Stage>,
  container
);
```

This example will render [`PIXI.Sprite`] object into a [Root Container] of [`PIXI.Application`] on the page.

The HTML-like syntax; [called JSX](https://reactjs.org/docs/introducing-jsx.html) is not required to use with this renderer, but it makes code more readable. You can use [Babel](https://babeljs.io/) with a [React preset](https://babeljs.io/docs/plugins/preset-react/) to convert JSX into native JavaScript.
</details>

---

<details>
  <summary>
    <strong>Without ReactDOM</strong>
  </summary>

```jsx harmony
import { render, Text } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

// Setup PixiJS Application
const canvasElement = document.getElementById("container")
const app = new PIXI.Application({
  backgroundColor: 0x10bb99,
  view: canvasElement,
  width: 800,
  height: 600,
});

render(
  <Text text="Hello World!" x={200} y={200} />, 
  app.stage
);
```

This example will render [`PIXI.Text`] object into a [Root Container] of PIXI Application (created as `app`) inside the `<canvas id="container"></canvas>` element on the page.
</details>


## Running Examples

The examples live in [`apps/examples`](../../apps/examples) of the [repository](https://github.com/michalochman/react-pixi-fiber) and use the local `react-pixi-fiber` package.

1. Run `pnpm install` in the repository root.
2. Run `pnpm build` in the repository root. The examples load the built files, so rebuild after changing the package source.
3. Run `pnpm start` in the repository root.
4. Wait few seconds and browse examples that will open in new browser window.


## API

### Components

React Pixi Fiber supports the following components out of the box (but read [Custom Components](#custom-components) section if you need more):

#### `<Stage />`

Renders [Root Container] of any [`PIXI.Application`].

Expects **one** the following props:
* `app` - pass your own [`PIXI.Application`] instance,
* `options` - pass only the [`PIXI.Application`] options.

`onInit(app)` is called once the application exists and the children are rendered.

#### Tags

Each tag names a display object concept. The configured PixiJS adapter creates the matching class of your PixiJS version.

| Tag | Renders |
| --- | --- |
| `<AnimatedSprite />` | an animated sprite, `PIXI.AnimatedSprite` |
| `<BitmapText />` | bitmap font text, [`PIXI.BitmapText`] |
| `<Container />` | a container, [`PIXI.Container`] |
| `<Graphics />` | vector graphics, [`PIXI.Graphics`] |
| `<Mesh />` | a mesh from geometry and a shader, `PIXI.Mesh` |
| `<MeshPlane />` | a textured plane mesh |
| `<MeshRope />` | a textured rope mesh |
| `<MeshSimple />` | a simple textured mesh |
| `<NineSliceSprite />` | a nine-slice scaled sprite |
| `<ParticleContainer />` | a fast container for many sprites, [`PIXI.ParticleContainer`] |
| `<Sprite />` | a sprite, [`PIXI.Sprite`] |
| `<Text />` | canvas text, [`PIXI.Text`] |
| `<TilingSprite />` | a repeating texture, [`PIXI.TilingSprite`] |

### Props

[Similarly](https://reactjs.org/blog/2017/09/08/dom-attributes-in-react-16.html) to ReactDOM in React 16,
ReactPixiFiber is not ignoring unknown [`PIXI.DisplayObject`] members – they are all passed through. You can read
more about [Unknown Prop Warning](https://reactjs.org/warnings/unknown-prop.html) in ReactDOM.


#### Custom Props / Plugins

In case you are using PixiJS plugins, such as [`pixi-layers`](https://github.com/pixijs/pixi-layers), their props are set on the instance like any other prop. To have them checked in development, register them with `PIXIProperty`:

`PIXIProperty(maybeComponentType, propertyName, validator)` accepts:
* `maybeComponentType` – a ReactPixiFiber component or tag, an array of them, or `undefined`/`null`. Passing `undefined` or `null` will apply custom property to all ReactPixiFiber components.
* `propertyName` – a name of the custom property as string. ReactPixiFiber will also check that the casing is correct.
* `validator` – optional function that will be called with value provided and should return `true` if the value is valid, `false` otherwise.

The checks run in development under a `<StrictMode>` inside `Stage` (or inside the tree passed to `render`) and report warnings, not errors.

For example:

```jsx
import { Container, PIXIProperty, Sprite } from "react-pixi-fiber";

const group = new PIXI.display.Group(0, true);

// check only the casing of the name
PIXIProperty(Container, "parentGroup");
PIXIProperty(undefined, "zIndex");

// also check the values that are provided
PIXIProperty(Container, "parentGroup", value => value instanceof PIXI.display.Group);
PIXIProperty([Container, Sprite], "zIndex", value => Number.isFinite(value));

function App() {
  return (
    <Container>
      <Container parentGroup={group}>
        <Sprite texture={PIXI.Texture.WHITE} x={10} y={10} zIndex={1} />
        <Sprite texture={PIXI.Texture.WHITE} x={15} y={15} zIndex={2} />
      </Container>
      {/* `parentgroup` below will trigger prop warning, as the letter casing is incorrect */}
      <Container parentgroup={group}>
        <Sprite texture={PIXI.Texture.WHITE} x={100} y={100} zIndex={1} />
        {/* `zindex` below will trigger prop warning, as the letter casing is incorrect */}
        <Sprite texture={PIXI.Texture.WHITE} x={105} y={105} zindex={2} />
      </Container>
    </Container>
  )
}
```


#### Setting values for Point and ObservablePoint types

For setting properties on PixiJS types that are either [`PIXI.Point`]s or [`PIXI.ObservablePoint`]s you can use either 
and array of integers or a comma-separated string of integers in the following forms: `[x,y]`, `"x,y"`, `[i]`, `"i"`. 

In the case where two integers are provided, the first will be applied to the `x` coordinate and the second will be 
applied to the `y` coordinate. In the case where a single integer if provided, it will be applied to both coordinates.

You can still create your own PIXI `Point` or `ObservablePoint` objects and assign them directly to the property. 
These won't actually replace the property but they will be applied using the original object's `.copy()` method.

### Context – Accessing `PIXI.Application` instance created by `<Stage />`

`PIXI.Application` is automatically provided using the following definition (either as a prop or in context):
* `app` – an instance of PixiJS Application, with properties like:
  * `loader` – Loader instance to help with asset loading,
  * `renderer` – WebGL or CanvasRenderer,
  * `ticker` – Ticker for doing render updates,
  * `view` – reference to the renderer's canvas element. 

<details>
  <summary>
    <strong>Using <code>withApp</code> Higher-Order Component (with all React versions)</strong>
  </summary>

To get `app` prop in your component you may wrap it with `withApp` higher-order component:

```jsx harmony
import { render } from "react-dom";
import { Sprite, Stage, withApp } from "react-pixi-fiber";
import bunny from "./bunny.png";

class RotatingBunny extends Component {
  state = {
    rotation: 0,
  };

  componentDidMount() {
    // Note that `app` prop is coming through `withApp` HoC
    this.props.app.ticker.add(this.animate);
  }

  componentWillUnmount() {
    this.props.app.ticker.remove(this.animate);
  }

  animate = delta => {
    this.setState(state => ({
      rotation: state.rotation + 0.1 * delta,
    }));
  };

  render() {
    return (
      <Sprite 
        {...this.props}
        texture={PIXI.Texture.from(bunny)}
        rotation={this.state.rotation} 
      />
    );
  }
}
RotatingBunny.propTypes = {
  app: PropTypes.object.isRequired,
};

const RotatingBunnyWithApp = withApp(RotatingBunny);

render(
  <Stage options={{ backgroundColor: 0x10bb99, height: 600, width: 800 }}>
    <RotatingBunnyWithApp x={200} y={200} />
  </Stage>,
  document.getElementById("container")
);
```

</details>

---

<details>
  <summary>
    <strong>Using New Context API directly (with React 16.3.0 and newer)</strong>
  </summary>

```jsx harmony
import { render } from "react-dom";
import { AppContext, Sprite, Stage } from "react-pixi-fiber";
import bunny from "./bunny.png";

class RotatingBunny extends Component {
  state = {
    rotation: 0,
  };

  componentDidMount() {
    // Note that `app` prop is coming directly from AppContext.Consumer
    this.props.app.ticker.add(this.animate);
  }

  componentWillUnmount() {
    this.props.app.ticker.remove(this.animate);
  }

  animate = delta => {
    this.setState(state => ({
      rotation: state.rotation + 0.1 * delta,
    }));
  };

  render() {
    return (
      <Sprite 
        {...this.props}
        texture={PIXI.Texture.from(bunny)}
        rotation={this.state.rotation} 
      />
    );
  }
}
RotatingBunny.propTypes = {
  app: PropTypes.object.isRequired,
};

render(
  <Stage options={{ backgroundColor: 0x10bb99, height: 600, width: 800 }}>
    <AppContext.Consumer>
      {app => (
        <RotatingBunny app={app} x={200} y={200} />
      )}
    </AppContext.Consumer>
  </Stage>,
  document.getElementById("container")
);
```

</details>

---

<details>
  <summary>
    <strong>Using Legacy Context API directly (with React older than 16.3.0)</strong>
  </summary>

This approach is not recommended as it is easier to just use `withApp` HoC mentioned above.

```jsx harmony
import { render } from "react-dom";
import { Sprite, Stage } from "react-pixi-fiber";
import bunny from "./bunny.png";

class RotatingBunny extends Component {
  state = {
    rotation: 0,
  };

  componentDidMount() {
    // Note that `app` is coming from context, NOT from props
    this.context.app.ticker.add(this.animate);
  }

  componentWillUnmount() {
    this.context.app.ticker.remove(this.animate);
  }

  animate = delta => {
    this.setState(state => ({
      rotation: state.rotation + 0.1 * delta,
    }));
  };

  render() {
    return (
      <Sprite 
        {...this.props}
        texture={PIXI.Texture.from(bunny)}
        rotation={this.state.rotation} 
      />
    );
  }
}
// Note that here we tell React to apply `app` via legacy Context API
RotatingBunny.childContextTypes = {
  app: PropTypes.object,
};

render(
  <Stage options={{ backgroundColor: 0x10bb99, height: 600, width: 800 }}>
    <RotatingBunny x={200} y={200} />
  </Stage>,
  document.getElementById("container")
);
```

</details>

---

### Custom Components

`PIXIComponent(type, behavior)` registers a component under the `type` string and returns it. `behavior` is an object with the following 4 properties.

#### `create(props)`

Use this to create an instance of [`PIXI.DisplayObject`].

This is your entry point to custom components and the only required method.

#### `applyProps(displayObject, oldProps, newProps)` (optional)

Use this to apply `newProps` to your `Component` in a custom way. `oldProps` is `undefined` on the first render.

Note: this replaces the default method of transferring `props` to the specified `displayObject`. Call `this.applyDisplayObjectProps(oldProps, newProps)` inside your `applyProps` method if you want that.

#### `afterAdd(displayObject)` (optional)

Use this to do something after `displayObject` is added to its parent.

#### `beforeRemove(displayObject)` (optional)

Use this to do something (usually cleanup) before `displayObject` is removed from its parent.

#### Simple Graphics example

For example, this is how you could implement `Rectangle` component:
```javascript
// components/Rectangle.js
import { PIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

export default PIXIComponent("Rectangle", {
  create: props => new PIXI.Graphics(),
  applyProps: function (instance, oldProps, newProps) {
    const { fill, x, y, width, height } = newProps;
    instance.clear();
    instance.beginFill(fill);
    instance.drawRect(x, y, width, height);
    instance.endFill();
  },
});
```

```jsx harmony
// App.js
import { render } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import Rectangle from "./components/Rectangle";

// `configure` has run in the app entry, see Setup
const app = new PIXI.Application({
  view: document.getElementById("container"),
  width: 800,
  height: 600,
});

render(
  <Rectangle
    x={250}
    y={200}
    width={300}
    height={200}
    fill={0xFFFF00}
  />,
  app.stage
);
```

## Testing


## Caveats


## FAQ

### Is it production ready?

Yes and it's awesome! It is battle tested and backed up by [Kalamba Games](https://kalambagames.com/games/) since the conception in the beginning of 2018 (after [migrating from `react-pixi`](#migrating-from-react-pixi)) and now also used by other game studios.

### What version of PixiJS I can use?

The one your PixiJS adapter supports, see the adapter table in [Setup](#setup).

### Can I use it in my TypeScript project?

Sure thing! We've got you covered.

### Can I use already existing [`PIXI.Application`]?

Yes, you can pass `app` property to `Stage` component, e.g. `<Stage app={app} />`.

### Can I migrate from `react-pixi-fiber@0.x.y`?

Yes, read [migration guide](#migrating-from-react-pixi-fiber0xy-before-version-100).

### Can I migrate from `react-pixi-fiber@2.x`?

Yes, read [migration guide](#migrating-to-300).

### Can I migrate from `react-pixi`?

Yes, it is easy, read [migration guide](#migrating-from-react-pixi).

### Is server-side rendering supported?

No, unfortunately it is not supported right now.


## Migrating from `react-pixi-fiber@0.x.y` (before version `1.0.0`)

<details>
  <summary>
    <strong>Changed built-in <code>Stage</code> and the one returned by <code>createStageClass()</code> to have the same API</strong>
  </summary>

It is now possible to get `ref` to built-in `Stage`.

Unless you are using class-based `Stage` component explicitly in your application, for example you are extending it, you should prefer to use built-in `Stage` instead of creating it with `createStageClass()`.

Data available on the `Stage` "instance":
* `_app` - PIXI.Application instance
* `_canvas` - HTMLCanvasElement instance
* `props` - props passed to Stage component

For example:
```js
import * as React from "react";
import { Stage, Text } from "react-pixi-fiber";

const width = 600;
const height = 400;
const options = {
  backgroundColor: 0x56789a,
  width: width,
  height: height
};
const style = {
  width: width,
  height: height
};

function App() {
  const stageRef = React.useRef()
  React.useEffect(() => {
    // Access PIXI.Application instance
    console.log(stageRef.current?._app.current)
    // Access HTMLCanvasElement instance
    console.log(stageRef.current?._canvas.current)
    // Access props passed to Stage component
    console.log(stageRef.current?.props)
  }, [])

  return (
    <Stage options={options} style={style} ref={stageRef}>
      <Text x={100} y={100} text="Hello world!" />
    </Stage>
  );
}
```
</details>

---

<details>
  <summary>
    <strong>Changed <code>PIXI.Application</code> exposed by <code>Stage</code> to be React <code>ref</code></strong>
  </summary>

This is only relevant if you were using `createStageClass()` to create `Stage` component, as it was impossible to get `ref` when using built-in `Stage` as if was a function component, which triggered `Warning: Function components cannot be given refs` error.

For example:
```diff
import * as React from "react";
import { createStageClass, Text } from "react-pixi-fiber";

const Stage = createStageClass()

const width = 600;
const height = 400;
const options = {
  backgroundColor: 0x56789a,
  width: width,
  height: height
};
const style = {
  width: width,
  height: height
};

function App() {
  const stageRef = React.useRef()
  React.useEffect(() => {
-    console.log(stageRef.current?._app.renderer)
+    console.log(stageRef.current?._app.current.renderer)
  }, [])

  return (
    <Stage options={options} style={style} ref={stageRef}>
      <Text x={100} y={100} text="Hello world!" />
    </Stage>
  );
}
```
</details>

---

<details>
  <summary>
    <strong>Changed <code>oldProps</code> in <code>customApplyProps</code> to not be initialised when the component is first rendered</strong>
  </summary>

Make sure to check if `oldProps` is initialised before trying to read properties from it.

For example:
```diff
import { Container, CustomPIXIComponent } from "react-pixi-fiber"

const TYPE = "CustomContainer"
const behavior = {
  customApplyProps: function (instance, oldProps, newProps) {
-    const { customProp: oldCustomProp, ...otherOldProps } = oldProps
+    const { customProp: oldCustomProp, ...otherOldProps } = oldProps ?? {}
    const { customProp, ...otherNewProps } = newProps
    if (customProp !== oldCustomProp) {
      // Do something when customProp value have changed
    }
    this.applyDisplayObjectProps(otherOldProps, otherNewProps)
  },
  customDisplayObject: function ({ customProp, ...props }) {
    const container = new PIXI.Container(props)
    if (customProp === "foo") {
      // Do something when customProp is equal to "foo"
    }
    return container
  },
}

export default CustomPIXIComponent(behavior, TYPE)
```
</details>

---

<details>
  <summary>
    <strong>Changed <code>applyProps</code> to <code>applyDisplayObjectProps</code></strong>
  </summary>


`react-pixi-fiber` now needs to know the type of component (e.g. `"Sprite"`) to properly apply the props.

For example:
```diff
-import { applyProps } from "react-pixi-fiber"
+import { applyDisplayObjectProps } from "react-pixi-fiber"

function ApplyAnimatedValues(instance, props) {
  if (instance instanceof PIXI.DisplayObject) {
-    applyProps(instance, {}, props)
+    // Component has custom way of applying props - use that
+    if (typeof instance._customApplyProps === "function") {
+      instance._customApplyProps(instance, {}, props)
+    }
+    // Component doesn't have custom way of applying props - use default way
+    else {
+      const type = instance.constructor.name
+      applyDisplayObjectProps(type, instance, {}, props)
    }
  } else {
    return false
  }
}
```

Refer to the implementation, when in doubt:
* old `applyProps` -> https://github.com/michalochman/react-pixi-fiber/blob/64e8e9f991f51b407f3af108da732e186429454a/src/ReactPixiFiber.js#L43
* new `applyDisplayObjectProps` -> https://github.com/michalochman/react-pixi-fiber/blob/3a9b71b8d18180117bf70459dd6b4419c5ef1c21/src/ReactPixiFiberComponent.js#L161
</details>

---

## Migrating from `react-pixi`

React Pixi Fiber covers the `react-pixi` API with named exports. The `react-pixi-fiber/react-pixi-alias` drop-in subpath was removed in 3.0.0, so import from `react-pixi-fiber` and drop any `react-pixi` bundler alias.

```jsx
// react-pixi
import ReactPIXI from "react-pixi";
const { Stage, DisplayObjectContainer, Sprite } = ReactPIXI;
ReactPIXI.render(<Stage width={800} height={600}>…</Stage>, element);

// react-pixi-fiber
import { createRoot } from "react-dom/client";
import { Stage, Container, Sprite } from "react-pixi-fiber";
createRoot(element).render(<Stage options={{ width: 800, height: 600 }}>…</Stage>);
```

`DisplayObjectContainer` is `Container`, and `CustomPIXIComponent` is `PIXIComponent` (see [Migrating to 3.0.0](#migrating-to-300)). `ReactPIXI.factories` has no equivalent.

---

## Migrating to 3.0.0

Every change is listed in the [changelog](./CHANGELOG.md). These are the ones that need a code change.

### Call `configure` once

```js
// 2.x
import { Stage, Sprite } from "react-pixi-fiber";
// 3.0.0, in the app entry, before the first render
import { configure } from "react-pixi-fiber";
import react18 from "@react-pixi-fiber/react-18";
import pixi6 from "@react-pixi-fiber/pixi-6";

configure({ react: react18(), pixi: pixi6() });
```

The core no longer depends on `react-reconciler` or `pixi.js`; the adapters bring them. Install the adapters from the table in [Setup](#setup). Components keep importing from `react-pixi-fiber`. Without `configure`, the first `Stage` mount, `render` call or created instance throws, on React 18:

```
react-pixi-fiber is not configured. Install the adapters for your React and PixiJS versions and call `configure` once, before the first render:

  npm install @react-pixi-fiber/react-18 @react-pixi-fiber/pixi-N

  import { configure } from "react-pixi-fiber";
  import react18 from "@react-pixi-fiber/react-18";
  import pixiN from "@react-pixi-fiber/pixi-N";

  configure({ react: react18(), pixi: pixiN() });

Replace N with your PixiJS major version (4 to 8).
```

Call it once. A second call after a render warns in development: trees already rendered keep their React renderer, new PixiJS instances use the new adapters.

### `CustomPIXIComponent` is `PIXIComponent`

```js
// 2.x
const Circle = CustomPIXIComponent(
  {
    customDisplayObject: props => new PIXI.Graphics(),
    customApplyProps: (instance, oldProps, newProps) => { /* draw */ },
    customDidAttach: instance => {},
    customWillDetach: instance => {},
  },
  "Circle"
);
CustomPIXIProperty("Circle", "radius", value => typeof value === "number");
// 3.0.0
const Circle = PIXIComponent("Circle", {
  create: props => new PIXI.Graphics(),
  applyProps: (instance, oldProps, newProps) => { /* draw */ },
  afterAdd: instance => {},
  beforeRemove: instance => {},
});
PIXIProperty("Circle", "radius", value => typeof value === "number");
```

The type comes first and the behavior keys are `create`, `applyProps`, `afterAdd` and `beforeRemove`. The TypeScript types lose the `Custom` prefix: `CustomPIXIComponentBehavior` is `PIXIComponentBehavior`, `CustomDisplayObjectPropSetter` is `DisplayObjectPropSetter`, and so on. The 2.x names, argument order and keys keep working in 3.x with a development warning and are removed in 4.0.0.

The behavior is read with `{ ...behavior }`, so only its own properties count. A behavior that is a class instance must set its functions as own properties, methods on the prototype are not found.

### Re-apply props from a higher-order component with `applyProps`

```js
// 2.x, for example an `animated` binding
if (typeof instance._customApplyProps === "function") instance._customApplyProps(instance, {}, props);
else applyDisplayObjectProps(instance.constructor.name, instance, {}, props);
// 3.0.0
import { applyProps } from "react-pixi-fiber";
applyProps(instance, {}, props);
```

`_customApplyProps`, `_customDidAttach` and `_customWillDetach` are no longer set on the display object. `applyProps` works for every instance React Pixi Fiber created, built-in or custom, and `getInstanceTag(instance)` returns its tag.

### Read the application in `onInit`, not from the ref at mount

```jsx
// 2.x
<Stage ref={ref} />;  useEffect(() => { ref.current._app.current.ticker.add(tick); }, []);
// 3.0.0
<Stage onInit={app => app.ticker.add(tick)} />
```

`Stage` creates the application asynchronously and renders its children after it commits. `ref.current._app.current` is `null` until then, and reading it early warns in development. `onInit(app)` runs once the application exists and the children are rendered, and again with the new application when an `options` change recreates it.

Tests that check what `Stage` rendered right after `act()` need an async `act`:

```js
// 2.x
act(() => { renderer = create(<Stage><Sprite /></Stage>); });
// 3.0.0
await act(async () => { renderer = create(<Stage><Sprite /></Stage>); });
```

### `createStageClass` returns the function `Stage`

```js
// 2.x
const Stage = createStageClass();
// 3.0.0
import { Stage } from "react-pixi-fiber";
```

`Stage` is no longer a class component. `createStageClass()` returns the function `Stage` with a development warning and is removed in 4.0.0. `Stage` has no `defaultProps`, so `ref.current.props.options` is `undefined` when `options` is not passed.

### No UMD build, no `prop-types`

```html
<!-- 2.x -->
<script src="https://unpkg.com/react-pixi-fiber/umd/react-pixi-fiber.production.min.js"></script>
```

```js
// 3.0.0: install and import the package through a bundler
import { Stage, Sprite } from "react-pixi-fiber";
```

`prop-types` is no longer a peer dependency and props are not checked with it. Remove it from your dependencies if nothing else uses it.

### The `react-pixi-alias` subpath is removed

```js
// 2.x
import ReactPIXI from "react-pixi-fiber/react-pixi-alias";
// webpack: resolve: { alias: { "react-pixi$": "react-pixi-fiber/react-pixi-alias" } }
// 3.0.0
import { Stage, Container, Sprite } from "react-pixi-fiber";
```

Drop the alias from your build and test config. See [Migrating from `react-pixi`](#migrating-from-react-pixi) for the names.

### Prop validation warnings under `<StrictMode>`

```jsx
<Stage>
  <StrictMode>
    <Container buttonmode />
  </StrictMode>
</Stage>
// 2.x on React 18: no warning
// 3.0.0 in development: warns that `buttonmode` should be `buttonMode`
```

Development prop validation runs only under a `<StrictMode>` inside `Stage` (or inside the tree passed to `render`). On React 18 and 19 it never ran in 2.x, because the library checked React 17's mode bit. You may see new warnings for casing, wrong value types and `PIXIProperty` validators. They are warnings, not errors.

### Unknown props are set on the instance

```jsx
<Container sortableChildren zIndex={2} textur={texture} />
// 2.x: `sortableChildren` was dropped (untyped boolean), `textur` was reported in development
// 3.0.0: all three are set on the PIXI.Container, nothing is reported
```

A prop name the library does not type is set as-is, like `@pixi/react` does, so a typo is not reported. A boolean or function value on such a name is set instead of dropped.

### New tags `AnimatedSprite`, `Mesh`, `MeshSimple`, `MeshPlane`, `MeshRope`, `NineSliceSprite`

```jsx
// 2.x
const AnimatedSprite = CustomPIXIComponent(props => new PIXI.AnimatedSprite(props.textures), "AnimatedSprite");
// 3.0.0
import { AnimatedSprite } from "react-pixi-fiber";
<AnimatedSprite textures={textures} />
```

A component you register under one of these names keeps winning over the built-in tag, with a development warning. Rename your component or remove it and use the built-in one.

### Pass the `Stage` size in `options`

```jsx
// 2.x and 3.0.0: sets `app.stage.width` and `app.stage.height`, the renderer keeps its default size
<Stage width={800} height={600} />
// 3.0.0: sizes the renderer and the canvas
<Stage options={{ width: 800, height: 600 }} />
```

The renderer size comes only from `options.width` and `options.height`, in 2.x and in 3.0.0. The `width` and `height` props never sized the renderer and never reached the `<canvas>` element: both versions set them on `app.stage`, the root `PIXI.Container`, which scales its content. 3.0.0 does the same and warns in development. The props are removed in 4.0.0.

### `NineSlicePlane` is `NineSliceSprite`

```jsx
// 2.x
<NineSlicePlane texture={texture} leftWidth={10} />
// 3.0.0
<NineSliceSprite texture={texture} leftWidth={10} />
```

`NineSlicePlane` keeps working in 3.x. `@react-pixi-fiber/pixi-6` defines `NineSlicePlane` as its own tag, so it creates a `PIXI.NineSlicePlane` without a warning. With an adapter that does not define it, the core maps it to `NineSliceSprite` with a development warning; the mapping is removed in 4.0.0.

### Adapter tags are recorded under their own name

```js
pixi6({ defaults: { NineSliceSprite: { leftWidth: 10 } } });
PIXIProperty("NineSliceSprite", "leftWidth", value => value >= 0);
// applies to <NineSliceSprite />, not to <NineSlicePlane /> from @react-pixi-fiber/pixi-6
getInstanceTag(nineSlicePlaneInstance); // "NineSlicePlane"
```

The tags an adapter adds under its PixiJS class names, for example `NineSlicePlane`, `SimpleMesh`, `SimplePlane` and `SimpleRope` in `@react-pixi-fiber/pixi-6`, create the same display objects as the core tags, but each is a tag of its own. `defaults` and `PIXIProperty` keyed by the core tag do not apply to them, and `getInstanceTag` returns the tag you wrote. Key them by that tag too, or use the core tag.

### PixiJS 6 types import from `@react-pixi-fiber/pixi-6`

```ts
// 2.x
import type { InteractionCompatibility, InteractionEventCompatibility, PixiTypeFallback } from "react-pixi-fiber";
// 3.0.0
import type { InteractionCompatibility, InteractionEventCompatibility, PixiTypeFallback } from "@react-pixi-fiber/pixi-6";
```

`InteractiveComponent` still resolves from `react-pixi-fiber` and is deprecated; import it from `@react-pixi-fiber/pixi-6`.

### Smaller changes

- A prop set to `undefined` resets to the value the instance had before React Pixi Fiber first set it. For example, `Text` `text` goes back to the value the `PIXI.Text` was created with, not `""`.
- `Stage` passes typed prop names and Container prop names, for example `buttonMode` and `interactiveChildren`, to `app.stage`. In 2.x these props went to the `<canvas>` element.
- `AppContext` is typed `Context<Application | null>` and its default value is `null`.
- `Graphics` passes `props.geometry` to the `PIXI.Graphics` constructor.
- The fallbacks to the PixiJS 4 `PIXI.extras`, `PIXI.mesh` and `PIXI.particles` namespaces are removed from the core; PixiJS 4 support moves to the `@react-pixi-fiber/pixi-4` adapter.

---

## Contributing

The main purpose of this repository is to be able to render PixiJS objects inside React Fiber architecture.
 
Development of React Pixi Fiber happens in the open on GitHub, and I would be grateful to the community for any contributions, including bug reports and suggestions.

Read below to learn how you can take part in improving React Pixi Fiber.

### [Code of Conduct](../../CODE_OF_CONDUCT.md)
React Pixi Fiber has adopted a Contributor Covenant Code of Conduct that we expect project participants to adhere to. Please read [the full text](../../CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

### [Contributing Guide](../../CONTRIBUTING.md)

Read the contributing guide to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to React Pixi Fiber.

## License

ReactPixiFiber is [MIT licensed](./LICENSE).


## Credits

### [`react-pixi`]

For making PIXI available in React for the first time.

### [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)

For deeply explaining the concepts of Fiber architecture.

### [Building a custom React renderer](https://github.com/nitin42/Making-a-custom-React-renderer)

For helping me understand how to build an actual renderer.

### [React ART](https://github.com/facebook/react/tree/master/packages/react-art)

On which this renderer was initially based.

### [React] Contributors

For making an awesome project structure and documentation that is used in similar fashon here.


[PixiJS]: https://github.com/pixijs/pixi.js
[React]: https://github.com/facebook/react
[Root Container]: https://pixijs.download/v6.5.10/docs/PIXI.Application.html#stage
[`PIXI.Application`]: https://pixijs.download/v6.5.10/docs/PIXI.Application.html
[`PIXI.BitmapText`]: https://pixijs.download/v6.5.10/docs/PIXI.BitmapText.html
[`PIXI.Container`]: https://pixijs.download/v6.5.10/docs/PIXI.Container.html
[`PIXI.DisplayObject`]: https://pixijs.download/v6.5.10/docs/PIXI.DisplayObject.html 
[`PIXI.Graphics`]: https://pixijs.download/v6.5.10/docs/PIXI.Graphics.html
[`PIXI.ObservablePoint`]: https://pixijs.download/v6.5.10/docs/PIXI.ObservablePoint.html
[`PIXI.ParticleContainer`]: https://pixijs.download/v6.5.10/docs/PIXI.ParticleContainer.html
[`PIXI.Point`]: https://pixijs.download/v6.5.10/docs/PIXI.Point.html
[`PIXI.Sprite`]: https://pixijs.download/v6.5.10/docs/PIXI.Sprite.html
[`PIXI.Text`]: https://pixijs.download/v6.5.10/docs/PIXI.Text.html
[`PIXI.TilingSprite`]: https://pixijs.download/v6.5.10/docs/PIXI.TilingSprite.html
[`react-pixi`]: https://github.com/Izzimach/react-pixi
