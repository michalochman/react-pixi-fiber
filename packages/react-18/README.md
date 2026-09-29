# @react-pixi-fiber/react-18

React 18 adapter for [react-pixi-fiber](https://github.com/michalochman/react-pixi-fiber). It bundles `react-reconciler` 0.29.2 and builds the renderer that `react-pixi-fiber` uses to render PixiJS display objects. Install it next to `react-pixi-fiber`, `react` 18 and the PixiJS adapter for your PixiJS major, then configure once in the app entry, before the first render:

```js
import { configure } from "react-pixi-fiber";
import react18 from "@react-pixi-fiber/react-18";
import pixi6 from "@react-pixi-fiber/pixi-6";

configure({ react: react18(), pixi: pixi6() });
```
