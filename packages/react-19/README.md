# @react-pixi-fiber/react-19

React 19 adapter for [react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber). It bundles `react-reconciler` 0.34.0 and builds the renderer that `react-pixi-fiber` uses to render PixiJS display objects.

Install it next to `react-pixi-fiber`, `react` 19 and a PixiJS adapter from the [adapter table](https://github.com/michalochman/react-pixi-fiber/tree/master/packages/react-pixi-fiber#setup), then configure once in the app entry, before the first render:

```js
import { configure } from "react-pixi-fiber";
import react19 from "@react-pixi-fiber/react-19";
import pixiN from "@react-pixi-fiber/pixi-N"; // the PixiJS adapter for your PixiJS version

configure({ react: react19(), pixi: pixiN() });
```
