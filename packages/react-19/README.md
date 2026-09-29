# @react-pixi-fiber/react-19

React 19 adapter for [react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber). It bundles `react-reconciler` 0.34.0 and builds the renderer that `react-pixi-fiber` uses to render PixiJS display objects. It needs React 19.3 or newer, the peer range of that `react-reconciler`.

Install it next to `react-pixi-fiber`, `react` 19 and a PixiJS adapter from the [adapter table](../react-pixi-fiber/README.md#setup), then configure once in the app entry, before the first render:

```js
import { configure } from "react-pixi-fiber";
import react19 from "@react-pixi-fiber/react-19";
import pixiN from "@react-pixi-fiber/pixi-N"; // the PixiJS adapter for your PixiJS version

configure({ react: react19(), pixi: pixiN() });
```

An error thrown while rendering is reported to `console.error` instead of being thrown from `render()`.

`<ViewTransition>` inside `Stage` renders its children without animating.

A `<Fragment ref>` inside `Stage` receives the fragment's top-level display objects:

- `children` lists them.
- `getBounds()` returns the bounds of each.
- `off(event, fn)` removes a listener that `on` added.
- `on(event, fn)` adds a listener to each, including display objects added to the fragment later.

Type the ref with `useRef<PixiFragmentInstance>(null)`, or annotate a callback ref: `ref={(instance: PixiFragmentInstance | null) => ...}` (`PixiFragmentInstance` is a type export of `react-pixi-fiber`).
