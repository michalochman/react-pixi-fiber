# @react-pixi-fiber/react-18

React 18 adapter for [react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber). It bundles `react-reconciler` 0.29.2 and builds the renderer that `react-pixi-fiber` uses to render PixiJS display objects. It needs React 18.3.1 or a later 18.x, the peer range of that `react-reconciler`.

Install it next to `react-pixi-fiber`, `react` 18 and a PixiJS adapter from the [adapter table](../react-pixi-fiber/README.md#setup), then configure once in the app entry, before the first render:

```js
import { configure } from "react-pixi-fiber";
import react18 from "@react-pixi-fiber/react-18";
import pixiN from "@react-pixi-fiber/pixi-N"; // the PixiJS adapter for your PixiJS version

configure({ react: react18(), pixi: pixiN() });
```
