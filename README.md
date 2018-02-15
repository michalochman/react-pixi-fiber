# ReactPixiFiber – React Fiber renderer for PixiJS

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
  return (
    <Sprite texture={PIXI.Texture.fromImage(bunny)} {...props} />
  );
}

render(
  <Stage width={800} height={600} options={{ backgroundColor: 0x10bb99 }}>
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
const app = new PIXI.Application(800, 600, {
  backgroundColor: 0x10bb99,
  view: canvasElement
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

The current version assumes [React](https://github.com/facebook/react) >16.0.0 and [PixiJS] >4.4.0

    yarn add react-pixi-fiber

or

    npm install react-pixi-fiber --save

This package works flawlessly with [Create React App](https://github.com/facebookincubator/create-react-app) – see examples above, they already use it.


## Migrating from [`react-pixi`]

It is possible to use React Pixi Fiber as a drop-in replacement for `react-pixi`. 

> Please note that it has only been tested with basic scenarios – it is not guaranteed to work flawlessly. 

There are two options:

### Changing `import` / `require` statements

Change:
    
    import ReactPIXI from "react-pixi";
    // or
    const ReactPIXI = require("react-pixi");

to:
 
    import ReactPIXI from "react-pixi-fiber/react-pixi-alias";
    // or
    const ReactPIXI = require("react-pixi-fiber/react-pixi-alias");

### Using `webpack` resolve `alias`

    resolve: {
      alias: {
        'react-pixi$': 'react-pixi-fiber/react-pixi-alias'
      }
    }


## API

### Components

React Pixi Fiber currently supports following components:

#### `<Stage />`

Renders [Root Container] of any [`PIXI.Application`].

Expects the following props:
* `width` (can be also passed in `options`),
* `height` (can be also passed in `options`),
* `options` - see [`PIXI.Application`] options.

Provides the following context:
* `app` – an instance of PixiJS Application, with properties like:
  * `loader` – Loader instance to help with asset loading,
  * `renderer` – WebGL or CanvasRenderer,
  * `ticker` – Ticker for doing render updates,
  * `view` – reference to the renderer's canvas element.

#### `<Container />`

Renders [`PIXI.Container`].

#### `<Graphics />`

Renders [`PIXI.Graphics`].

#### `<Sprite />`

Renders [`PIXI.Sprite`].

#### `<TilingSprite />`

Renders [`PIXI.extras.TilingSprite`].

#### `<Text />`

Renders [`PIXI.Text`].

#### `<BitmapText />`

Renders [`PIXI.extras.BitmapText`].


## Testing


## Caveats


## FAQ

### Can I migrate from `react-pixi`?

Yes, it is easy, read [migration guide](#migrating-from-react-pixi).

### Is this production ready?

Not yet.


## Contributing

The main purpose of this repository is to be able to render PixiJS objects inside React 16 Fiber architecture.
 
Development of React Pixi Fiber happens in the open on GitHub, and I would be grateful to the community for any contributions, including bug reports and suggestions.

Read below to learn how you can take part in improving React Pixi Fiber.

### [Code of Conduct](https://github.com/michalochman/react-pixi-fiber/blob/master/CODE_OF_CONDUCT.md)
React Pixi Fiber has adopted a Contributor Covenant Code of Conduct that we expect project participants to adhere to. Please read [the full text](https://github.com/michalochman/react-pixi-fiber/blob/master/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

### [Contributing Guide](https://github.com/michalochman/react-pixi-fiber/blob/master/CONTRIBUTING.md)

Read the contributing guide to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to React Pixi Fiber.


### License

React Fiber Pixi is [MIT licensed]((https://github.com/michalochman/react-pixi-fiber/blob/master/LICENSE)).


## Credits

### [`react-pixi`]

For making PIXI available in React for the first time.

### [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)

For deeply explaining the concepts of Fiber architecture.

### [Building a custom React renderer](https://github.com/nitin42/Making-a-custom-React-renderer)

For helping me understand how to build an actual renderer.

### [React ART](https://github.com/facebook/react/tree/master/packages/react-art)

On which this renderer was initially based.

### [React](https://github.com/facebook/react) Contributors

For making an awesome project structure and documentation that is used in similar fashon here.


[PixiJS]: https://github.com/pixijs/pixi.js
[`react-pixi`]: https://github.com/Izzimach/react-pixi
[`PIXI.Application`]: http://pixijs.download/release/docs/PIXI.Application.html
[Root Container]: http://pixijs.download/release/docs/PIXI.Application.html#stage
[`PIXI.Container`]: http://pixijs.download/release/docs/PIXI.Container.html
[`PIXI.Graphics`]: http://pixijs.download/release/docs/PIXI.Graphics.html
[`PIXI.Sprite`]: http://pixijs.download/release/docs/PIXI.Sprite.html
[`PIXI.extras.TilingSprite`]: http://pixijs.download/release/docs/PIXI.extras.TilingSprite.html
[`PIXI.Text`]: http://pixijs.download/release/docs/PIXI.Text.html
[`PIXI.extras.BitmapText`]: http://pixijs.download/release/docs/PIXI.extras.BitmapText.html
