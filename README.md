# ReactPixiFiber – React Fiber renderer for PixiJS 
[![npm](https://img.shields.io/npm/v/react-pixi-fiber.svg)](https://npmjs.com/package/react-pixi-fiber)
[![License](https://img.shields.io/github/license/michalochman/react-pixi-fiber.svg)](https://github.com/michalochman/react-pixi-fiber/blob/master/LICENSE)
[![CircleCI](https://img.shields.io/circleci/project/github/michalochman/react-pixi-fiber/master.svg)](https://circleci.com/gh/michalochman/react-pixi-fiber/tree/master)
[![codecov](https://img.shields.io/codecov/c/github/michalochman/react-pixi-fiber/master.svg)](https://codecov.io/gh/michalochman/react-pixi-fiber/branch/master)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![gitter](https://img.shields.io/gitter/room/react-pixi-fiber/Lobby.svg)](https://gitter.im/react-pixi-fiber/Lobby)

ReactPixiFiber is a JavaScript library for writing PixiJS applications using React declarative style in React 16.

For React <16.0.0 see [`react-pixi`].

## Demo

See [Rotating Bunny](https://codesandbox.io/s/q7oj1p0jo6) demo.


## Usage

### With ReactDOM

```jsx harmony
import { render } from "react-dom";
import { Sprite, Stage } from "react-pixi-fiber";
import bunny from "./bunny.png";

function Bunny(props) {
  return <Sprite texture={PIXI.Texture.from(bunny)} {...props} />;
}

render(
  <Stage options={{ backgroundColor: 0x10bb99, height: 600, width: 800 }}>
    <Bunny x={200} y={200} />
  </Stage>,
  document.getElementById("container")
);
```

This example will render [`PIXI.Sprite`] object into a [Root Container] of [`PIXI.Application`] on the page.

The HTML-like syntax; [called JSX](https://reactjs.org/docs/introducing-jsx.html) is not required to use with this renderer, but it makes code more readable. You can use [Babel](https://babeljs.io/) with a [React preset](https://babeljs.io/docs/plugins/preset-react/) to convert JSX into native JavaScript.


### Without ReactDOM

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


## Running Examples

1. Run `yarn install` (or `npm install`) in the repository root.
2. Run `yarn install` (or `npm install`) in the `examples` directory.
3. Run `yarn start` (or `npm run start`) in the `examples` directory.
4. Wait few seconds and browse examples that will open in new browser window.


## Installing

The current version assumes [React] >16.0.0 and [PixiJS] >4.4.0

    yarn add react-pixi-fiber

or

    npm install react-pixi-fiber --save

This package works flawlessly with [Create React App](https://github.com/facebookincubator/create-react-app) – see examples above, they already use it.


## Migrating from [`react-pixi`]

It is possible to use React Pixi Fiber as a drop-in replacement for `react-pixi`. 

There are two options:

### Changing `import` / `require` statements

Change:

```js
import ReactPIXI from "react-pixi";
// or
const ReactPIXI = require("react-pixi");
```

to:
 
 ```js
import ReactPIXI from "react-pixi-fiber/react-pixi-alias";
// or
const ReactPIXI = require("react-pixi-fiber/react-pixi-alias");
```

### Using `webpack` resolve `alias`

```js
resolve: {
  alias: {
    'react-pixi$': 'react-pixi-fiber/react-pixi-alias'
  }
}
```

## API

### Components

React Pixi Fiber currently supports following components:

#### `<Stage />`

Renders [Root Container] of any [`PIXI.Application`].

Expects **one** the following props:
* `app` - pass your own [`PIXI.Application`] instance,
* `options` - pass only the [`PIXI.Application`] options.

#### `<Container />`

Renders [`PIXI.Container`].

#### `<Graphics />`

Renders [`PIXI.Graphics`].

#### `<ParticleContainer />`

Renders [`PIXI.particles.ParticleContainer`].

#### `<Sprite />`

Renders [`PIXI.Sprite`].

#### `<TilingSprite />`

Renders [`PIXI.extras.TilingSprite`].

#### `<Text />`

Renders [`PIXI.Text`].

#### `<BitmapText />`

Renders [`PIXI.extras.BitmapText`].

#### `<NineSlicePlane />`

Renders [`PIXI.NineSlicePlane`].

### Props

[Similarly](https://reactjs.org/blog/2017/09/08/dom-attributes-in-react-16.html) to ReactDOM in React 16, 
ReactPixiFiber is not ignoring unknown [`PIXI.DisplayObject`] members – they are all passed through. You can read 
more about [Unknown Prop Warning](https://reactjs.org/warnings/unknown-prop.html)  in ReactDOM, however 
ReactPixiFiber will not warn you about unknown members. 

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

### Custom Components

ReactPixiFiber can recognize your custom components using API compatible with `react-pixi`.

`CustomPIXIComponent(behavior, type)` accepts a `behavior` object with the following 4 properties and a `type` string.

#### `customDisplayObject(props)`

Use this to create an instance of [PIXI.DisplayObject]. 

This is your entry point to custom components and the only required method. Can be also passed as `behavior` of type `function` to `CustomPIXIComponent`.

#### `customApplyProps(displayObject, oldProps, newProps)` (optional)

Use this to apply `newProps` to your `Component` in a custom way.

Note: this replaces the default method of transfering `props` to the specified `displayObject`. Call `this.applyDisplayObjectProps(oldProps,newProps)` inside your `customApplyProps` method if you want that.

#### `customDidAttach(displayObject)` (optional)

Use this to do something after `displayObject` is attached, which happens **after** `componentDidMount` lifecycle method.

#### `customWillDetach(displayObject)` (optional)

Use this to do something (usually cleanup) before detaching, which happens **before** `componentWillUnmount` lifecycle method.

#### Simple Graphics example

For example, this is how you could implement `Rectangle` component:
```javascript
// components/Rectangle.js
import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

const TYPE = "Rectangle";
export const behavior = {
  customDisplayObject: props => new PIXI.Graphics(),
  customApplyProps: function(instance, oldProps, newProps) {
    const { fill, x, y, width, height } = newProps;
    instance.clear();
    instance.beginFill(fill);
    instance.drawRect(x, y, width, height);
    instance.endFill();
  }
};
export default CustomPIXIComponent(behavior, TYPE);
```

```jsx harmony
// App.js
import { render } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import Rectangle from "./components/Rectangle"

// Setup PixiJS Application
const canvasElement = document.getElementById("container")
const app = new PIXI.Application(800, 600, {
  view: canvasElement
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

### React Context API limitations

Because of a [React limitation preventing context to pass through renderers](https://github.com/facebook/react/issues/13336), new React Context API (react >= 16.3.0) cannot be used inside Stage inner components. Even if you're not using this feature directly, some of your dependencies may use it (react-redux, material-ui, ...).

A workaround would be to "make a bridge" between default renderer and react-pixi-fiber one. For example:
```jsx harmony
// use example
export const App = () => {

  return (
    <GameTitleContext.Provider value={'game title'}>
      <GameTitleContext.Consumer>
        {title => <h1>{title}</h1>}
      <GameTitleContext.Consumer>
      
      <ContextBridge
        contexts={[
          GameTitleContext,
          ReactReduxContext,
          OtherContext,
        ]}
        barrierRender={children => (
          <Stage options={{ height: 600, width: 800 }}>
            {children}
          </Stage>
        )}
      >
        <Container>
          <GameTitleContext.Consumer>
            {title => <Text text={title} />}
          </GameTitleContext.Consumer>
        </Container>
      </ContextBridge>
    </GameTitleContext.Provider>
  );
};
```

```jsx harmony
// context-bridge component

/*
 * type ContextBridgeProps = {
 *    contexts: React.Context<any>[];
 *    barrierRender: (children: React.ReactElement | null) => React.ReactElement | null;
 *    children: React.ReactNode;
 * };
 */

export const ContextBridge = ({ barrierRender, contexts, children }) => {

    const providers = values => {

        const getValue = i => values[ values.length - 1 - i ];

        return <>
          {contexts.reduce((innerProviders, Context, i) => (
            <Context.Provider value={getValue(i)}>
                {innerProviders}
            </Context.Provider>
          ), children)}
        </>;
    };

    const consumers = contexts.reduce((getChildren, Context) => (
        values => <Context.Consumer>
            {value => getChildren([ ...values, value ])}
        </Context.Consumer>
    ), values => barrierRender(providers(values)));

    return consumers([]);
};
```

More infos & workarounds: [#93](https://github.com/michalochman/react-pixi-fiber/issues/93) [#84 (comment)](https://github.com/michalochman/react-pixi-fiber/pull/84#issuecomment-437581875)


## FAQ

### Is it production ready?

Yes! Awesome!

### What version of PixiJS I can use?

Both PixiJS v4 and v5 are supported.

### Can I use already existing [`PIXI.Application`]?

Yes, you can pass `app` property to `Stage` component, e.g. `<Stage app={app} />`.

### Can I migrate from `react-pixi`?

Yes, it is easy, read [migration guide](#migrating-from-react-pixi).

### Is server-side rendering supported?

No, unfortunately it is not supported right now.

## Contributing

The main purpose of this repository is to be able to render PixiJS objects inside React 16 Fiber architecture.
 
Development of React Pixi Fiber happens in the open on GitHub, and I would be grateful to the community for any contributions, including bug reports and suggestions.

Read below to learn how you can take part in improving React Pixi Fiber.

### [Code of Conduct](https://github.com/michalochman/react-pixi-fiber/blob/master/CODE_OF_CONDUCT.md)
React Pixi Fiber has adopted a Contributor Covenant Code of Conduct that we expect project participants to adhere to. Please read [the full text](https://github.com/michalochman/react-pixi-fiber/blob/master/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

### [Contributing Guide](https://github.com/michalochman/react-pixi-fiber/blob/master/CONTRIBUTING.md)

Read the contributing guide to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to React Pixi Fiber.

### Contact

You can help others and discuss in our [gitter channel](https://gitter.im/react-pixi-fiber/Lobby).


## License

ReactPixiFiber is [MIT licensed]((https://github.com/michalochman/react-pixi-fiber/blob/master/LICENSE)).


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
[Root Container]: http://pixijs.download/release/docs/PIXI.Application.html#stage
[`PIXI.Application`]: http://pixijs.download/release/docs/PIXI.Application.html
[`PIXI.Container`]: http://pixijs.download/release/docs/PIXI.Container.html
[`PIXI.DisplayObject`]: http://pixijs.download/release/docs/PIXI.DisplayObject.html 
[`PIXI.extras.BitmapText`]: http://pixijs.download/release/docs/PIXI.extras.BitmapText.html
[`PIXI.extras.TilingSprite`]: http://pixijs.download/release/docs/PIXI.extras.TilingSprite.html
[`PIXI.Graphics`]: http://pixijs.download/release/docs/PIXI.Graphics.html
[`PIXI.NineSlicePlane`]: http://pixijs.download/release/docs/PIXI.NineSlicePlane.html
[`PIXI.ObservablePoint`]: http://pixijs.download/release/docs/PIXI.ObservablePoint.html
[`PIXI.particles.ParticleContainer`]: http://pixijs.download/release/docs/PIXI.particles.ParticleContainer.html
[`PIXI.Point`]: http://pixijs.download/release/docs/PIXI.Point.html
[`PIXI.Sprite`]: http://pixijs.download/release/docs/PIXI.Sprite.html
[`PIXI.Text`]: http://pixijs.download/release/docs/PIXI.Text.html
[`react-pixi`]: https://github.com/Izzimach/react-pixi
