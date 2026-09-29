# @react-pixi-fiber/react-17

React 17 adapter for [react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber). It bundles `react-reconciler` 0.26.2 and builds the renderer that `react-pixi-fiber` uses to render PixiJS display objects.

Install it next to `react-pixi-fiber`, `react` 17 and a PixiJS adapter from the [adapter table](https://github.com/michalochman/react-pixi-fiber/tree/master/packages/react-pixi-fiber#setup), then configure once in the app entry, before the first render:

```js
import { configure } from "react-pixi-fiber";
import react17 from "@react-pixi-fiber/react-17";
import pixiN from "@react-pixi-fiber/pixi-N"; // the PixiJS adapter for your PixiJS version

configure({ react: react17(), pixi: pixiN() });
```
