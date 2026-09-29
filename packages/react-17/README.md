# @react-pixi-fiber/react-17

React 17 adapter for [react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber). It bundles `react-reconciler` 0.26.2 and builds the renderer that `react-pixi-fiber` uses to render PixiJS display objects. It needs React 17.0.2 or a later 17.x, the peer range of that `react-reconciler`.

Install it next to `react-pixi-fiber`, `react` 17 and a PixiJS adapter from the [adapter table](../react-pixi-fiber/README.md#setup), then configure once in the app entry, before the first render:

```js
import { configure } from "react-pixi-fiber";
import react17 from "@react-pixi-fiber/react-17";
import pixiN from "@react-pixi-fiber/pixi-N"; // the PixiJS adapter for your PixiJS version

configure({ react: react17(), pixi: pixiN() });
```

## Supported features

The tree inside `Stage`, or inside a container passed to `render`, is its own React root. Features that are plain React work as the [React 17 documentation](https://legacy.reactjs.org/docs/getting-started.html) describes.

| Feature | Support |
| --- | --- |
| Context, error boundaries, hooks, refs | Supported. A ref on a tag receives the PixiJS display object |
| Concurrent features | Not available: the root is a legacy root, as `ReactDOM.render` creates |
| DevTools | The renderer registers with React DevTools as `react-pixi-fiber` in development |
| Errors while rendering | Thrown from `render` and caught by error boundaries, as in React 17 |
| `<StrictMode>` | Development prop validation runs under a `<StrictMode>` ancestor (React 17 mode bit `1`) |
| `<Suspense>` | Supported. A suspended subtree is hidden with `visible = false` and shown again with its `visible` prop |
| Text children | Not supported: a string child throws; use the `Text` tag |
