# ReactPixiFiber – React Fiber renderer for PIXI.js

ReactPixiFiber is a JavaScript library for writing PIXI.js applications using React declarative style in React 16.

For React <16.0.0 see [react-pixi](https://github.com/Izzimach/react-pixi).

## Demo

See [Rotating Bunny](https://codesandbox.io/s/q7oj1p0jo6) demo.


## Usage

```jsx harmony
import { Sprite, Stage } from "react-pixi-fiber";
import bunny from "./bunny.png";

function Bunny(props) {
  return (
    <Sprite texture={PIXI.Texture.fromImage(bunny)} {...props} />
  );
}

ReactDOM.render(
  <Stage width={800} height={600}>
    <Bunny x={200} y={200} />
  </Stage>,
  document.getElementById('container')
);
```

This example will render PIXI.js [Sprite](http://pixijs.download/release/docs/PIXI.Sprite.html) object into a [root Container](http://pixijs.download/release/docs/PIXI.Application.html#stage) of PIXI Application on the page.

The HTML-like syntax; [called JSX](https://reactjs.org/docs/introducing-jsx.html) is not required to use with this renderer, but it makes code more readable. You can use [Babel](https://babeljs.io/) with a [React preset](https://babeljs.io/docs/plugins/preset-react/) to convert JSX into native JavaScript.


## Running Examples

1. Run `yarn install` (or `npm install`) in the repository root.
2. Run `yarn install` (or `npm install`) in the `examples` directory.
3. Run `yarn start` (or `npm run start`) in the `examples` directory.
4. Wait few seconds and browse examples that will open in new browser window.


## Installing

The current version assumes [React](https://github.com/facebook/react) >16.0.0 and [PIXI.js](https://github.com/pixijs/pixi.js) >4.4.0

    yarn add react-pixi-fiber

or

    npm install react-pixi-fiber --save

This package works flawlessly with [Create React App](https://github.com/facebookincubator/create-react-app) – see examples above, they already use it.


## API

### Components

React Pixi Fiber currently supports following components:

#### `<Stage />`

[Root Container](http://pixijs.download/release/docs/PIXI.Application.html#stage) of any [PIXI.js application](PIXIjs.download/release/docs/PIXI.Application.html).

Provides the following context:
* `app` – an instance of PIXI.js Application, with properties like:
  * `loader` – Loader instance to help with asset loading
  * `renderer` – WebGL or CanvasRenderer
  * `ticker` – Ticker for doing render updates
  * `view` – reference to the renderer's canvas element

#### `<Container />`

[PIXI.Container](http://pixijs.download/release/docs/PIXI.Container.html)

#### `<Graphics />`

[PIXI.Graphics](http://pixijs.download/release/docs/PIXI.Graphics.html)

#### `<Sprite />`

[PIXI.Sprite](http://pixijs.download/release/docs/PIXI.Sprite.html)

#### `<TilingSprite />`

[PIXI.extras.TilingSprite](http://pixijs.download/release/docs/PIXI.extras.TilingSprite.html)

#### `<Text />`

[PIXI.Text](http://pixijs.download/release/docs/PIXI.Text.html)

#### `<BitmapText />`

[PIXI.extras.BitmapText](http://pixijs.download/release/docs/PIXI.extras.BitmapText.html)


## Testing


## Caveats


## Contributing

The main purpose of this repository is to be able to render PIXI.js objects inside React 16 Fiber architecture.
 
Development of React Pixi Fiber happens in the open on GitHub, and I would be grateful to the community for any contributions, including bug reports and suggestions.

Read below to learn how you can take part in improving React Pixi Fiber.

### [Contributing Guide](https://github.com/michalochman/react-pixi-fiber/blob/master/CONTRIBUTING.md)

Read the contributing guide to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to React Pixi Fiber.


### License

React Fiber Pixi is [MIT licensed]((https://github.com/michalochman/react-pixi-fiber/blob/master/LICENSE)).


## Credits

### [react-pixi](https://github.com/Izzimach/react-pixi)

For making PIXI available in React for the first time.

### [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)

For deeply explaining the concepts of Fiber architecture.

### [Building a custom React renderer](https://github.com/nitin42/Making-a-custom-React-renderer)

For helping me understand how to build an actual renderer.

### [React ART](https://github.com/facebook/react/tree/master/packages/react-art)

On which this renderer was initially based.

### [React](https://github.com/facebook/react) Contributors

For making an awesome project structure and documentation that is used in similar fashon here.
